import jwt from "jsonwebtoken";
import Vendor from "../model/vendor/vendor.model.js";
import { ApiError } from "../utilities/ApiError.js";

// ✅ Middleware to verify vendor JWT token
export const verifyVendorJwt = async (req, res, next) => {
  try {
    let token = req.cookies?.vendorAccessToken;

    if (!token) {
      const authHeader = req.header("Authorization");
      token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: Vendor token not found");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const vendor = await Vendor.findById(decoded._id);

    if (!vendor) {
      throw new ApiError(401, "Vendor not found");
    }

    req.vendor = vendor; // ✅ Attach vendor to request
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: err.message || "Invalid vendor token" });
  }
};

// ✅ Middleware to ensure that the logged-in user is a vendor
export const authenticateVendor = (req, res, next) => {
  if (!req.vendor || req.vendor.role !== "vendor") {
    return res.status(403).json({ message: "Forbidden: Not a vendor" });
  }
  next();
};
