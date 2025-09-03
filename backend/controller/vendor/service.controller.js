import { Service } from "../../model/vendor/service.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../utilities/cloudinary.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";
import Vendor from "../../model/vendor/vendor.model.js";
import client from "../../utilities/redisClient.js";

export const createService = async (req, res) => {
  try {
    console.log("🔵 createService called");

    const {
      serviceCategory,
      minPrice,
      maxPrice,
      serviceName,
      stateLocationOffered,
      locationOffered,
      serviceDes,
      days = 0,
      hrs = 0,
      mins = 0,
    } = req.body;

    // ✅ Validate required fields
    if (!serviceCategory || !serviceName || !locationOffered || !serviceDes) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // ✅ Ensure stateLocationOffered is always an array
    const stateLocationsArray = Array.isArray(stateLocationOffered)
      ? stateLocationOffered
      : [stateLocationOffered];

    if (stateLocationsArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one location" });
    }

    // ✅ Ensure locationOffered is always an array
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

    // ✅ Prepare service data
    const serviceData = {
      vendorId: req.vendor._id,
      serviceCategory,
      serviceImage: imageUrls,
      minPrice,
      maxPrice,
      serviceName,
      stateLocationOffered: stateLocationsArray,
      locationOffered: locationsArray,
      serviceDes,
      duration,
    };

    let newService;
    let responseMessage;

    // ✅ If vendor registration is not complete → upsert (only one service)
    if (req.vendor.isRegistrationComplete === false) {
      newService = await Service.findOneAndUpdate(
        { vendorId: req.vendor._id },
        serviceData,
        { new: true, upsert: true }
      );

      await Vendor.findByIdAndUpdate(req.vendor._id, {
        $set: { registrationProgress: 2 },
      });

      responseMessage = "Service saved successfully during registration";
    } else {
      // ✅ Otherwise, allow multiple services → create new one
      newService = await Service.create(serviceData);
      responseMessage = "New service created successfully";
    }

    // 🔥 Invalidate Redis cache for this category + all services list
    await client.del(`services:category:${serviceCategory.toLowerCase()}`);
    await client.del(`services:id:${newService._id}`);
    await client.del(`services:all`); // optional, if you have a "getAllServices"

    return res
      .status(200)
      .json(new ApiResponse(200, newService, responseMessage));
  } catch (error) {
    console.error("❌ Service creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkServiceExists = async (req, res) => {
  try {
    const cacheKey = "check_service_exists";

    // 1️⃣ Check cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // 2️⃣ Query MongoDB
    const existingService = await Service.findOne().sort({ createdAt: -1 });

    const response = existingService ? { exists: true } : { exists: false };

    // 3️⃣ Save in Redis (short expiry, 60 sec)
    await client.setEx(cacheKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error checking service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMyServices = async (req, res) => {
  try {
    const vendorId = req.vendor._id.toString();
    const cacheKey = `vendor:${vendorId}:services`;

    // 1️⃣ Check Redis cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning services from Redis cache");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedData),
            "Services for the current vendor fetched successfully (from cache)"
          )
        );
    }

    // 2️⃣ If not cached → fetch from MongoDB
    const services = await Service.find({ vendorId }).sort({ createdAt: -1 });

    // 3️⃣ Save result in Redis (expire in 5 min for freshness)
    await client.setEx(cacheKey, 300, JSON.stringify(services));

    console.log("✅ Fetched services from DB and cached in Redis");
    return res
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

    const {
      serviceName = existingService.serviceName,
      serviceDes = existingService.serviceDes,
      serviceCategory = existingService.serviceCategory,
      minPrice = existingService.minPrice,
      maxPrice = existingService.maxPrice,
      stateLocationOffered = existingService.stateLocationOffered,
      locationOffered = existingService.locationOffered,
      duration = existingService.duration,
      serviceImage = existingService.serviceImage,
    } = req.body;

    const stateLocationsArray = Array.isArray(stateLocationOffered)
      ? stateLocationOffered
      : [stateLocationOffered];

    const locationsArray = Array.isArray(locationOffered)
      ? locationOffered
      : [locationOffered];

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

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        serviceName,
        serviceDes,
        serviceCategory,
        minPrice,
        maxPrice,
        stateLocationOffered: stateLocationsArray,
        locationOffered: locationsArray,
        duration,
        serviceImage,
      },
      { new: true }
    );

    // ✅ Invalidate Redis cache
    try {
      await client.del(`vendor_services_${vendorId}`); // vendor services cache
      await client.del("all_services"); // if you cache all services somewhere
    } catch (cacheErr) {
      console.error("Redis cache clear failed:", cacheErr);
    }

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

    const existingService = await Service.findOne({ _id: serviceId, vendorId });

    if (!existingService) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    // Delete all images from Cloudinary (if any)
    let deletionResults = [];
    if (
      Array.isArray(existingService.serviceImage) &&
      existingService.serviceImage.length > 0
    ) {
      deletionResults = await Promise.allSettled(
        existingService.serviceImage.map((imageUrl) =>
          deleteFromCloudinary(imageUrl)
        )
      );
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
      .json(new ApiError(500, "Internal server error", [], error.message));
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const vendorId = req.vendor._id; // attached via auth middleware
    const serviceId = req.params.id;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res
        .status(400)
        .json(new ApiError(400, "available must be a boolean (true or false)"));
    }

    const service = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId, // ensure vendor owns the service
    });

    if (!service) {
      console.error("Service not found or not authorized");
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    service.available = available;
    await service.save();

    // ✅ Invalidate cache after update
    const cacheKey = `vendor:${vendorId}:services`;
    await client.del(cacheKey);

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Availability updated successfully"));
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const updateServiceImageFirst = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const serviceId = req.params.id;

    const service = await Service.findOne({ _id: serviceId, vendorId });
    if (!service) {
      return res
        .status(404)
        .json({ message: "Service not found or not authorized" });
    }

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudRes = await uploadOnCloudinary(file.path);
        if (cloudRes?.secure_url) {
          imageUrls.push(cloudRes.secure_url);
        }
      }

      // Update DB
      service.serviceImage = [...service.serviceImage, ...imageUrls];
      await service.save();

      // 🚀 Invalidate Redis cache for this service
      await client.del(`service:${serviceId}`);

      return res.status(200).json({
        success: true,
        data: service,
        message: "Images uploaded & service updated successfully",
      });
    } else {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }
  } catch (error) {
    console.error("❌ Error updating service images:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
