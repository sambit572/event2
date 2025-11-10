import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  getCartWithUserDetails,
} from "../../controller/user/cart.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyJwt, addToCart);
router.get("/", verifyJwt, getCart);
router.get("/:userDetailsId", verifyJwt, getCartWithUserDetails);

// ✅ FIXED: Changed from serviceId to itemId (cart document _id)
router.delete("/:itemId", verifyJwt, removeFromCart);

export default router;
