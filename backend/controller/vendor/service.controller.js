import { Service } from "../../model/vendor/service.model.js";
import { Category } from "../../model/common/category.model.js";
import { SUBCATEGORY_MAP } from "../../utilities/subCategoryData.js";

import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../utilities/cloudinary.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";
import Vendor from "../../model/vendor/vendor.model.js";
import client from "../../db/redisClient.js";
import {
  uploadVideoToYouTube,
  deleteVideoFromYouTube,
} from "../../utilities/youtubeUploader.js";

const vendorServicesCacheKey = (vendorId) => `vendor:${vendorId}:services`;

/* =========================================================
   HELPER: PROCESS IMAGE / VIDEO MEDIA
   ========================================================= */
const processServiceMedia = async (files, serviceName = "Service Media") => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "No media files received");
  }

  const imageUrls = [];
  const videoUrls = [];

  for (const file of files) {
    // ✅ IMAGE → Cloudinary
    if (file.mimetype.startsWith("image/")) {
      try {
        const cloudRes = await uploadOnCloudinary(file.path);
        if (cloudRes?.secure_url) {
          imageUrls.push(cloudRes.secure_url);
        }
      } catch (err) {
        console.error(
          "❌ Cloudinary image upload failed for:",
          file.originalname,
          err.message
        );
      }
    }

    // ✅ VIDEO → YouTube
    else if (file.mimetype.startsWith("video/")) {
      try {
        const title = `Service Video - ${serviceName}`;
        const desc = `Video for service: ${serviceName}`;

        const youtubeUrl = await uploadVideoToYouTube(file.path, title, desc);
        videoUrls.push(youtubeUrl);
      } catch (err) {
        console.error("❌ YouTube upload failed:", file.originalname, err);
      }
    }
  }

  const mediaUrls = [...imageUrls, ...videoUrls];

  if (mediaUrls.length === 0) {
    console.warn("⚠️ All media uploads failed. Proceeding with a placeholder image.");
    // Fallback to a placeholder image if upload completely fails
    mediaUrls.push("https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg");
  }

  return mediaUrls;
};

/* =========================================================
   CREATE SERVICE
   ✅ FIXED:
   - Better validation logs
   - Stable service creation
   - ALWAYS UPSERT for one vendor service flow
   ========================================================= */
export const createService = async (req, res) => {
  try {
    console.log("🔵 createService called");
    console.log("📥 req.body:", req.body);
    console.log("📥 req.files:", req.files);
    console.log("📥 req.vendor:", req.vendor?._id);

    const {
      serviceCategory,
      subCategory,
      minPrice,
      maxPrice,
      serviceName,
      stateLocationOffered,
      locationOffered,
      serviceDes,
      days = 0,
      hrs = 0,
      mins = 0,
      pricingType,
      perPlatePrice,
      minPlates,
      maxPlates,
      packages,
    } = req.body;

    /* =========================
       REQUIRED FIELD CHECK
       ========================= */
    if (!serviceCategory || !serviceName || !locationOffered || !serviceDes) {
      console.log("❌ Missing required fields:", {
        serviceCategory,
        serviceName,
        locationOffered,
        serviceDes,
      });

      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    /* =========================
       LOCATION VALIDATION
       ========================= */
    const stateLocationsArray = Array.isArray(stateLocationOffered)
      ? stateLocationOffered
      : stateLocationOffered
        ? [stateLocationOffered]
        : [];

    if (stateLocationsArray.length === 0) {
      console.log("❌ No state location selected");
      return res.status(400).json({
        message: "Please select at least one state location",
      });
    }

    const locationsArray = Array.isArray(locationOffered)
      ? locationOffered
      : locationOffered
        ? [locationOffered]
        : [];

    if (locationsArray.length === 0) {
      console.log("❌ No location selected");
      return res.status(400).json({
        message: "Please select at least one location",
      });
    }

    /* =========================
       BASE SERVICE DATA
       ========================= */
    const serviceData = {
      vendorId: req.vendor._id,
      serviceCategory,
      subCategory: subCategory
        ? Array.isArray(subCategory)
          ? subCategory
          : [subCategory]
        : [],
      serviceName,
      stateLocationOffered: stateLocationsArray,
      locationOffered: locationsArray,
      serviceDes,
    };

    const finalPricingType = pricingType || "flat";
    serviceData.pricingType = finalPricingType;

    /* =========================
       PRICING VALIDATION
       ========================= */
    if (finalPricingType === "perPlate") {
      let hasBasePrice = false;
      let hasPackages = false;

      // ✅ Base per plate pricing
      if (perPlatePrice && minPlates && maxPlates) {
        if (+perPlatePrice <= 0 || +minPlates <= 0 || +maxPlates <= 0) {
          console.log("❌ Invalid perPlate values:", {
            perPlatePrice,
            minPlates,
            maxPlates,
          });

          return res.status(400).json({
            message: "Per-plate values must be positive numbers.",
          });
        }

        if (+minPlates >= +maxPlates) {
          console.log("❌ Min plates >= max plates");
          return res.status(400).json({
            message: "Min plates must be less than max plates.",
          });
        }

        serviceData.perPlatePrice = perPlatePrice;
        serviceData.minPlates = minPlates;
        serviceData.maxPlates = maxPlates;
        hasBasePrice = true;
      }

      // ✅ Packages
      if (packages) {
        try {
          const parsedPackages =
            typeof packages === "string" ? JSON.parse(packages) : packages;

          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            for (const pkg of parsedPackages) {
              if (
                !pkg.packageName ||
                !pkg.perPlatePrice ||
                !pkg.minPlates ||
                !pkg.maxPlates
              ) {
                return res.status(400).json({
                  message: `Package "${pkg.packageName || "Unnamed"
                    }" has missing fields`,
                });
              }

              if (
                +pkg.perPlatePrice <= 0 ||
                +pkg.minPlates <= 0 ||
                +pkg.maxPlates <= 0
              ) {
                return res.status(400).json({
                  message: `Package "${pkg.packageName}" must have positive values`,
                });
              }

              if (+pkg.minPlates >= +pkg.maxPlates) {
                return res.status(400).json({
                  message: `Package "${pkg.packageName}": min plates must be less than max plates`,
                });
              }
            }

            serviceData.packages = parsedPackages;
            hasPackages = true;
          }
        } catch (pkgErr) {
          console.error("❌ Invalid packages JSON:", pkgErr);
          return res.status(400).json({
            message: "Invalid package data format",
          });
        }
      }

      if (!hasBasePrice && !hasPackages) {
        console.log("❌ No valid perPlate pricing provided");
        return res.status(400).json({
          message:
            "For catering services, provide either base per-plate pricing or at least one package.",
        });
      }

      // clear flat pricing if perPlate
      serviceData.minPrice = undefined;
      serviceData.maxPrice = undefined;
    } else {
      // ✅ Flat pricing
      if (!minPrice || !maxPrice) {
        console.log("❌ Missing flat pricing:", { minPrice, maxPrice });
        return res.status(400).json({
          message: "Min and max prices are required for this service category",
        });
      }

      if (+minPrice <= 0 || +maxPrice <= 0) {
        return res.status(400).json({
          message: "Price values must be greater than 0",
        });
      }

      if (+minPrice >= +maxPrice) {
        return res.status(400).json({
          message: "Min price must be less than max price",
        });
      }

      serviceData.minPrice = minPrice;
      serviceData.maxPrice = maxPrice;

      // clear perPlate fields if flat
      serviceData.perPlatePrice = undefined;
      serviceData.minPlates = undefined;
      serviceData.maxPlates = undefined;
      serviceData.packages = [];
    }

    /* =========================
       DURATION VALIDATION
       ========================= */
    const duration =
      parseInt(days || 0) * 24 * 60 +
      parseInt(hrs || 0) * 60 +
      parseInt(mins || 0);

    if (isNaN(duration) || duration <= 0) {
      console.log("❌ Invalid duration:", { days, hrs, mins, duration });
      return res.status(400).json({
        message: "Invalid estimated duration",
      });
    }

    serviceData.duration = duration;

    /* =========================
       MEDIA VALIDATION
       ========================= */
    if (!req.files || req.files.length === 0) {
      console.log("❌ No media files uploaded");
      return res.status(400).json({
        message: "Please upload at least one image or video",
      });
    }

    const mediaUrls = await processServiceMedia(req.files, serviceName);
    serviceData.serviceImage = mediaUrls;

    /* =========================
       NEW UPDATED FIX
       ✅ ALWAYS UPSERT SERVICE
       This avoids issue after delete/re-add
       ========================= */
    let newService;
    let responseMessage;

    newService = await Service.findOneAndUpdate(
      { vendorId: req.vendor._id },
      serviceData,
      { new: true, upsert: true }
    );

    if (req.vendor.isRegistrationComplete === false) {
      await Vendor.findByIdAndUpdate(req.vendor._id, {
        $set: { registrationProgress: 2 },
      });

      responseMessage = "Service saved successfully during registration";
    } else {
      responseMessage = "Service created/updated successfully";
    }

    /* =========================
       CACHE INVALIDATION
       ========================= */
    await client.del(`services:category:${serviceCategory.toLowerCase()}`);
    await client.del(`services:id:${newService._id}`);
    await client.del(`services:all`);
    await client.del(`vendor:${req.vendor._id}:services`);

    return res
      .status(200)
      .json(new ApiResponse(200, newService, responseMessage));
  } catch (error) {
    console.error("❌ Service creation error:", error);
    return res.status(500).json({
      message: error?.message || "Internal server error",
    });
  }
};

/* =========================================================
   CHECK SERVICE EXISTS
   ========================================================= */
export const checkServiceExists = async (req, res) => {
  try {
    const cacheKey = "check_service_exists";

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const existingService = await Service.findOne().sort({ createdAt: -1 });
    const response = existingService ? { exists: true } : { exists: false };

    await client.setEx(cacheKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error checking service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   GET MY SERVICES
   ========================================================= */
export const getMyServices = async (req, res) => {
  try {
    const vendorId = req.vendor._id.toString();
    const cacheKey = `vendor:${vendorId}:services`;

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning services from Redis cache");
      return res.status(200).json(
        new ApiResponse(
          200,
          JSON.parse(cachedData),
          "Services for the current vendor fetched successfully (from cache)"
        )
      );
    }

    const services = await Service.find({ vendorId })
      .select(
        "+pricingType +perPlatePrice +minPlates +maxPlates +packages +minPrice +maxPrice"
      )
      .sort({ createdAt: -1 });

    await client.setEx(cacheKey, 300, JSON.stringify(services));

    console.log("✅ Fetched services from DB and cached in Redis");
    return res.status(200).json(
      new ApiResponse(
        200,
        services,
        "Services for the current vendor fetched successfully"
      )
    );
  } catch (err) {
    console.error("Error fetching services:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   UPDATE SERVICE
   ========================================================= */
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
      serviceName,
      serviceDes,
      serviceCategory,
      subCategory,
      stateLocationOffered,
      locationOffered,
      duration,
      serviceImage,
      customWhyChooseUs,
      pricingType,
      minPrice,
      maxPrice,
      perPlatePrice,
      minPlates,
      maxPlates,
      packages,
    } = req.body;

    const updateData = {
      serviceName: serviceName || existingService.serviceName,
      serviceDes: serviceDes || existingService.serviceDes,
      serviceCategory: serviceCategory || existingService.serviceCategory,
      subCategory: subCategory
        ? Array.isArray(subCategory)
          ? subCategory
          : [subCategory]
        : existingService.subCategory,
      stateLocationOffered: stateLocationOffered
        ? Array.isArray(stateLocationOffered)
          ? stateLocationOffered
          : [stateLocationOffered]
        : existingService.stateLocationOffered,
      locationOffered: locationOffered
        ? Array.isArray(locationOffered)
          ? locationOffered
          : [locationOffered]
        : existingService.locationOffered,
      duration: duration || existingService.duration,
      serviceImage: serviceImage || existingService.serviceImage,
      customWhyChooseUs: customWhyChooseUs || existingService.customWhyChooseUs,
    };

    const finalPricingType =
      pricingType || existingService.pricingType || "flat";
    updateData.pricingType = finalPricingType;

    if (finalPricingType === "perPlate") {
      if (
        perPlatePrice !== undefined &&
        minPlates !== undefined &&
        maxPlates !== undefined
      ) {
        if (+perPlatePrice > 0 && +minPlates > 0 && +maxPlates > 0) {
          if (+minPlates >= +maxPlates) {
            return res
              .status(400)
              .json(
                new ApiError(400, "Min plates must be less than max plates")
              );
          }
          updateData.perPlatePrice = perPlatePrice;
          updateData.minPlates = minPlates;
          updateData.maxPlates = maxPlates;
        }
      }

      if (packages !== undefined) {
        updateData.packages = packages
          ? typeof packages === "string"
            ? JSON.parse(packages)
            : packages
          : [];
      }

      updateData.minPrice = undefined;
      updateData.maxPrice = undefined;
    } else {
      if (minPrice !== undefined && maxPrice !== undefined) {
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
        updateData.minPrice = minPrice;
        updateData.maxPrice = maxPrice;
      }

      updateData.perPlatePrice = undefined;
      updateData.minPlates = undefined;
      updateData.maxPlates = undefined;
      updateData.packages = [];
    }

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { $set: updateData },
      { new: true, omitUndefined: true }
    );

    try {
      await client.del(`vendor:${vendorId}:services`);
      await client.del("all_services");
      await client.del(`services:id:${serviceId}`);
      await client.del(
        `services:category:${updatedService.serviceCategory.toLowerCase()}`
      );
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

/* =========================================================
   DELETE SERVICE
   ✅ FIXED:
   - Removed duplicate Cloudinary deletion
   - Cleaner delete flow
   ========================================================= */
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

    const cloudinaryDeletionPromises = [];
    const youtubeDeletionPromises = [];

    const mediaArray = existingService.serviceImage || [];

    if (Array.isArray(mediaArray) && mediaArray.length > 0) {
      mediaArray.forEach((mediaUrl) => {
        if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
          youtubeDeletionPromises.push(deleteVideoFromYouTube(mediaUrl));
        } else if (mediaUrl.includes("cloudinary.com")) {
          cloudinaryDeletionPromises.push(deleteFromCloudinary(mediaUrl));
        } else {
          console.warn(
            `Unknown media URL type, skipping deletion: ${mediaUrl}`
          );
        }
      });
    }

    const mediaDeletionResults = await Promise.allSettled([
      ...cloudinaryDeletionPromises,
      ...youtubeDeletionPromises,
    ]);

    console.log("🗑 Media deletion results:", mediaDeletionResults);

    await existingService.deleteOne();

    // Optional: reset registration progress if your flow depends on it
    // await Vendor.findByIdAndUpdate(vendorId, {
    //   $set: { registrationProgress: 1 },
    // });

    await client.del(`vendor:${vendorId}:services`);
    await client.del(`services:id:${serviceId}`);
    await client.del(
      `services:category:${existingService.serviceCategory.toLowerCase()}`
    );
    await client.del(`services:all`);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedServiceId: existingService._id,
          mediaDeletions: mediaDeletionResults,
          deletedService: existingService,
        },
        "Service and associated media deleted successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", [], error.message));
  }
};

/* =========================================================
   UPDATE AVAILABILITY
   ========================================================= */
export const updateAvailability = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const serviceId = req.params.id;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res
        .status(400)
        .json(new ApiError(400, "available must be a boolean (true or false)"));
    }

    const service = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!service) {
      console.error("Service not found or not authorized");
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    service.available = available;
    await service.save();

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

/* =========================================================
   UPLOAD SERVICE MEDIA
   ========================================================= */
export const uploadServiceMedia = async (req, res) => {
  console.log("Incoming files for media upload:", req.files);
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Please upload at least one image or video"));
    }

    const imageUrls = [];
    const videoUrls = [];
    const { serviceName = "Service Video" } = req.body;

    for (const file of req.files) {
      if (file.mimetype.startsWith("image/")) {
        const cloudRes = await uploadOnCloudinary(file.path);
        if (cloudRes?.secure_url) {
          imageUrls.push(cloudRes.secure_url);
        } else {
          console.error(
            "❌ Failed to upload image to Cloudinary:",
            file.originalname
          );
        }
      } else if (file.mimetype.startsWith("video/")) {
        try {
          const videoTitle = `Service Video: ${serviceName}`;
          const videoDescription = `A video for our service: ${serviceName}.`;
          const youtubeUrl = await uploadVideoToYouTube(
            file.path,
            videoTitle,
            videoDescription
          );
          videoUrls.push(youtubeUrl);
        } catch (youtubeError) {
          console.error(
            "❌ Failed to upload video to YouTube:",
            file.originalname,
            youtubeError
          );
        }
      }
    }

    const mediaUrls = [...imageUrls, ...videoUrls];

    if (mediaUrls.length === 0) {
      return res
        .status(500)
        .json(new ApiError(500, "Media upload failed, please try again"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, mediaUrls, "Media uploaded successfully"));
  } catch (error) {
    console.error("❌ Error uploading service media:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

/* =========================================================
   UPDATE SERVICE IMAGE FIRST
   ========================================================= */
export const updateServiceImageFirst = async (req, res) => {
  console.log("Incoming update data:", req.body);
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

      service.serviceImage = [...service.serviceImage, ...imageUrls];
      await service.save();

      await client.del(`service:${serviceId}`);
      await client.del(`vendor:${vendorId}:services`);

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

/* =========================================================
   GET SUBCATEGORY LIST
   ========================================================= */
export const getSubcategoryList = async (req, res) => {
  try {
    const category = req.params.category;
    const list = SUBCATEGORY_MAP[category] || [];

    return res
      .status(200)
      .json(new ApiResponse(200, list, "Subcategories fetched"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};