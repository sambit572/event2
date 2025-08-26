import express from "express";

const router = express.Router();
import { createReport } from "../../controller/common/report.controller.js";
import { fetchReports } from "../../controller/common/report.controller.js";

// POST: Create a new report
router.post("/", createReport);
router.get("/:userId", fetchReports);

// Get reports by reporterId
// router.get("/my-reports/:id", async (req, res) => {
//   try {
//     const reports = await Report.find({ reporterId: req.params.id });
//     res.json(reports);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
