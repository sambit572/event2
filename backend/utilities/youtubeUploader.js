import { google } from "googleapis";
import fs from "fs";
import { ApiError } from "./ApiError.js";

// This setup uses the credentials you just saved in your .env file
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// We tell the client to use the refresh token you got
oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

export async function uploadVideoToYouTube(filePath, title, description) {
  try {
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title,
          description: description,
        },
        status: {
          privacyStatus: "unlisted", // Uploads as unlisted as requested
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error("YouTube API did not return a video ID.");
    }

    console.log(`✅ Video uploaded successfully. Video ID: ${videoId}`);
    // Clean up the temporarily stored file from your server's 'uploads' folder
    fs.unlinkSync(filePath);

    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error("❌ Error uploading to YouTube:", error.message);
    // Clean up the file even if the upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new ApiError("Failed to upload video to YouTube.");
  }
}

const getYouTubeVideoId = (url) => {
  if (typeof url !== "string") return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const deleteVideoFromYouTube = async (videoUrl) => {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) {
    console.warn(`Could not extract YouTube video ID from URL: ${videoUrl}`);
    // We don't throw an error, just skip it, as it's not a deletable video.
    return;
  }

  try {
    await youtube.videos.delete({
      id: videoId,
    });
    console.log(
      `✅ Video deleted successfully from YouTube. Video ID: ${videoId}`
    );
  } catch (error) {
    console.error(
      `❌ Error deleting video from YouTube. Video ID: ${videoId}`,
      error.message
    );
  }
};
