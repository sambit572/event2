import { Wishlist } from "../../model/user/wishlist.model.js";
import { Service } from "../../model/vendor/service.model.js";
import client from "../../db/redisClient.js";

// 🗑️ Remove wishlist item
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByIdAndDelete(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ❌ Invalidate Redis cache
    await client.del(`wishlist:${wishlistItem.user.toString()}`);

    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔄 Toggle wishlist (add/remove)
export const toggleWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user._id.toString();

    const existing = await Wishlist.findOne({
      user: userId,
      service: serviceId,
    });

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });

      // ❌ Invalidate Redis cache
      await client.del(`wishlist:${userId}`);

      return res.status(200).json({ message: "Removed from wishlist" });
    }

    const newItem = new Wishlist({ user: userId, service: serviceId });
    await newItem.save();

    // ❌ Invalidate Redis cache
    await client.del(`wishlist:${userId}`);

    return res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 Get all wishlist items for logged-in user
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const start = performance.now();

    // 1️⃣ Check Redis cache first
    const cachedWishlist = await client.get(`wishlist:${userId}`);
    if (cachedWishlist) {
      console.log("⚡ Returning wishlist from Redis cache");

      const end = performance.now();
      console.log(`wishlistFetch backend api took ${end - start} ms`);
      return res.status(200).json(JSON.parse(cachedWishlist));
    }

    // 2️⃣ If not cached, fetch from MongoDB
    const wishlist = await Wishlist.find({ user: userId })
      .populate("service")
      .sort({ createdAt: -1 });

    // 3️⃣ Store result in Redis (set expiry 10 min)
    await client.setEx(
      `wishlist:${userId}`,
      600, // 600 seconds = 10 mins
      JSON.stringify(wishlist)
    );

    console.log("✅ Fetched wishlist from DB and cached in Redis");
    res.status(200).json(wishlist);
    const end = performance.now();
    console.log(`wishlistFetch backend api ${end - start} ms`);
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
