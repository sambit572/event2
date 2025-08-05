import express from "express";
import {
  getServiceById,
  getServicesByCategory,
} from "../../controller/common/serviceList.controller.js";

const router = express.Router();
router.get("/category/:category", getServicesByCategory);
router.get("/service/:id", getServiceById);
export default router;
