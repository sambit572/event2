import express from "express";
import {
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../controller/user/wishlist.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";
import { Wishlist } from "../../model/user/wishlist.model.js";
const router = express.Router();

router.get("/getwishlist", verifyJwt, getWishlist);
router.post("/toggle/:serviceId", verifyJwt, toggleWishlist);

router.delete("/deleteWishlist/:id", verifyJwt, removeFromWishlist);

export default router;
