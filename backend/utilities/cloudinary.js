import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload File to Cloudinary (returns result or throws error)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("localFilePath is missing");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "vendors", // 👈 saves it under vendors/filename
    });

    // Delete local file after upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result; // includes url, public_id etc.
  } catch (error) {
    console.error("❌ Error during Cloudinary upload:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup temp file on error
    }

    throw error; // Throw the error so the controller can catch and report it
  }
};

// ✅ Delete from Cloudinary using full avatar URL
const deleteFromCloudinary = async (avatarUrl) => {
  try {
    if (!avatarUrl) {
      console.log("❌ Error: avatarUrl is missing");
      return null;
    }

    // Extract vendor public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/<cloud_name>/image/upload/v123456/vendors/abc123.jpg
    const parts = avatarUrl.split("/upload/")[1];
    const publicIdWithExtension = parts.split(".")[0]; // vendors/abc123

    await cloudinary.uploader.destroy(publicIdWithExtension);
    console.log(`✅ Deleted image: ${publicIdWithExtension}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Cloudinary deletion error:", error);
    return { success: false, error };
  }
};

// ✅ Exports
export { uploadOnCloudinary, deleteFromCloudinary };
