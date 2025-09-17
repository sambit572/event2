import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user/user.model.js";
import { performance } from "perf_hooks";

export const verifyJwt = async (req, res, next) => {
  const start = performance.now();

  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      // No access token at all → attempt refresh flow
      return await handleRefreshFlow(req, res, next, start);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;

    console.log(`⏱️ verifyJwt took ${(performance.now() - start).toFixed(2)} ms`);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return await handleRefreshFlow(req, res, next, start);
    }

    console.log(`❌ verifyJwt failed after ${(performance.now() - start).toFixed(2)} ms`);
    console.error("Error in JWT verification:", error.message);
    return res.status(401).json({ message: error.message || "Invalid access token" });
  }
};

const handleRefreshFlow = async (req, res, next, start) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new ApiError(401, "Refresh token missing");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "User not found");

    // ✅ Generate new access token and save it to DB
    const newAccessToken = user.generateAccessToken();
    user.accessToken = newAccessToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    req.user = user;

    console.log(
      `🔁 Refresh flow succeeded after ${(performance.now() - start).toFixed(2)} ms`
    );
    return next();
  } catch (err) {
    console.log(`❌ Refresh flow failed after ${(performance.now() - start).toFixed(2)} ms`);
    return res.status(401).json({
      message: err.message || "Refresh token invalid or expired",
    });
  }
};
