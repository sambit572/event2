import { UserBookingHistory } from "../../model/user/userBookinghistory.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";

export const createUserBookingHistory = async (req, res) => {
  try {
    const {
      userId,
      userDetailsId,
      location,
      startDate,
      endDate,
      amount,
      reDirectTo,
    } = req.body;

    console.log("Received booking history data:", req.body);

    // ✅ Basic field validation
    if (
      !userId ||
      !userDetailsId ||
      !location ||
      !startDate ||
      !endDate ||
      amount === undefined ||
      amount === null
    ) {
      return res
        .status(400)
        .json(new ApiError(400, "Missing required fields."));
    }

    if (!reDirectTo) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "reDirectTo field is required. It must be sent from frontend"
          )
        );
    }

    // ✅ Create booking history entry
    const newHistory = await UserBookingHistory.create({
      userId,
      userDetailsId,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      amount,
      reDirectTo,
    });

    // ✅ Respond
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newHistory,
          "Booking history created successfully."
        )
      );
  } catch (error) {
    console.error("Error creating booking history:", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal Server Error while creating booking history.",
          error.message
        )
      );
  }
};

/**
 * Update booking status (and sync with user history)
 */
export const updateUserHistory = async (req, res) => {
  try {
    const { userDetailsId, reDirectTo, venueInput } = req.body;
    console.log("Update request body:", req.body);

    if (!userDetailsId || !reDirectTo || !venueInput) {
      return res.status(400).json({
        success: false,
        message: "userDetailsId, reDirectTo, and venueInput are required.",
      });
    }

    // Step 2: Update user booking history
    await UserBookingHistory.findOneAndUpdate(
      { userDetailsId },
      { reDirectTo, location: venueInput },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Booking history updated successfully.")
      );
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
};

/**
 * Get all bookings for a user (with optional status filter)
 */
export const getUserBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // Build match stage
    const matchStage = { userId };
    if (status) matchStage.bookingStatus = status;

    const bookings = await UserBookingHistory.aggregate([
      // Stage 1: Match bookings for the user
      {
        $match: matchStage,
      },

      // Stage 2: Lookup userDetails
      {
        $lookup: {
          from: "userdetails", // Collection name (lowercase + plural by default)
          localField: "userDetailsId",
          foreignField: "_id",
          as: "userDetailsData",
        },
      },

      // Stage 3: Unwind the userDetailsData array
      {
        $unwind: {
          path: "$userDetailsData",
          preserveNullAndEmptyArrays: true, // Keep bookings even if userDetails is missing
        },
      },

      // Stage 4: Add computed fields
      {
        $addFields: {
          // Calculate total services
          totalServices: {
            $cond: {
              if: { $isArray: "$userDetailsData.serviceId" },
              then: { $size: "$userDetailsData.serviceId" },
              else: 0,
            },
          },
          // Restructure userDetailsId with only needed fields
          userDetailsId: {
            _id: "$userDetailsData._id",
            startDate: "$userDetailsData.startDate",
            endDate: "$userDetailsData.endDate",
            address: "$userDetailsData.address",
            serviceId: "$userDetailsData.serviceId",
          },
        },
      },

      // Stage 5: Remove the temporary userDetailsData field
      {
        $project: {
          userDetailsData: 0,
        },
      },

      // Stage 6: Sort by creation date (newest first)
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
