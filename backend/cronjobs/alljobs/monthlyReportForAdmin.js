import moment from "moment";
import PDFDocument from "pdfkit";
import fs from "fs";
import { sendEmail } from "../../utilities/sendEmail.js";
import { User } from "../../model/user/user.model.js";
import Vendor from "../../model/vendor/vendor.model.js";
import Review from "../../model/common/ReviewModel.js";
import path from "path";
import { fileURLToPath } from "url";

const generateMonthlyReport = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const reportsDir = path.join(__dirname, "..", "reports");

    // Ensure directory exists
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    const filePath = path.join(reportsDir, "MonthlyReport.pdf");
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    const start = moment().subtract(30, "days").toDate();
    const now = new Date();

    // 1. New Users
    const newUsers = await User.countDocuments({ createdAt: { $gte: start } });

    // 2. New Vendors
    const newVendors = await Vendor.countDocuments({
      registrationStep: 5,
      createdAt: { $gte: start },
    });
    const incompleteVendors = await Vendor.countDocuments({
      registrationStep: { $lt: 5 },
      createdAt: { $gte: start },
    });

    // 3. Reviews
    const reviews = await Review.find({
      createdAt: { $gte: moment().startOf("month").toDate() },
    });
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(2)
        : "N/A";

    // 👇 Logo
    const logoPath = path.join(__dirname, "..", "assets", "serverLogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { fit: [120, 120], align: "center" });
      doc.moveDown(1.5);
    }

    // 🔥 PDF Content
    doc.fontSize(20).text(" Monthly Admin Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(
        `Period: ${moment(start).format("DD MMM")} - ${moment(now).format(
          "DD MMM YYYY"
        )}`
      );
    doc.moveDown();

    doc.text(` New Users: ${newUsers}`);
    doc.text(` New Vendors: ${newVendors}`);
    doc.text(` Incomplete Vendor Registrations: ${incompleteVendors}`);
    doc.text(
      ` Reviews Submitted: ${reviews.length} (Avg Rating: ${averageRating})`
    );

    doc.end();

    // 📧 Send to all admins
    const adminEmails = [
      "admin1@gmail.com" /* Replace with actual admin email , if more than one add them here one by one*/

    ];

    for (const email of adminEmails) {
      await sendEmail({
        to: email,
        subject: "📄 Monthly Performance Report – EventsBridge",
        html: `<p>Hello Admin,<br/><br/>Please find the attached monthly performance report for EventsBridge.</p>`,
        attachments: [{ filename: "MonthlyReport.pdf", path: filePath }],
      });
    }

    console.log("✅ Monthly Report generated and sent to all admins.");
  } catch (error) {
    console.error("❌ Failed to generate or send report:", error);
  }
};

export default generateMonthlyReport;
