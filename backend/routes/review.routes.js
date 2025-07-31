import express from "express";
import { addReview, getAllReviews } from "../controller/common/review.controller.js";

const router = express.Router();

// POST /reviews/add
router.post("/add", addReview);

// GET /reviews/all
router.get("/all", getAllReviews);

export default router;