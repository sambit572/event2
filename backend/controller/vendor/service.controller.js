import { Service } from "../../model/vendor/service.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";

export const createService = async (req, res) => {
  try {
    console.log("🔵 createService called");
    // console.log("Request body:", req.body);
    // console.log("Uploaded files count:", req.files ? req.files.length : 0);

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
      vendorId: req.vendor._id,
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

    await Vendor.findByIdAndUpdate(req.vendor._id, {
      $set: { registrationProgress: 2 },
    });

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

    console.log("inside update service..")

    const vendorId = req.vendor._id;
    const serviceId = req.params.id;

    // console.log("vendorId: ",vendorId);
    // console.log("serviceId: ",serviceId);

    const existingService = await Service.findOne({
      _id: serviceId,
      vendorId: vendorId,
    });

    if (!existingService) {
      console.error("Service not found or not authorized: ", existingService);
      return res
        .status(404)
        .json(new ApiError(404, "Service not found or not authorized"));
    }

    // Merge existing data with new updates
    const {
      serviceName = existingService.serviceName,
      serviceDes = existingService.serviceDes,
      serviceCategory = existingService.serviceCategory,
      priceRange = existingService.priceRange,
      locationOffered = existingService.locationOffered,
      duration = existingService.duration,
      serviceImage = existingService.serviceImage, // critical!
    } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        serviceName,
        serviceDes,
        serviceCategory,
        priceRange,
        locationOffered,
        duration,
        serviceImage,
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

export const updateAvailability = async (req, res) => {
  try {
    const vendorId = req.vendor._id; // assumes vendor is attached via auth middleware
    const serviceId = req.params.id;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res
        .status(400)
        .json(
          new ApiError(400, "`available` must be a boolean (true or false)")
        );
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

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Availability updated successfully"));
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const updateServiceImageFirst = async (req,res)=>{

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

      return res.status(200).json(new ApiResponse(200,imageUrls,"Images are upload to cloudinary only "))
    } else {
      console.error("❌ No images uploaded");
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }
}
