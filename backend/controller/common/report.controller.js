import Report from "../../model/common/report.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import client from "../../db/redisClient.js"; // your Redis client

// Create a new report (POST)
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

    const createdReport = await Report.findById(report._id);
    if (!createdReport) {
      return res.status(500).json(new ApiError(500, "Unable to create Report"));
    }

    // ❌ Invalidate Redis cache for this user+type (important!)
    await client.del(`reports:${reporterId}:${selectedType}`);

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch reports (GET)
export const fetchReports = async (req, res) => {
  try {
    const { userId } = req.params;
    const { targetType } = req.query; // Assuming targetType is passed as a query parameter

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

    // 1️⃣ Try Redis cache first
    const cachedReports = await client.get(`reports:${userId}:${targetType}`);
    if (cachedReports) {
      console.log("⚡ Returning reports from Redis cache");
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cachedReports) });
    }

    // 2️⃣ Fetch from DB if not cached
    const reports = await Report.find({
      reporterId: userId,
      selectedType: targetType,
    }).sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reports found for this user" });
    }

    // 3️⃣ Store in Redis (expires in 10 mins)
    await client.setEx(
      `reports:${userId}:${targetType}`,
      600, // 10 minutes
      JSON.stringify(reports)
    );

    console.log("✅ Fetched reports from DB and cached in Redis");
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching reports" });
  }
};
