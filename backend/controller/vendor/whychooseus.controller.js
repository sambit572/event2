import { Service } from "../../model/vendor/service.model.js";
import { Category } from "../../model/common/category.model.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";

// Get Why Choose Us points for a service
export const getWhyChooseUs = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const vendorId = req.vendor._id;

    // Find the service and ensure it belongs to the authenticated vendor
    const service = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!service) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    let whyChooseUsPoints = [];
    let isCustom = false;

    // Check if vendor has custom points
    if (service.customWhyChooseUs && service.customWhyChooseUs.length > 0) {
      whyChooseUsPoints = service.customWhyChooseUs;
      isCustom = true;
    } else {
      // Get default points from category
      const category = await Category.findOne({ name: service.serviceCategory });
      if (category && category.defaultWhyChooseUs && category.defaultWhyChooseUs.length > 0) {
        whyChooseUsPoints = category.defaultWhyChooseUs;
      } else {
        // Fallback default points
        whyChooseUsPoints = [
          "Professional service quality",
          "Experienced team",
          "Customer satisfaction guaranteed",
          "Competitive pricing"
        ];
      }
    }

    return res.status(200).json(
      new ApiResponse(200, {
        whyChooseUs: whyChooseUsPoints,
        isCustom: isCustom,
        serviceId: service._id,
        serviceName: service.serviceName
      }, "Why Choose Us points fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching Why Choose Us points:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// Update custom Why Choose Us points for a service
export const updateWhyChooseUs = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const vendorId = req.vendor._id;
    const { whyChooseUs } = req.body;

    // Validate input
    if (!whyChooseUs || !Array.isArray(whyChooseUs)) {
      return res
        .status(400)
        .json(new ApiError(400, "whyChooseUs must be an array"));
    }

    // Validate array length
    if (whyChooseUs.length === 0 || whyChooseUs.length > 5) {
      return res
        .status(400)
        .json(new ApiError(400, "Why Choose Us points must be between 1 and 5 items"));
    }

    // Validate each point
    for (let point of whyChooseUs) {
      if (typeof point !== 'string' || point.trim().length === 0) {
        return res
          .status(400)
          .json(new ApiError(400, "Each Why Choose Us point must be a non-empty string"));
      }
      if (point.length > 100) {
        return res
          .status(400)
          .json(new ApiError(400, "Each Why Choose Us point must be less than 100 characters"));
      }
    }

    // Find and update the service
    const service = await Service.findOneAndUpdate(
      {
        _id: serviceId,
        vendorId: vendorId,
      },
      {
        customWhyChooseUs: whyChooseUs.map(point => point.trim())
      },
      { new: true }
    );

    if (!service) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    return res.status(200).json(
      new ApiResponse(200, {
        whyChooseUs: service.customWhyChooseUs,
        serviceId: service._id,
        serviceName: service.serviceName
      }, "Why Choose Us points updated successfully")
    );
  } catch (error) {
    console.error("Error updating Why Choose Us points:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// Reset to category default Why Choose Us points
export const resetWhyChooseUs = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const vendorId = req.vendor._id;

    // Find the service and ensure it belongs to the authenticated vendor
    const service = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!service) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    // Clear custom points to revert to category defaults
    service.customWhyChooseUs = [];
    await service.save();

    // Get category default points to return
    const category = await Category.findOne({ name: service.serviceCategory });
    let defaultPoints = [];
    
    if (category && category.defaultWhyChooseUs && category.defaultWhyChooseUs.length > 0) {
      defaultPoints = category.defaultWhyChooseUs;
    } else {
      defaultPoints = [
        "Professional service quality",
        "Experienced team", 
        "Customer satisfaction guaranteed",
        "Competitive pricing"
      ];
    }

    return res.status(200).json(
      new ApiResponse(200, {
        whyChooseUs: defaultPoints,
        isCustom: false,
        serviceId: service._id,
        serviceName: service.serviceName
      }, "Why Choose Us points reset to category defaults")
    );
  } catch (error) {
    console.error("Error resetting Why Choose Us points:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};