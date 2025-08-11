import express from "express";
import { toggleWishlist, getWishlist } from "../../controller/user/wishlist.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";
import { Wishlist } from "../../model/user/wishlist.model.js"; 
const router = express.Router();

router.get("/getwishlist", verifyJwt, getWishlist);
router.post("/toggle/:serviceId", verifyJwt, toggleWishlist);


router.delete("/deleteWishlist/:id", verifyJwt, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByIdAndDelete(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting wishlist item:", error); 
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
