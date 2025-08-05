import moment from "moment";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../../utilities/sendEmail.js";
import { User } from "../../model/user/user.model.js";
import Vendor from "../../model/vendor/vendor.model.js";
import Review from "../../model/common/review.model.js";

// File setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.join(__dirname, "..", "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

let lastReportGenerated = null; // Track last successful report
let isGenerating = false; // Prevent overlap

const shouldGenerateReport = () => {
  const today = moment().date();
  const currentMonth = moment().format("YYYY-MM");
  if (today !== 1) return false;
  if (lastReportGenerated === currentMonth) {
    console.log(`✅ Report for ${currentMonth} already sent. Skipping...`);
    return false;
  }
  return true;
};

const markReportGenerated = () => {
  lastReportGenerated = moment().format("YYYY-MM");
  console.log(`✅ Report marked generated for ${lastReportGenerated}`);
};

const generatePDF = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    stream.on("finish", resolve);
    stream.on("error", reject);

    doc.pipe(stream);

    // Title
    doc.fontSize(20).text("EventsBridge Monthly Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Generated: ${moment().format("MMM DD, YYYY HH:mm")}`);
    doc.moveDown(2);

    // Summary
    doc.fontSize(14).text("📊 Key Stats:", { underline: true });
    doc
      .fontSize(12)
      .list([
        `New Users: ${data.newUsers}`,
        `Completed Vendors: ${data.newVendors}`,
        `Incomplete Vendors: ${data.incompleteVendors}`,
        `Average Rating: ${data.averageRating}`,
        `Total Reviews: ${data.reviews.length}`,
      ]);

    doc.end();
  });
};

const generateMonthlyReport = async () => {
  if (isGenerating)
    return console.log("⏳ Report already generating. Skipping...");
  if (!shouldGenerateReport()) return;

  isGenerating = true;
  let filePath = null;

  try {
    console.log("🗓️ Starting monthly report generation...");

    // Fetch data
    const start = moment().subtract(30, "days").toDate();
    const now = new Date();

    const [newUsers, newVendors, incompleteVendors, reviews] =
      await Promise.all([
        User.countDocuments({ createdAt: { $gte: start } }),
        Vendor.countDocuments({
          registrationStep: 5,
          createdAt: { $gte: start },
        }),
        Vendor.countDocuments({
          registrationStep: { $lt: 5 },
          createdAt: { $gte: start },
        }),
        Review.find({
          createdAt: { $gte: moment().startOf("month").toDate() },
        }),
      ]);

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(2)
        : "0.0";

    console.log(
      `📊 Data: Users=${newUsers}, Vendors=${newVendors}, Reviews=${reviews.length}`
    );

    // PDF Generation
    const monthYear = moment().format("YYYY-MM");
    filePath = path.join(reportsDir, `MonthlyReport_${monthYear}.pdf`);

    console.log("📄 Generating PDF...");
    await Promise.race([
      generatePDF(filePath, {
        newUsers,
        newVendors,
        incompleteVendors,
        averageRating,
        reviews,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PDF generation timeout")), 10000)
      ),
    ]);
    console.log(`✅ PDF ready: ${filePath}`);

    // Send email to admins
    const adminEmails = [
      // "rudransh7381@gmail.com"
    ];

    if (adminEmails.length === 0) {
      console.warn("⚠️ No admin emails configured. Deleting PDF...");
      fs.unlinkSync(filePath);
      return markReportGenerated();
    }

    console.log(`📧 Sending report to ${adminEmails.length} admin(s)...`);
    let emailsSent = 0;

    for (const email of adminEmails) {
      try {
        await Promise.race([
          sendEmail({
            to: email,
            subject: `Monthly Report (${moment().format("MMM YYYY")})`,
            html: `<p>Attached is the monthly performance report.</p>`,
            attachments: [
              { filename: path.basename(filePath), path: filePath },
            ],
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Email timeout")), 10000)
          ),
        ]);
        console.log(`✅ Sent report to ${email}`);
        emailsSent++;
      } catch (err) {
        console.error(`❌ Failed to send to ${email}: ${err.message}`);
      }
    }

    // Cleanup
    if (emailsSent > 0) {
      fs.unlinkSync(filePath);
      console.log("🗑️ PDF deleted after successful email send.");
      markReportGenerated();
    } else {
      console.warn("⚠️ No emails sent successfully. PDF retained for retry.");
    }
  } catch (err) {
    console.error("❌ Report generation error:", err.message);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } finally {
    isGenerating = false;
  }
};

// Auto-Scheduler
const startAutoScheduler = () => {
  console.log("🕐 Monthly report scheduler active (hourly checks)...");
  generateMonthlyReport().catch((err) =>
    console.error("Initial check failed:", err.message)
  );
  setInterval(generateMonthlyReport, 60 * 60 * 1000);
};

startAutoScheduler();

export default generateMonthlyReport;
