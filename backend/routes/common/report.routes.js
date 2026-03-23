import express from "express";

const router = express.Router();
import { createReport } from "../../controller/common/report.controller.js";
import { fetchReports } from "../../controller/common/report.controller.js";

// POST: Create a new report
router.post("/", createReport);
router.get("/:userId", fetchReports);

export default router;
