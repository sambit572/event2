import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Error: LocalFilePath is missing");
      return null;
    }

    const uploadResult = await cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto",
      })
      .catch((error) => {
        console.log(error);
      });

    // Remove the locally saved temporary file after upload
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.error("Error during file upload:", error);

    // Remove locally saved temporary file if upload failed
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
      console.log("Error: avatarUrl is missing");
      return null;
    }

    // Extract the public_id from the avatar URL
    const publicId = avatarUrl.split("/").pop().split(".")[0]; // Example: "image_name.jpg"

    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image with public_id: ${publicId}`);
  } catch (error) {
    console.error("Error while deleting image from Cloudinary:", error);
  }
};

// Export both functions
export { uploadOnCloudinary, deleteFromCloudinary };
