import moment from "moment";
import PDFDocument from "pdfkit";
import fs from "fs";
import { sendEmail } from "../../utilities/sendEmail.js";
import { User } from "../../model/user/user.model.js";
import Vendor from "../../model/vendor/vendor.model.js";
import { Review } from "../../model/common/review.model.js";
import path from "path";
import { fileURLToPath } from "url";

// Track last report generation to prevent duplicates
let lastReportGenerated = null;

// Helper function to check if we should generate report (1st of month only)
const shouldGenerateReport = () => {
  const now = moment();
  const today = now.date();
  const currentMonth = now.format("YYYY-MM");

  // Only generate on 1st of month
  if (today !== 1) {
    return false;
  }

  // Check if already generated this month
  if (lastReportGenerated === currentMonth) {
    console.log(`Monthly report already generated for ${currentMonth}`);
    return false;
  }

  return true;
};

// Function to mark report as generated for current month
const markReportGenerated = () => {
  lastReportGenerated = moment().format("YYYY-MM");
  console.log(`Monthly report marked as generated for ${lastReportGenerated}`);
};

const generateMonthlyReport = async () => {
  // Check if today is 1st of month and not already generated
  if (!shouldGenerateReport()) {
    console.log(
      "Monthly report: Not the 1st of the month or already generated this month. Skipping..."
    );
    return;
  }

  let filePath = null; // Track file path for cleanup

  try {
    console.log(
      "🗓️ First day of the month detected! Starting monthly report generation..."
    );

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const reportsDir = path.join(__dirname, "..", "reports");

    // Ensure directory exists
    if (!fs.existsSync(reportsDir))
      fs.mkdirSync(reportsDir, { recursive: true });

    // Create filename with month-year for easy identification
    const monthYear = moment().format("YYYY-MM");
    filePath = path.join(reportsDir, `MonthlyReport_${monthYear}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filePath));

    const start = moment().subtract(30, "days").toDate();
    const now = new Date();

    console.log("📊 Fetching monthly data...");

    // Fetch data
    const newUsers = await User.countDocuments({ createdAt: { $gte: start } });
    const newVendors = await Vendor.countDocuments({
      registrationStep: 5,
      createdAt: { $gte: start },
    });
    const incompleteVendors = await Vendor.countDocuments({
      registrationStep: { $lt: 5 },
      createdAt: { $gte: start },
    });

    const reviews = await Review.find({
      createdAt: { $gte: moment().startOf("month").toDate() },
    });
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(2)
        : "0.0";

    console.log(
      `📈 Data Summary: ${newUsers} users, ${newVendors} vendors, ${reviews.length} reviews`
    );

    // Helper functions for drawing
    const drawBox = (
      x,
      y,
      width,
      height,
      fillColor = null,
      strokeColor = "#e0e0e0"
    ) => {
      if (fillColor) {
        doc.rect(x, y, width, height).fillAndStroke(fillColor, strokeColor);
      } else {
        doc.rect(x, y, width, height).stroke(strokeColor);
      }
    };

    const drawRoundedBox = (
      x,
      y,
      width,
      height,
      radius = 5,
      fillColor = "#f8f9fa",
      strokeColor = "#dee2e6"
    ) => {
      doc
        .roundedRect(x, y, width, height, radius)
        .fillAndStroke(fillColor, strokeColor);
    };

    // Colors
    const colors = {
      primary: "#2c3e50",
      secondary: "#34495e",
      accent: "#3498db",
      success: "#27ae60",
      warning: "#f39c12",
      danger: "#e74c3c",
      light: "#ecf0f1",
      text: "#2d3436",
      muted: "#7f8c8d",
    };

    // Page setup
    const pageWidth = doc.page.width;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    // Compact Header - reduced height
    drawRoundedBox(margin, 30, contentWidth, 65, 8, colors.primary);

    // Logo section (if exists) - smaller logo
    const logoPath = path.join(__dirname, "..", "assets", "serverLogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, margin + 15, 40, { fit: [40, 40] });
    }

    // Header text - better alignment and smaller fonts
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("white")
      .text("EventsBridge", margin + 65, 45);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text("Monthly Performance Report", margin + 65, 67);

    // Date range in top right - better positioning
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        `${moment(start).format("MMM DD")} - ${moment(now).format(
          "MMM DD, YYYY"
        )}`,
        contentWidth - 140,
        55,
        { width: 140, align: "right" }
      );

    doc.y = 115; // Reduced space after header

    // Performance Overview Section - reduced spacing
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(colors.secondary)
      .text("Performance Overview", margin, doc.y);

    doc.y += 18; // Reduced spacing

    // Compact metrics cards - smaller dimensions
    const cardWidth = (contentWidth - 12) / 2;
    const cardHeight = 70; // Reduced height
    const cardSpacing = 12; // Reduced spacing
    const cardStartY = doc.y;

    // Row 1: New Users and Completed Vendors
    // Card 1: New Users - compact version
    const card1X = margin;
    const card1Y = cardStartY;
    drawRoundedBox(
      card1X,
      card1Y,
      cardWidth,
      cardHeight,
      6,
      "#e8f5e8",
      colors.success
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(28) // Reduced from 32
      .fillColor(colors.success)
      .text(newUsers.toString(), card1X + 15, card1Y + 8);

    doc
      .font("Helvetica")
      .fontSize(11) // Reduced from 13
      .fillColor(colors.text)
      .text("New Users", card1X + 15, card1Y + 40);

    doc
      .fontSize(9) // Reduced from 10
      .fillColor(colors.muted)
      .text("Last 30 days", card1X + 15, card1Y + 54);

    // Card 2: New Vendors (Top Right) - compact
    const card2X = margin + cardWidth + cardSpacing;
    const card2Y = cardStartY;
    drawRoundedBox(
      card2X,
      card2Y,
      cardWidth,
      cardHeight,
      6,
      "#e8f4fd",
      colors.accent
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor(colors.accent)
      .text(newVendors.toString(), card2X + 15, card2Y + 8);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(colors.text)
      .text("Completed Vendors", card2X + 15, card2Y + 40);

    doc
      .fontSize(9)
      .fillColor(colors.muted)
      .text("Fully registered", card2X + 15, card2Y + 54);

    // Row 2: Incomplete Vendors and Average Rating - compact
    const row2Y = cardStartY + cardHeight + cardSpacing;

    // Card 3: Incomplete Vendors (Bottom Left)
    const card3X = margin;
    const card3Y = row2Y;
    drawRoundedBox(
      card3X,
      card3Y,
      cardWidth,
      cardHeight,
      6,
      "#fef3e2",
      colors.warning
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor(colors.warning)
      .text(incompleteVendors.toString(), card3X + 15, card3Y + 8);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(colors.text)
      .text("Incomplete Vendors", card3X + 15, card3Y + 40);

    doc
      .fontSize(9)
      .fillColor(colors.muted)
      .text("Need attention", card3X + 15, card3Y + 54);

    // Card 4: Average Rating (Bottom Right)
    const card4X = margin + cardWidth + cardSpacing;
    const card4Y = row2Y;
    const ratingColor =
      parseFloat(averageRating) >= 4
        ? colors.success
        : parseFloat(averageRating) >= 3
        ? colors.warning
        : colors.danger;
    const ratingBg =
      parseFloat(averageRating) >= 4
        ? "#e8f5e8"
        : parseFloat(averageRating) >= 3
        ? "#fef3e2"
        : "#fde8e8";

    drawRoundedBox(
      card4X,
      card4Y,
      cardWidth,
      cardHeight,
      6,
      ratingBg,
      ratingColor
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor(ratingColor)
      .text(averageRating, card4X + 15, card4Y + 8);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(colors.text)
      .text("Average Rating", card4X + 15, card4Y + 40);

    doc
      .fontSize(9)
      .fillColor(colors.muted)
      .text(`${reviews.length} reviews`, card4X + 15, card4Y + 54);

    // Set Y position after all cards - reduced spacing
    doc.y = row2Y + cardHeight + 25;

    // Detailed Analytics Table - compact version
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(colors.secondary)
      .text("Detailed Analytics", margin, doc.y);

    doc.y += 18;

    // Compact table setup
    const tableStartY = doc.y;
    const rowHeight = 32; // Reduced from 40
    const tableWidth = contentWidth;

    // Table header - compact
    drawRoundedBox(
      margin,
      tableStartY,
      tableWidth,
      rowHeight,
      6,
      colors.secondary
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(11) // Reduced from 13
      .fillColor("white");

    const col1Width = tableWidth * 0.45;
    const col2Width = tableWidth * 0.28;
    const col3Width = tableWidth * 0.27;

    // Center-align header text vertically
    const headerTextY = tableStartY + (rowHeight - 11) / 2;
    doc.text("Metric", margin + 15, headerTextY); // Reduced padding
    doc.text("Current Period", margin + col1Width + 12, headerTextY);
    doc.text("Status", margin + col1Width + col2Width + 12, headerTextY);

    // Simplified table data for space efficiency
    const tableData = [
      {
        metric: "User Registrations",
        value: `${newUsers} users`,
        status: newUsers > 10 ? "Excellent" : newUsers > 5 ? "Good" : "Low",
      },
      {
        metric: "Vendor Completions",
        value: `${newVendors} vendors`,
        status: newVendors > 5 ? "Excellent" : newVendors > 2 ? "Good" : "Low",
      },
      {
        metric: "Pending Registrations",
        value: `${incompleteVendors} pending`,
        status: incompleteVendors < 5 ? "Good" : "High",
      },
      {
        metric: "Review Quality",
        value: `${averageRating}/5.0`,
        status:
          parseFloat(averageRating) >= 4
            ? "Excellent"
            : parseFloat(averageRating) >= 3
            ? "Good"
            : "Poor",
      },
    ];

    let currentRowY = tableStartY + rowHeight;

    tableData.forEach((row, index) => {
      const isEven = index % 2 === 0;
      const bgColor = isEven ? "#f8f9fa" : "#ffffff";

      drawBox(margin, currentRowY, tableWidth, rowHeight, bgColor, "#e9ecef");

      doc
        .font("Helvetica")
        .fontSize(10) // Reduced from 12
        .fillColor(colors.text);

      // Center-align text vertically in each row
      const textY = currentRowY + (rowHeight - 10) / 2;

      doc.text(row.metric, margin + 15, textY);
      doc.text(row.value, margin + col1Width + 12, textY);

      // Status with color coding
      const statusColor = row.status.includes("Excellent")
        ? colors.success
        : row.status.includes("Good") || row.status.includes("High")
        ? colors.accent
        : row.status.includes("Low")
        ? colors.warning
        : colors.danger;

      doc
        .fillColor(statusColor)
        .text(row.status, margin + col1Width + col2Width + 12, textY);

      currentRowY += rowHeight;
    });

    // Set Y position after table
    doc.y = currentRowY + 20;
    // Compact Key Insights box
    drawRoundedBox(margin, doc.y, contentWidth, 45, 6, "#f1f3f4", "#d0d7de"); // Reduced height

    doc
      .font("Helvetica-Bold")
      .fontSize(12) // Reduced from 14
      .fillColor(colors.secondary)
      .text("Key Insights", margin + 15, doc.y + 10); // Reduced padding

    doc
      .font("Helvetica")
      .fontSize(10) // Reduced from 11
      .fillColor(colors.text);

    const insights = `Growth: ${(((newUsers + newVendors) / 30) * 100).toFixed(
      1
    )}% | Completion: ${
      newVendors > 0
        ? ((newVendors / (newVendors + incompleteVendors)) * 100).toFixed(1)
        : 0
    }% | Engagement: ${
      reviews.length > 15 ? "High" : reviews.length > 8 ? "Medium" : "Low"
    }`;

    doc.text(insights, margin + 15, doc.y + 25, { width: contentWidth - 30 }); // Shortened text

    // Compact Footer with better positioning
    const footerY = doc.page.height - 80; // Reduced from 120
    doc.y = footerY;

    // Footer divider line
    drawBox(margin, footerY, contentWidth, 1, colors.light);

    // Compact footer layout
    doc
      .font("Helvetica")
      .fontSize(9) // Reduced from 10
      .fillColor(colors.muted);

    // Three-column footer layout for better space usage
    doc.text("Generated by EventsBridge", margin, footerY + 12);
    doc.text(`${moment().format("MMM DD, YYYY HH:mm")}`, margin, footerY + 25); // Shortened timestamp

    doc.text("Confidential - Internal Use", margin, footerY + 12, {
      width: contentWidth,
      align: "right",
    });

    doc.text("© 2025 EventsBridge", margin, footerY + 38, {
      width: contentWidth,
      align: "center",
    });

    console.log("📄 Generating PDF...");

    // Wait for PDF generation to complete
    await new Promise((resolve, reject) => {
      doc.on("end", resolve);
      doc.on("error", reject);
      doc.end();
    });

    // Wait a bit to ensure file is completely written
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify file exists before attempting to send
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file was not created successfully");
    }

    console.log(`✅ Monthly Report PDF generated: ${filePath}`);

    // Send to all admins
    const adminEmails = [];
    // "swainamrit8@gmail.com", "abhijitpati413@gmail.com"

    if (adminEmails.length === 0) {
      console.warn(
        "⚠️ No admin emails configured. Add admin emails to receive reports."
      );
      // Still mark as generated to prevent re-generation
      markReportGenerated();
      return;
    }

    console.log(`📧 Sending report to ${adminEmails.length} admin(s)...`);

    // Track successful email sends
    let emailsSent = 0;
    const emailErrors = [];

    for (const email of adminEmails) {
      try {
        await sendEmail({
          to: email,
          subject: `Monthly Performance Report - EventsBridge (${moment().format(
            "MMM YYYY"
          )})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50;">Monthly Performance Report</h2>
              <p>Hello Admin,</p>
              <p>Please find the attached monthly performance report for EventsBridge covering the period from <strong>${moment(
                start
              ).format("MMM DD")}</strong> to <strong>${moment(now).format(
            "MMM DD, YYYY"
          )}</strong>.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #34495e; margin-top: 0;">Quick Summary:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 5px 0;"><strong>New Users:</strong> ${newUsers}</li>
                  <li style="padding: 5px 0;"><strong>New Vendors:</strong> ${newVendors}</li>
                  <li style="padding: 5px 0;"><strong>Average Rating:</strong> ${averageRating}/5.0</li>
                  <li style="padding: 5px 0;"><strong>Total Reviews:</strong> ${
                    reviews.length
                  }</li>
                </ul>
              </div>
              
              <p>For detailed analytics and insights, please refer to the attached PDF report.</p>
              <p>Best regards,<br>EventsBridge System</p>
            </div>
          `,
          attachments: [
            {
              filename: `MonthlyReport_${moment().format("MMM_YYYY")}.pdf`,
              path: filePath,
            },
          ],
        });

        emailsSent++;
        console.log(`✅ Monthly Report successfully sent to: ${email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${email}:`, emailError);
        emailErrors.push({ email, error: emailError.message });
      }
    }

    // Auto-delete file only if at least one email was sent successfully
    if (emailsSent > 0) {
      try {
        // Additional safety check before deletion
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(
            `🗑️ Monthly Report PDF file automatically deleted: ${filePath}`
          );
        }

        // Mark report as generated for this month only after successful sending
        markReportGenerated();
      } catch (deleteError) {
        console.error("❌ Failed to delete report file:", deleteError);
        // Still mark as generated since emails were sent
        markReportGenerated();
      }
    } else {
      console.warn(
        "⚠️ No emails were sent successfully. Report file will NOT be deleted for retry purposes."
      );
      console.warn("📁 Report file location:", filePath);
    }

    // Log final results
    if (emailsSent === adminEmails.length) {
      console.log(
        `🎉 Monthly Report generated and sent to all ${emailsSent} admins successfully!`
      );
    } else if (emailsSent > 0) {
      console.log(
        `⚠️ Monthly Report sent to ${emailsSent}/${adminEmails.length} admins successfully.`
      );
      console.log("❌ Email errors:", emailErrors);
    } else {
      throw new Error(
        "Failed to send report to any admin. Check email configuration and admin email list."
      );
    }
  } catch (error) {
    console.error("❌ Failed to generate or send monthly report:", error);

    // Clean up file only if it exists and no emails were sent
    if (filePath && fs.existsSync(filePath)) {
      try {
        // Check if we at least attempted to send emails
        // If generation failed before email sending, we can safely delete
        if (
          error.message.includes("PDF file was not created") ||
          error.message.includes("Failed to generate") ||
          !error.message.includes("send")
        ) {
          fs.unlinkSync(filePath);
          console.log(
            "🗑️ Cleaned up incomplete report file due to generation failure."
          );
        } else {
          console.log("📁 Report file preserved for retry purposes:", filePath);
        }
      } catch (deleteError) {
        console.error("❌ Failed to clean up report file:", deleteError);
      }
    }

    // Re-throw the error for upstream handling
    throw error;
  }
};

// Auto-scheduler: Check every hour if it's the 1st of the month
const startAutoScheduler = () => {
  console.log(
    "🕐 Monthly Report Auto-Scheduler started - checking every hour for 1st of month"
  );

  // Check immediately on startup
  generateMonthlyReport().catch((err) => {
    console.error("Error in initial monthly report check:", err.message);
  });

  // Then check every hour
  setInterval(async () => {
    try {
      await generateMonthlyReport();
    } catch (error) {
      console.error("Error in scheduled monthly report check:", error.message);
    }
  }, 60 * 60 * 1000); // Every hour
};

// Start the auto-scheduler when this module is imported
startAutoScheduler();

export default generateMonthlyReport;
