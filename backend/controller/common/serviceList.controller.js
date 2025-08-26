import { Service } from "../../model/vendor/service.model.js";

export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // console.log(`$$$$$$$$$$$$$$$$$$$$$$$$$category: ${category}`);

    const services = await Service.aggregate([
      {
        $match: {
          serviceCategory: { $regex: category, $options: "i" },
        },
      },
      {
        $sort: { createdAt: -1 },
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
        },
      },
    ]);

    console.log(services);

    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error in getServicesByCategory:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).populate({
      path: "vendorId",
      select: "fullName email", // fetch only needed fields
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Transform the response to include vendorName
    const transformed = {
      ...service._doc,
      vendorName: service.vendorId?.fullName,
      vendorEmail: service.vendorId?.email,
    };

    return res.status(200).json({ success: true, data: transformed });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
