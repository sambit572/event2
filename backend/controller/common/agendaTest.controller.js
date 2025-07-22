import dayjs from "dayjs";
import agenda from "../../agenda/agenda.js";

export const scheduleDummyReminder = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // Schedule job to run in 10 seconds
    await agenda.schedule("in 10 seconds", "send dummy reminder", {
      email,
      name,
    });

    return res.status(200).json({
      message: `Dummy reminder scheduled for ${email} in 10 seconds`,
    });
  } catch (error) {
    console.error("❌ Error scheduling dummy reminder:", error);
    return res
      .status(500)
      .json({ message: "Failed to schedule dummy reminder" });
  }
};

export const scheduleVendorReminder = async (req, res) => {
  try {
    const {
      vendorEmail,
      vendorName,
      eventTitle,
      eventDate, 
    } = req.body;

    if (!vendorEmail || !vendorName || !eventTitle || !eventDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // For testing: schedule after 30 seconds
    const scheduledTime = dayjs().add(30, "second").toDate();

    await agenda.schedule(scheduledTime, "send vendor reminder", {
      vendorEmail,
      vendorName,
      eventTitle,
      eventDate,
    });

    return res.status(200).json({
      message: `Vendor reminder scheduled to run at ${scheduledTime}`,
    });
  } catch (error) {
    console.error("❌ Error scheduling vendor reminder:", error);
    return res
      .status(500)
      .json({ message: "Failed to schedule vendor reminder" });
  }
};
