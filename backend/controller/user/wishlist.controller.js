import { Wishlist } from "../../model/user/wishlist.model.js";
import { Service } from "../../model/vendor/service.model.js";
import { ApiError } from "../../utilities/ApiError.js";

// Toggle wishlist item
export const toggleWishlist = async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user._id;

  const existing = await Wishlist.findOne({ user: userId, service: serviceId });

  if (existing) {
    await Wishlist.deleteOne({ _id: existing._id });
    return res.status(200).json({ message: "Removed from wishlist" });
  }

  const newItem = new Wishlist({ user: userId, service: serviceId });
  await newItem.save();

  return res.status(200).json({ message: "Added to wishlist" });
};

// Get all wishlist items for logged-in user
export const getWishlist = async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.find({ user: userId })
    .populate("service")
    .sort({ createdAt: -1 });
  res.status(200).json(wishlist);
};
