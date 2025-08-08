// import Review from "../../model/common/booking.model.js";

import Report from "../../model/common/report.model.js"; // adjust path to your model

// Create a new report
export const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    console.log("Report created:", report);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
