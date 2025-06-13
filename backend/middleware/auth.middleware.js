import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJwt = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.header("Authorization");
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
    next();
  } catch (error) {
    console.error("Error in JWT verification:", error.message);
    return res
      .status(401)
      .json({ message: error.message || "Invalid access token" });
  }
};
