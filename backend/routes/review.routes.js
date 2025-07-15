// routes/review.routes.js
import express from "express";
import { addReview, getAllReviews } from "../controller/common/review.controller.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/all", getAllReviews);

export default router;
