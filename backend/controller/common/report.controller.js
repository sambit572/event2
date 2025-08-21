// import Review from "../../model/common/booking.model.js";

import Report from "../../model/common/report.model.js"; // adjust path to your model
import { ApiError } from "../../utilities/ApiError.js";

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { reporterId, selectedType, reason, description } = req.body;
    console.log("Creating report with data:", req.body);
    if (!reporterId || !selectedType || !reason || !description) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const report = await Report.create({
      reporterId,
      selectedType,
      reason,
      description,
    });
    // console.log("ReportsId form backend", reporterId);
    const createdReport = await Report.findById(report._id);
    // console.log("Created Report:", createdReport);
    if (!createdReport) {
      return res.status(500).json(new ApiError(500, "Unable to create Report"));
    }

    // console.log("Report created:", report);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const { targetType } = req.query; // Assuming targetType is passed as a query parameter
    // console.log("Fetching req.query:", req.query);
    // console.log(
    //   "Fetching reports for user ID:",
    //   userId,
    //   "and target type:",
    //   targetType
    // );
    // console.log("Fetching reports for user ID:", userId);
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found" });
    }
    if (!targetType) {
      return res
        .status(400)
        .json({ success: false, message: "selectedType not found" });
    }

    const reports = await Report.find({
      reporterId: userId,
      selectedType: targetType,
    }).sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reports found for this user" });
    }

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching reports" });
  }
};
