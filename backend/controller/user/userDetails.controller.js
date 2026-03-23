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
    const userDetails = await UserDetails.create({
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
    });

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
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(userDetailsId),
        },
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
        $unwind: {
          path: "$serviceDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "serviceDetails.vendorId",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },
      {
        $addFields: {
          "serviceDetails.vendorDetails": {
            $arrayElemAt: ["$vendorInfo", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "bookedById",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // ✅ NEW: Lookup cart items to get catering details
      {
        $lookup: {
          from: "carts",
          let: {
            userId: "$bookedById",
            serviceIds: "$serviceId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $in: ["$serviceId", "$$serviceIds"] },
                  ],
                },
              },
            },
            {
              $project: {
                serviceId: 1,
                isCateringService: 1,
                cateringDetails: 1,
              },
            },
          ],
          as: "cartItems",
        },
      },
      {
        $group: {
          _id: "$_id",
          bookedById: { $first: "$bookedById" },
          bookedBy: { $first: "$bookedBy" },
          serviceId: { $first: "$serviceId" },
          phone: { $first: "$phone" },
          userEmail: { $first: "$userDetails.email" },
          altPhone: { $first: "$altPhone" },
          startDate: { $first: "$startDate" },
          endDate: { $first: "$endDate" },
          address: { $first: "$address" },
          landmark: { $first: "$landmark" },
          state: { $first: "$state" },
          district: { $first: "$district" },
          city: { $first: "$city" },
          pincode: { $first: "$pincode" },
          country: { $first: "$country" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          cartItems: { $first: "$cartItems" }, // ✅ Include cart items
          serviceDetails: {
            $push: {
              _id: "$serviceDetails._id",
              serviceName: "$serviceDetails.serviceName",
              maxPrice: "$serviceDetails.maxPrice",
              minPrice: "$serviceDetails.minPrice",
              vendorId: "$serviceDetails.vendorId",
              serviceCategory: "$serviceDetails.serviceCategory",
              description: "$serviceDetails.description",
              images: "$serviceDetails.images",
              stateLocationOffered: "$serviceDetails.stateLocationOffered",
              pricingType: "$serviceDetails.pricingType", // ✅ Include pricing type
              packages: "$serviceDetails.packages", // ✅ Include packages
              vendorDetails: {
                _id: "$serviceDetails.vendorDetails._id",
                fullName: "$serviceDetails.vendorDetails.fullName",
                email: "$serviceDetails.vendorDetails.email",
                phone: "$serviceDetails.vendorDetails.phoneNumber",
                businessName: "$serviceDetails.vendorDetails.businessName",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          bookedById: 1,
          bookedBy: 1,
          serviceId: 1,
          phone: 1,
          userEmail: 1,
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
          createdAt: 1,
          updatedAt: 1,
          cartItems: 1, // ✅ Include in final projection
          serviceDetails: 1,
        },
      },
    ]);

    if (userDetails.length === 0) {
      return res.status(404).json(new ApiError(404, "User details not found"));
    }

    const data = userDetails[0];

    // ✅ NEW: Enrich service details with cart information
    if (data.cartItems && data.cartItems.length > 0) {
      console.log(
        `📦 Found ${data.cartItems.length} cart items for enrichment`
      );

      data.serviceDetails = data.serviceDetails.map((service) => {
        const cartItem = data.cartItems.find(
          (item) => item.serviceId.toString() === service._id.toString()
        );

        if (cartItem && cartItem.isCateringService) {
          console.log(
            `✅ Enriching service ${service.serviceName} with catering details:`,
            cartItem.cateringDetails
          );

          return {
            ...service,
            cartCateringDetails: cartItem.cateringDetails,
          };
        }

        return service;
      });
    } else {
      console.log("⚠️ No cart items found for this booking");
    }

    console.log(
      "Final enriched data:",
      JSON.stringify(
        {
          serviceCount: data.serviceDetails.length,
          services: data.serviceDetails.map((s) => ({
            name: s.serviceName,
            hasCartDetails: !!s.cartCateringDetails,
            cartDetails: s.cartCateringDetails,
          })),
        },
        null,
        2
      )
    );

    return res
      .status(200)
      .json(new ApiResponse(200, data, "User details fetched successfully"));
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
