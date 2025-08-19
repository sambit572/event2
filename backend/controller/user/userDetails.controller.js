import { UserDetails } from "../../model/user/userDetails.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import mongoose from "mongoose";

export const saveDetails = async (req, res) => {
  try {
    // console.log("Received request to save user details:", req.body.formData);

    // Basic payload validation before hitting DB
    const {
      bookedById = req.user.id,
      bookedBy,
      serviceId,
      phone,
      altPhone,
      startDate,
      endDate,
      address,
      landmark,
      state,
      district,
      city,
      pincode,
      country,
    } = req.body.formData;

    if (
      !bookedById ||
      !bookedBy ||
      !serviceId ||
      !phone ||
      !startDate ||
      !endDate ||
      !address ||
      !landmark ||
      !state ||
      !district ||
      !city ||
      !pincode ||
      !country
    ) {
      return res.status(400).json(new ApiError(400, "Missing required fields"));
    }

    // Optional: Validate phone/pincode formats
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json(new ApiError(400, "Invalid phone number"));
    }
    if (altPhone && !/^\d{10}$/.test(altPhone)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid alternate phone number"));
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json(new ApiError(400, "Invalid pincode"));
    }

    // Save details
    const userDetails = await UserDetails.create(
      {
        bookedById,
        bookedBy,
        serviceId,
        phone,
        altPhone,
        startDate,
        endDate,
        address,
        landmark,
        state,
        district,
        city,
        pincode,
        country,
      } // default fallback
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, userDetails, "User details saved successfully")
      );
  } catch (error) {
    console.error("Error saving user details:", error);

    // MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry detected",
        field: Object.keys(error.keyValue),
      });
    }

    // Fallback error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getDetails = async (req, res) => {
  const { userDetailsId } = req.params;

  try {
    const userDetails = await UserDetails.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId.createFromHexString(userDetailsId) },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $addFields: {
          serviceDetails: {
            $arrayElemAt: ["$serviceDetails", 0],
          },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "serviceDetails.vendorId",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      {
        $addFields: {
          vendorDetails: { $arrayElemAt: ["$vendorDetails", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          bookedById: 1,
          bookedBy: 1,
          serviceId: 1,
          phone: 1,
          altPhone: 1,
          startDate: 1,
          endDate: 1,
          address: 1,
          landmark: 1,
          state: 1,
          district: 1,
          city: 1,
          pincode: 1,
          country: 1,
          serviceDetails: {
            _id: "$serviceDetails._id",
            serviceName: "$serviceDetails.serviceName",
            maxPrice: "$serviceDetails.maxPrice",
            minPrice: "$serviceDetails.minPrice",
            vendorId: "$serviceDetails.vendorId",
            serviceCategory: "$serviceDetails.serviceCategory",
          },
          vendorDetails: {
            _id: "$vendorDetails._id",
            fullName: "$vendorDetails.fullName",
            email: "$vendorDetails.email",
          },
        },
      },
    ]);
    if (userDetails.length === 0) {
      return res.status(404).json(new ApiError(404, "User details not found"));
    }
    const data = userDetails[0];
    // console.log("Fetched user details:", data);
    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "User details fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
