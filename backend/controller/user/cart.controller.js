import { Cart } from "../../model/user/cart.model.js";
import { Service } from "../../model/vendor/service.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { getIO } from "../../socket/index.js"; 
import { Negotiation } from "../../model/common/Negotiation.model.js";
import { UserDetails } from "../../model/user/userDetails.model.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import mongoose from "mongoose";

// ➕ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json(new ApiError(400, "Service ID is required."));
    }

    const exists = await Cart.findOne({ userId, serviceId });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "This service is already in your cart.",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.available) {
      return res.status(404).json(new ApiError(404, "Service not available or doesn't exist."));
    }

    await Cart.create({ userId, serviceId });

    const io = getIO();
    io.to(userId.toString()).emit("cart-updated", {
      count: await Cart.countDocuments({ userId }),
    });

    return res.status(201).json({
      success: true,
      message: "Service added to cart.",
    });
  } catch (error) {
      console.error("Add to cart error:", error);
      // Use the ApiError utility for consistent error responses
      return res.status(500).json(new ApiError(500, "Internal Server Error in case of add to cart"));
  }
};

// 🛒 Get All Items in Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const items = await Cart.find({ userId })
      .populate({
          path: "serviceId",
          model: "Service" // Explicitly specify the model name
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
      console.error("Get cart error:", error);
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// ❌ Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId } = req.params;

    const deleted = await Cart.findOneAndDelete({ userId, serviceId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found in cart.",
      });
    }

    const io = getIO();
    io.to(userId.toString()).emit("cart-updated", {
      count: await Cart.countDocuments({ userId }),
    });

    return res.status(200).json({
      success: true,
      message: "Service removed from cart.",
    });
  } catch (error) {
      console.error("Remove from cart error:", error);
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};


export const getSingleCart = async (req, res) => {
  try {
    console.log("Getting single cart item...");
    const { userDetailsId } = req.params;

    // Step 1: Get bookedById, bookedBy, and serviceId from UserDetails
    const userDetails = await UserDetails.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(userDetailsId),
        },
      },
      {
        $project: {
          serviceId: 1,
          bookedById: 1,
        },
      },
    ]);

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User details not found.",
      });
    }

    const { serviceId, bookedById } = userDetails[0];

    // Step 2: Find Negotiation using those fields
    const item = await Negotiation.findOne({
      serviceId,
      bookedById,
    }).populate({
      path: "serviceId",
      model: "Service",
    });

    // console.log("Negotiation item found:", item);
    // Use this above console log to understand the structure of the item

    if (!item) {
      return res.status(404).json(new ApiError(404, "Negotiation not found for given user details."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Negotiation found.", item));
  } catch (error) {
    console.error("Get single cart item error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};