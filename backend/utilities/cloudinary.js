import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
const uploadOnCloudinary = async (localFilePath, folder = "profile_pics") => {
  try {
    if (!localFilePath) {
      console.log("❌ Local file path missing");
      return null;
    }

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder, // optional folder like 'profile_pics'
    });

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.error("❌ Error during upload:", error);

    // Clean up local file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// Delete File from Cloudinary
const deleteFromCloudinary = async (avatarUrl) => {
  try {
    if (!avatarUrl) {
      console.log("❌ Avatar URL is missing");
      return null;
    }

    // Extract full public_id (supporting folders) from URL
    const urlParts = avatarUrl.split("/");
    const fileWithExt = urlParts.pop();
    const publicId = urlParts.slice(urlParts.indexOf("upload") + 1).join("/") + "/" + fileWithExt.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted Cloudinary image: ${publicId}`);
    return result;
  } catch (error) {
    console.error("❌ Error while deleting image:", error);
    return null;
  }
};

// Export functions
export { uploadOnCloudinary, deleteFromCloudinary };
