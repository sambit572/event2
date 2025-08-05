import { Service } from "../../model/vendor/service.model.js";
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

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
          locationOffered: 1,
          address: 1,
          vendorId: 1,
          vendorName: "$vendorDetails.fullName",
          vendorEmail: "$vendorDetails.email",
          rating: 1,
          reviews: 1,
          available: 1,
        },
      },
    ]);

    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("Error in getServicesByCategory:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
