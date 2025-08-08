// import Review from "../../model/common/booking.model.js";

import Report from "../../model/common/report.model.js"; // adjust path to your model
import { ApiError } from "../../utilities/ApiError.js";

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { reporterId, targetType, reason, description } = req.body;
    if (!reporterId || !targetType || !reason || !description) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const report = await Report.create({
      reporterId,
      targetType,
      reason,
      description,
    });

    const createdReport = await User.findById(user._id);
    if (!createdReport) {
      return res.status(500).json(new ApiError(500, "Unable to create Report"));
    }

    console.log("Report created:", report);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
