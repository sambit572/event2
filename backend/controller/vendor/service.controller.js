import { Service } from "../../model/vendor/service.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";

export const createService = async (req, res) => {
  try {
    console.log("🔵 createService called");

    const {
      serviceCategory,
      minPrice,
      maxPrice,
      serviceName,
      locationOffered,
      serviceDes,
      days = 0,
      hrs = 0,
      mins = 0,
    } = req.body;

    // ✅ Validate required fields
    if (!serviceCategory || !serviceName || !locationOffered || !serviceDes) {
      console.error("❌ Validation failed: required fields missing", {
        serviceCategory,
        serviceName,
        locationOffered,
        serviceDes,
      });
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // ✅ Ensure locationOffered is always an array (multi-location support)
    const locationsArray = Array.isArray(locationOffered)
      ? locationOffered
      : [locationOffered];

    if (locationsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one location" });
    }

    // ✅ Validate prices
    if (
      !minPrice ||
      !maxPrice ||
      parseInt(minPrice) <= 0 ||
      parseInt(maxPrice) <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Min and max prices must be valid positive numbers" });
    }
    if (parseInt(minPrice) >= parseInt(maxPrice)) {
      return res
        .status(400)
        .json({ message: "Min price must be less than max price" });
    }

    // ✅ Calculate duration in minutes
    const duration =
      parseInt(days) * 24 * 60 + parseInt(hrs) * 60 + parseInt(mins);
    if (isNaN(duration) || duration <= 0) {
      console.error("❌ Invalid estimated duration:", { days, hrs, mins });
      return res.status(400).json({ message: "Invalid estimated duration" });
    }

    // ✅ Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudRes = await uploadOnCloudinary(file.path);
        if (cloudRes?.secure_url) {
          imageUrls.push(cloudRes.secure_url);
        } else {
          console.error("❌ Failed to upload image:", file.originalname);
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    // ✅ Save service document to DB
    const newService = await Service.create({
      vendorId: req.vendor._id,
      serviceCategory,
      serviceImage: imageUrls,
      minPrice,
      maxPrice,
      serviceName,
      locationOffered: locationsArray, // ✅ store array
      serviceDes,
      duration,
    });

    // ✅ Update vendor registration progress if needed
    if (req.vendor.isRegistrationComplete === false) {
      await Vendor.findByIdAndUpdate(req.vendor._id, {
        $set: { registrationProgress: 2 },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newService, "Service created successfully"));
  } catch (error) {
    console.error("❌ Service creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkServiceExists = async (req, res) => {
  try {
    const existingService = await Service.findOne().sort({ createdAt: -1 });

    if (existingService) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    // console.log("vendor obj from beckend inside my services: ", req.vendor);
    const services = await Service.find({ vendorId: vendorId }).sort({
      createdAt: -1,
    });
    console.log("services of current vendor fetched from database :", services);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          services,
          "Services for the current vendor fetched successfully"
        )
      );
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateService = async (req, res) => {
  try {
    console.log("inside update service..");

    const vendorId = req.vendor._id;
    const serviceId = req.params.id;

    const existingService = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!existingService) {
      console.error("❌ Service not found or not authorized");
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    // Extract updated fields (default to existing values if not provided)
    const {
      serviceName = existingService.serviceName,
      serviceDes = existingService.serviceDes,
      serviceCategory = existingService.serviceCategory,
      minPrice = existingService.minPrice,
      maxPrice = existingService.maxPrice,
      locationOffered = existingService.locationOffered,
      duration = existingService.duration,
      serviceImage = existingService.serviceImage, // ✅ Cloudinary URLs from frontend
    } = req.body;

    // ✅ Ensure locationOffered is always an array
    const locationsArray = Array.isArray(locationOffered)
      ? locationOffered
      : [locationOffered];

    // ✅ Validate prices if updated
    if (minPrice && maxPrice) {
      if (parseInt(minPrice) <= 0 || parseInt(maxPrice) <= 0) {
        return res
          .status(400)
          .json(new ApiError(400, "Price values must be positive"));
      }
      if (parseInt(minPrice) >= parseInt(maxPrice)) {
        return res
          .status(400)
          .json(new ApiError(400, "Min price must be less than max price"));
      }
    }

    // ✅ Update service
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        serviceName,
        serviceDes,
        serviceCategory,
        minPrice,
        maxPrice,
        locationOffered: locationsArray,
        duration,
        serviceImage, // ✅ Uses URLs from frontend
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedService, "Service updated successfully")
      );
  } catch (error) {
    console.error("❌ Error updating service:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const deleteService = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const serviceId = req.params.id;

    const existingService = await Service.findOne({
      _id: serviceId,
      vendorId,
    });

    if (!existingService) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    // Delete all images from Cloudinary
    const deletionResults = [];
    for (const imageUrl of existingService.serviceImage) {
      const result = await deleteFromCloudinary(imageUrl);
      deletionResults.push(result);
    }

    // Delete service from DB
    await existingService.deleteOne();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedService: existingService,
          imageDeletions: deletionResults,
        },
        "Service and associated images deleted successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", [], error.stack));
  }
};
