import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

// 1. Configuration
// --------------------------------------------------
dotenv.config(); // Loads .env file variables

import { config } from "dotenv";
config({ path: "../.env.development" });

const app = express();
const port = 8001; // The port your backend will run on

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // Should be: http://localhost:8001/api/youtube/oauth2callback
);

// 2. Scopes (Permissions)
// --------------------------------------------------
// We've updated the scope to grant full access, which includes uploading AND deleting.
const scopes = ["https://www.googleapis.com/auth/youtube"];

// 3. Route to INITIATE the OAuth Flow
// --------------------------------------------------
// When a user visits this URL, they will be redirected to Google's consent screen.
app.get("/auth/youtube", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Essential for getting a refresh token
    prompt: "consent", // Forces the consent screen, ensuring a refresh token is issued
    scope: scopes,
  });
  console.log("Redirecting user to Google for authentication...");
  res.redirect(authUrl);
});

// 4. The Redirect URI Route (Callback)
// --------------------------------------------------
// Google redirects the user back to this URL after they have given consent.
// This route replaces the manual "Enter the code from that page here: " part.
app.get("/api/youtube/oauth2callback", async (req, res) => {
  // Get the authorization code from the query parameters
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code not found.");
  }

  try {
    console.log("Received authorization code. Exchanging for tokens...");

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    console.log("✅ Tokens received successfully!");
    console.log("Your new tokens:", tokens);

    // --- CRITICAL STEP ---
    // TODO: Securely save the `tokens.refresh_token` to your database
    // and associate it with the logged-in user. You will need this
    // refresh token to make API calls on their behalf in the future.
    if (tokens.refresh_token) {
      console.log("➡️ New Refresh Token:", tokens.refresh_token);
      // Example: await saveUserRefreshToken(userId, tokens.refresh_token);
    }

    // You can now redirect the user back to your frontend application
    res.send("Authentication successful! You can close this tab.");
    // Or redirect them: res.redirect('http://localhost:5173/dashboard?auth=success');
  } catch (error) {
    console.error("❌ Error exchanging code for tokens:", error.message);
    res.status(500).send("Failed to retrieve access token.");
  }
});

// 5. Start the Server
// --------------------------------------------------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(
    `To start authentication, visit: http://localhost:${port}/auth/youtube`
  );
});
