import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../../controller/user/cart.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyJwt, addToCart);

router.get("/", verifyJwt, getCart);

router.delete("/:serviceId", verifyJwt, removeFromCart);

export default router;