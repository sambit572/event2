import { Service } from "../../model/vendor/service.model.js";
import client from "../../db/redisClient.js"; // 🔹 Make sure you have a redis client
import mongoose from "mongoose";
import { Category } from "../../model/common/category.model.js";

export const getServicesByCategory = async (req, res) => {
  try {
    console.log("Inside getServicesByCategory .............");

    const { category } = req.params;
    const { subCategory } = req.query;
    let subCatArray = [];

    if (subCategory) {
      subCatArray = Array.isArray(subCategory)
        ? subCategory
        : subCategory.split(",");
    }

    console.log(`$$$$$$$$$$$$$$$$$$$$$$$$$category: ${category}`);
    console.log(`Selected SubCategory: ${subCategory}`);
    const services = await Service.aggregate([
      {
        $match: {
          serviceCategory: { $regex: category, $options: "i" },

          ...(subCatArray.length > 0 && {
            subCategory: { $in: subCatArray },
          }),
        },
      },

      {
        $sort: { createdAt: 1 },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      {
        $unwind: {
          path: "$vendorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // 🔹 Lookup reviews from UserReview model to calculate average rating
      {
        $lookup: {
          from: "userreviews", // collection name of UserReview model
          localField: "_id",
          foreignField: "serviceId",
          as: "reviews",
        },
      },
      // === 🚀 FIXED: Properly prioritize 'perPlatePrice' for startingPrice 🚀 ===
      {
        $addFields: {
          // First, find the minimum price from packages, if they exist
          minPackagePrice: {
            $cond: {
              if: {
                $and: [
                  { $isArray: "$packages" },
                  { $gt: [{ $size: "$packages" }, 0] },
                ],
              },
              then: { $min: "$packages.perPlatePrice" },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          startingPrice: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$perPlatePrice", null] }, // Field is not null
                  { $ne: ["$perPlatePrice", undefined] }, // Field is not undefined
                  { $gt: ["$perPlatePrice", 0] }, // Value is greater than 0
                ],
              },
              then: "$perPlatePrice",
              else: "$minPackagePrice",
            },
          },
        },
      },
      // === END OF FIX ===
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
          totalReviews: { $size: "$reviews" },
        },
      },
      {
        $project: {
          _id: 1,
          serviceName: 1,
          serviceDes: 1,
          serviceCategory: 1,
          priceRange: 1,
          minPrice: 1,
          maxPrice: 1,
          serviceImage: 1,
          duration: 1,
          stateLocationOffered: 1,
          locationOffered: 1,
          address: 1,
          vendorId: 1,
          vendorName: "$vendorDetails.fullName",
          vendorEmail: "$vendorDetails.email",
          avgRating: 1, // Ensure avgRating is included
          totalReviews: 1,
          available: 1,
          pricingType: 1,
          perPlatePrice: 1,
          packages: 1,
          startingPrice: 1,
        },
      },
    ]);

    // console.log(services);

    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error in getServicesByCategory:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("--- DEBUGGING: Inside getServiceById ---");
    console.log("Attempting to find service with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id);
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format",
      });
    }
    console.log(
      "Is the Service model imported?",
      Service ? "Yes" : "No, it is undefined!"
    );
    const service = await Service.findById(id).populate({
      path: "vendorId",
      select: "fullName email", // fetch only needed fields
    });
    console.log("Result from database (Service.findById):", service);
    console.log("---------------------------------------");

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    // DEBUG: Log service category and custom points
    console.log("Service Category:", service.serviceCategory);
    console.log("Service Custom Points:", service.customWhyChooseUs);

    // Get Why Choose Us points
    let whyChooseUsPoints = [];

    // Check if the vendor has set custom points and if the array is not empty
    if (service.customWhyChooseUs && service.customWhyChooseUs.length > 0) {
      whyChooseUsPoints = service.customWhyChooseUs;
    } else {
      // If not, find the category and use its default points
      const category = await Category.findOne({
        name: service.serviceCategory,
      });

      console.log("Found category:", category);

      if (
        category &&
        category.defaultWhyChooseUs &&
        category.defaultWhyChooseUs.length > 0
      ) {
        console.log(
          "✅ Using category default points:",
          category.defaultWhyChooseUs
        );

        whyChooseUsPoints = category.defaultWhyChooseUs;
      } else {
        console.log(
          "⚠️ No category found or no default points, using fallback"
        );

        // Fallback if category not found or has no default points
        whyChooseUsPoints = [
          "Professional service quality",
          "Experienced team",
          "Customer satisfaction guaranteed",
          "Competitive pricing",
        ];
      }
    }

    console.log("Final Why Choose Us Points:", whyChooseUsPoints);
    // Transform the response to include vendorName
    // === 🚀 FIXED: Properly prioritize 'perPlatePrice' for the details page 🚀 ===
    let startingPrice = null;
    if (service.pricingType === "perPlate") {
      // ✅ FIX: Check if base price exists AND is greater than 0
      if (
        service.perPlatePrice != null &&
        service.perPlatePrice !== undefined &&
        service.perPlatePrice > 0
      ) {
        startingPrice = service.perPlatePrice;
      }
      // Only if base price is missing or invalid, find the minimum from packages
      else if (service.packages && service.packages.length > 0) {
        const packagePrices = service.packages
          .map((p) => p.perPlatePrice)
          .filter(Boolean);
        if (packagePrices.length > 0) {
          startingPrice = Math.min(...packagePrices);
        }
      }
    }
    // === END OF FIX ===

    const transformed = {
      ...service._doc,
      startingPrice,
      vendorName: service.vendorId?.fullName,
      vendorEmail: service.vendorId?.email,
      vendor: service.vendorId?._id,
      whyChooseUs: whyChooseUsPoints,
    };

    return res.status(200).json({ success: true, service: transformed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
