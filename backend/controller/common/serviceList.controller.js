import { Service } from "../../model/vendor/service.model.js";
import client from "../../utilities/redisClient.js"; // 🔹 Make sure you have a redis client

// ========== Get Services by Category ==========
export const getServicesByCategory = async (req, res) => {
  try {


    console.log("Inside getServicesByCategory .............")

    const { category } = req.params;
    const cacheKey = `services:category:${category.toLowerCase()}`;

    // 🔹 Check Redis cache first
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning services from Redis cache");
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cachedData) });
    }

    console.time("servicesByCategory");

    const services = await Service.aggregate([
      {
        $match: {
          serviceCategory: { $regex: category, $options: "i" },
        },
      },
      { $sort: { createdAt: -1 } },
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
      {
        $lookup: {
          from: "userreviews",
          localField: "_id",
          foreignField: "serviceId",
          as: "reviews",
        },
      },
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
          avgRating: 1,
          totalReviews: 1,
          available: 1,
        },
      },
    ]);

    console.timeEnd("servicesByCategory");

    // 🔹 Store in Redis for 10 minutes
    await client.setEx(cacheKey, 600, JSON.stringify(services));

    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error in getServicesByCategory:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== Get Service by ID ==========
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `services:id:${id}`;

    // 🔹 Check Redis first
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning service by ID from Redis cache");
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cachedData) });
    }

    console.time("serviceById");

    const service = await Service.findById(id).populate({
      path: "vendorId",
      select: "fullName email",
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    const transformed = {
      ...service._doc,
      vendorName: service.vendorId?.fullName,
      vendorEmail: service.vendorId?.email,
    };

    console.timeEnd("serviceById");

    // 🔹 Store in Redis for 10 minutes
    await client.setEx(cacheKey, 600, JSON.stringify(transformed));

    return res.status(200).json({ success: true, data: transformed });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
