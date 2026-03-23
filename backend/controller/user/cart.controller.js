import { UserDetails } from "../../model/user/userDetails.model.js";
import { Cart } from "../../model/user/cart.model.js";
import { Service } from "../../model/vendor/service.model.js";
import { Negotiation } from "../../model/common/Negotiation.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import mongoose from "mongoose";
import client from "../../db/redisClient.js";
import { getIO } from "../../socket/index.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId, cateringDetails } = req.body;

    console.log("📦 Add to cart request:", {
      userId: userId.toString(),
      serviceId,
      hasCateringDetails: !!cateringDetails,
      packageName: cateringDetails?.packageName,
    });

    if (!serviceId) {
      return res.status(400).json(new ApiError(400, "Service ID is required."));
    }

    // Fetch the service to check availability and type
    const service = await Service.findById(serviceId);
    if (!service || !service.available) {
      return res
        .status(404)
        .json(new ApiError(404, "Service not available or doesn't exist."));
    }

    const isCateringService = service.pricingType === "perPlate";

    // === VALIDATION FOR CATERING SERVICES ===
    if (isCateringService) {
      if (!cateringDetails) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Catering details (package, plates) are required for catering services."
            )
          );
      }

      const {
        packageName,
        plateCount,
        pricePerPlate,
        totalPrice,
        minPlates,
        maxPlates,
      } = cateringDetails;

      // Validate required fields
      if (!packageName || !plateCount || !pricePerPlate || !totalPrice) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Package name, plate count, price per plate, and total price are required."
            )
          );
      }

      // Validate plate count is within allowed range
      if (minPlates && maxPlates) {
        if (plateCount < minPlates || plateCount > maxPlates) {
          return res
            .status(400)
            .json(
              new ApiError(
                400,
                `Plate count must be between ${minPlates} and ${maxPlates}.`
              )
            );
        }
      }

      // Validate price calculation
      const expectedTotal = plateCount * pricePerPlate;
      if (Math.abs(totalPrice - expectedTotal) > 1) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Total price calculation mismatch. Please refresh and try again."
            )
          );
      }

      // ✅ FIXED: Check for duplicate with explicit query
      console.log("🔍 Checking for existing catering package:", {
        userId: userId.toString(),
        serviceId: serviceId.toString(),
        packageName,
      });

      const existingCateringItem = await Cart.findOne({
        userId,
        serviceId,
        isCateringService: true,
        "cateringDetails.packageName": packageName,
      }).lean();

      console.log(
        "🔍 Existing item found:",
        existingCateringItem ? "YES" : "NO"
      );

      if (existingCateringItem) {
        return res.status(409).json({
          success: false,
          message: `"${packageName}" is already in your cart. Remove it first to add with different quantity.`,
        });
      }

      // Create cart item with catering details
      console.log("✅ Creating new catering cart item:", {
        userId: userId.toString(),
        serviceId: serviceId.toString(),
        packageName,
        plateCount,
        totalPrice,
      });

      try {
        const newCartItem = await Cart.create({
          userId,
          serviceId,
          isCateringService: true,
          cateringDetails: {
            packageName,
            plateCount,
            pricePerPlate,
            totalPrice,
            minPlates,
            maxPlates,
          },
        });

        console.log("✅ Cart item created successfully:", newCartItem._id);
      } catch (createError) {
        console.error("❌ Error creating cart item:", createError);

        // Handle MongoDB duplicate key error
        if (createError.code === 11000) {
          return res.status(409).json({
            success: false,
            message: `"${packageName}" is already in your cart.`,
          });
        }
        throw createError;
      }
    } else {
      // === REGULAR (NON-CATERING) SERVICE ===

      console.log("🔍 Checking for existing regular service");

      const existingRegularItem = await Cart.findOne({
        userId,
        serviceId,
        isCateringService: false,
      }).lean();

      if (existingRegularItem) {
        return res.status(409).json({
          success: false,
          message: "This service is already in your cart.",
        });
      }

      // Create regular cart item
      console.log("✅ Creating new regular cart item");

      await Cart.create({
        userId,
        serviceId,
        isCateringService: false,
      });
    }

    // Invalidate Redis cache for this user's cart
    await client.del(`cart:${userId}`);

    // Emit Socket.IO notification
    try {
      const io = getIO();
      io.to(userId.toString()).emit("cart-updated", {
        count: await Cart.countDocuments({ userId }),
      });
    } catch (socketError) {
      console.warn("Socket.IO notification failed:", socketError.message);
    }

    return res.status(201).json({
      success: true,
      message: isCateringService
        ? `${cateringDetails.packageName} added to cart successfully!`
        : "Service added to cart.",
    });
  } catch (error) {
    console.error("❌ Add to cart error:", error);

    // Handle duplicate key error (MongoDB E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This item is already in your cart.",
      });
    }

    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error while adding to cart"));
  }
};

// 🛒 Get All Items in Cart (Your existing function - preserved)
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Try Redis cache first
    const cacheKey = `cart:${userId}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("⚡ Returning cart from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // 2️⃣ If not in cache → Fetch from DB
    const items = await Cart.find({ userId })
      .populate({
        path: "serviceId",
        model: "Service",
      })
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      count: items.length,
      data: items,
    };

    // 3️⃣ Store in Redis for 1 hour
    await client.set(cacheKey, JSON.stringify(response), "EX", 3600);

    console.log("✅ Fetched cart from DB and cached in Redis");

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// ❌ Remove from Cart (Your existing function - preserved)
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params; // ✅ Changed from serviceId to itemId

    console.log("🗑️ Remove from cart request:", {
      userId: userId.toString(),
      itemId,
    });

    // ✅ FIXED: Delete by cart item's _id, not serviceId
    const deleted = await Cart.findOneAndDelete({
      _id: itemId, // ✅ This is the cart document's _id
      userId, // ✅ Security: ensure user owns this cart item
    });

    if (!deleted) {
      console.log("❌ Cart item not found");
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    console.log("✅ Cart item deleted successfully:", deleted._id);

    // Invalidate Redis cache for this user's cart
    try {
      await client.del(`cart:${userId}`);
      console.log("🔄 Redis cache invalidated");
    } catch (cacheError) {
      console.warn("⚠️ Redis cache clear failed:", cacheError.message);
    }

    // Emit Socket.IO notification
    try {
      const io = getIO();
      const remainingCount = await Cart.countDocuments({ userId });
      io.to(userId.toString()).emit("cart-updated", {
        count: remainingCount,
      });
      console.log("📢 Socket.IO notification sent");
    } catch (socketError) {
      console.warn("⚠️ Socket.IO notification failed:", socketError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
      data: {
        removedItemId: deleted._id,
        remainingCount: await Cart.countDocuments({ userId }),
      },
    });
  } catch (error) {
    console.error("❌ Remove from cart error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const ObjectId = mongoose.Types.ObjectId;

export const getCartWithUserDetails = async (req, res) => {
  try {
    const { userDetailsId } = req.params;

    if (!ObjectId.isValid(userDetailsId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid userDetailsId format."));
    }

    // Fetch userDetails document
    const userDetails = await UserDetails.findById(userDetailsId);
    if (!userDetails) {
      return res.status(404).json(new ApiError(404, "User details not found."));
    }

    console.log("User details found:", userDetails);

    const userId = userDetails.bookedById;
    const serviceIds = userDetails.serviceId;

    if (!serviceIds || serviceIds.length === 0) {
      console.log(
        "No service IDs found in user details. Returning empty cart."
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orderType: "empty", items: [] },
            "No items found for this order."
          )
        );
    }

    // Validate userId and serviceIds are ObjectId instances or convert if strings
    const validUserId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    if (!validUserId) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid bookedByUserId format."));
    }

    const validServiceIds = serviceIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (validServiceIds.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orderType: "empty", items: [] },
            "No valid service IDs found."
          )
        );
    }

    console.log(`Checking for negotiations for services:`, validServiceIds);
    console.log(`With bookedByUserId:`, validUserId);

    // Fetch negotiations in parallel for all services and the given user
    const negotiationPromises = validServiceIds.map((serviceId) =>
      Negotiation.findOne({ serviceId, bookedByUserId: validUserId }).populate({
        path: "serviceId",
        model: "Service",
      })
    );

    const negotiations = await Promise.all(negotiationPromises);

    const items = negotiations.filter((item) => item !== null);

    if (items.length === 0) {
      console.log("No matching negotiations found for these services.");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orderType: "empty", items: [] },
            "No negotiated items found for this order."
          )
        );
    }

    const orderType = items.length > 1 ? "multiple" : "single";

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { orderType, items },
          "Order items fetched successfully."
        )
      );
  } catch (error) {
    console.error("getCartWithUserDetails ERROR:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error while fetching cart."));
  }
};

// Helper function to calculate order summary (can be used in both single and multiple)
export const calculateOrderSummary = (items, orderType = "single") => {
  if (!items || !items.length) {
    return {
      finalTotal: 0,
      platformDiscountAmount: 0,
      totalAfterDiscount: 0,
      cgst: 0,
      sgst: 0,
      grandTotal: 0,
    };
  }

  // Calculate total using proposedPrice from negotiations
  const finalTotal = items.reduce((acc, item) => {
    const itemPrice = item.proposedPrice || 0;
    return acc + itemPrice;
  }, 0);

  // Calculate 10% platform discount
  const platformDiscountAmount = Math.round(finalTotal * 0.1);
  const totalAfterDiscount = finalTotal - platformDiscountAmount;

  // Calculate taxes on the price after discount
  const cgst = Math.round(totalAfterDiscount * 0.09);
  const sgst = Math.round(totalAfterDiscount * 0.09);
  const grandTotal = totalAfterDiscount + cgst + sgst;

  return {
    finalTotal,
    platformDiscountAmount,
    totalAfterDiscount,
    cgst,
    sgst,
    grandTotal,
    itemCount: items.length,
    orderType,
  };
};

// Get cart item count for a user
export const getCartItemCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const count = await Cart.countDocuments({ userId });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          count,
        },
        "Cart item count retrieved."
      )
    );
  } catch (error) {
    console.error("Get cart count error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
