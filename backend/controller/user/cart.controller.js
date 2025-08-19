import { Cart } from "../../model/user/cart.model.js";
import { Service } from "../../model/vendor/service.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { getIO } from "../../socket/index.js"; 

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
      if (error instanceof ApiError) {
          return res.status(error.statusCode).json(new ApiError(error.statusCode, error.message));
      }
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
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