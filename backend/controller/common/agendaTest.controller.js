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
    const { vendorEmail, vendorName, eventTitle, eventDate } = req.body;

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

export const scheduleReviewRequest = async (req, res) => {
  try {
    const { userEmail, userName, vendorName, eventTitle, eventDate } = req.body;

    // ✅ For real: use `dayjs(eventDate).add(2, 'day')`
    const runAt = dayjs().add(30, "second").toDate(); // test now

    await agenda.schedule(runAt, "send review request", {
      userEmail,
      userName,
      vendorName,
      eventTitle,
      eventDate,
    });

    return res
      .status(200)
      .json({ message: `Review request scheduled for ${runAt}` });
  } catch (err) {
    console.error("❌ Failed to schedule review request:", err);
    return res.status(500).json({ message: "Failed to schedule" });
  }
};

export const schedulePDFGeneration = async (req, res) => {
  try {
    const {
      bookingId,
      userName,
      userEmail,
      vendorName,
      eventTitle,
      eventDate,
      totalAmount,
    } = req.body;

    const runAt = dayjs().add(30, "second").toDate(); // for testing

    await agenda.schedule(runAt, "generate booking pdf", {
      bookingId,
      userName,
      userEmail,
      vendorName,
      eventTitle,
      eventDate,
      totalAmount,
    });

    return res.status(200).json({
      message: `PDF job scheduled for ${runAt}`,
    });
  } catch (err) {
    console.error("❌ Failed to schedule PDF job:", err);
    return res.status(500).json({ message: "Failed to schedule PDF job" });
  }
};
