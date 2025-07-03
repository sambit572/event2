import jwt from "jsonwebtoken";
import Vendor from "../model/vendor/vendor.model.js";
import { ApiError } from "../utilities/ApiError.js";

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

    const decoded = jwt.verify(token, process.env.VENDOR_ACCESS_TOKEN_SECRET);
    const vendor = await Vendor.findById(decoded._id);

    if (!vendor) {
      throw new ApiError(401, "Vendor not found");
    }

    req.vendor = vendor;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: err.message || "Invalid vendor token" });
  }
};
