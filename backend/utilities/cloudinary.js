import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload File to Cloudinary (returns result or null)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("❌ Error: localFilePath is missing");
      return null;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "vendors", // 👈 saves it under vendors/filename
    });

    // Delete local file after upload
    fs.unlinkSync(localFilePath);

    return result; // includes url, public_id etc.
  } catch (error) {
    console.error("❌ Error during upload:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // cleanup temp file on error
    }

    return null;
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
