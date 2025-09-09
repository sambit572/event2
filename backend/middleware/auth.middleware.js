import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user/user.model.js";
import { performance } from "perf_hooks"; // ✅ import performance

export const verifyJwt = async (req, res, next) => {
  const start = performance.now(); // ✅ start timer
  try {
    // Get token from cookies or authorization header
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.header("Authorization");

      if (!authHeader) {
        throw new ApiError(401, "Unauthorized: Authorization header missing");
      }

      token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: Token not found");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    const end = performance.now(); // ✅ end timer
    console.log(`⏱️ verifyJwt took ${(end - start).toFixed(2)} ms`);

    next();
  } catch (error) {
    const end = performance.now();
    console.log(`❌ verifyJwt failed after ${(end - start).toFixed(2)} ms`);

    console.error("Error in JWT verification:", error.message);
    return res
      .status(401)
      .json({ message: error.message || "Invalid access token" });
  }
};
