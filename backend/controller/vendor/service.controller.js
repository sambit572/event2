import { Service } from "../../model/vendor/service.model.js";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";

export const createService = async (req, res) => {
  try {
    console.log("🔵 createService called");
    console.log("Request body:", req.body);
    console.log("Uploaded files count:", req.files ? req.files.length : 0);

    const {
      serviceCategory,
      priceRange,
      minPrice,
      serviceName,
      locationOffered,
      serviceDes,
      days = 0,
      hrs = 0,
      mins = 0,
    } = req.body;

    // Validate required fields
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

    // Calculate duration in minutes
    const duration =
      parseInt(days) * 24 * 60 + parseInt(hrs) * 60 + parseInt(mins);
    console.log("Calculated duration (minutes):", duration);

    if (isNaN(duration) || duration <= 0) {
      console.error("❌ Invalid estimated duration:", { days, hrs, mins });
      return res.status(400).json({ message: "Invalid estimated duration" });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log("Uploading images to Cloudinary...");
      for (const file of req.files) {
        console.log(
          "Processing file:",
          file.originalname,
          "at path:",
          file.path
        );
        const cloudRes = await uploadOnCloudinary(file.path);
        console.log(
          "Cloudinary response for",
          file.originalname,
          ":",
          cloudRes
        );
        if (cloudRes?.secure_url) {
          console.log("✅ Image uploaded successfully:", cloudRes.secure_url);
          imageUrls.push(cloudRes.secure_url);
        } else {
          console.error("❌ Failed to upload image:", file.originalname);
        }
      }
      console.log("Final image URLs:", imageUrls);
    } else {
      console.error("❌ No images uploaded");
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    // Save service document to database
    console.log("Creating new service document in DB...");
    const newService = await Service.create({
      serviceCategory,
      serviceImage: imageUrls,
      priceRange,
      minPrice,
      serviceName,
      locationOffered,
      serviceDes,
      duration,
    });
    console.log("✅ Service created successfully:", newService);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newService,
          "Service created and saved succesfully"
        )
      );
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
