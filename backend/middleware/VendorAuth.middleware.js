import jwt from "jsonwebtoken";
import Vendor from "../model/vendor/vendor.model.js";
import { ApiError } from "../utilities/ApiError.js";

// ✅ Middleware to verify vendor JWT token and refresh if expired
export const verifyVendorJwt = async (req, res, next) => {
  try {
    let token = req.cookies?.vendorAccessToken;

    if (!token) {
      const authHeader = req.header("Authorization");
      token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;
    }

    // If no access token, try refresh
    if (!token) {
      return await handleRefreshFlow(req, res, next);
    }

    try {
      // ✅ Verify access token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const vendor = await Vendor.findById(decoded._id);

      if (!vendor) throw new ApiError(401, "Vendor not found");

      req.vendor = vendor;
      return next();
    } catch (err) {
      // If token expired, check refresh
      if (err.name === "TokenExpiredError") {
        return await handleRefreshFlow(req, res, next);
      }
      throw new ApiError(401, "Invalid vendor access token");
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: err.message || "Unauthorized: Vendor token invalid" });
  }
};

// ✅ Helper: refresh flow
const handleRefreshFlow = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.vendorRefreshToken;
    if (!refreshToken) throw new ApiError(401, "Refresh token missing");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const vendor = await Vendor.findById(decoded._id);
    if (!vendor) throw new ApiError(401, "Vendor not found");

    // ✅ Generate new access token
    const newAccessToken = vendor.generateAccessToken();
    vendor.accessToken = newAccessToken;
    await vendor.save();

    // ✅ Send back in cookie
    res.cookie("vendorAccessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    req.vendor = vendor;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: err.message || "Refresh token invalid or expired",
    });
  }
};
