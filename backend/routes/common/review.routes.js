// backend/routes/review.routes.js
import { Router } from "express";

import { verifyJwt } from "../../middleware/auth.middleware.js";
import {
  addReview,
  getAllReviews,
  getReviewsByService,
  getServiceRatingSummary,
} from "../../controller/common/review.controller.js";

const router = Router();

router.post("/add", verifyJwt, addReview);

router.get("/all", getAllReviews);


router.get("/getReview/:serviceId", getReviewsByService);
router.get("/rating/:serviceId", getServiceRatingSummary);
export default router;
