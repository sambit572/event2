import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { sendEmail } from "../../utilities/sendEmail.js";

const generateBookingPDF = (agenda) => {
  agenda.define("generate booking pdf", async (job) => {
    const {
      bookingId,
      userName,
      userEmail,
      vendorName,
      eventTitle,
      eventDate,
      totalAmount,
    } = job.attrs.data;

    console.log("📄 [PDF Job] Generating elegant booking PDF...");

    const folderPath = path.join("public", "booking-receipts");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `Booking-Receipt-${bookingId}.pdf`;
    const filePath = path.join(folderPath, fileName);
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // ✨ --- NEW: Helper Functions for a cleaner layout ---
    const generateHeader = (doc) => {
      const logoPath = path.join("public", "logo.png"); // Ensure your logo is here

      doc.rect(0, 0, doc.page.width, 90).fill("#0E4B85"); // Brand color header

      // Add logo if it exists
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 20, { width: 50 });
      }

      doc
        .fontSize(20)
        .fillColor("#FFFFFF")
        .text("Booking Receipt", 275, 35, { align: "right" });

      doc.moveDown();
    };

    const generateFooter = (doc) => {
      doc
        .fontSize(10)
        .fillColor("#555555")
        .text(
          "Thank you for choosing EventsBridge!",
          50,
          doc.page.height - 50,
          {
            align: "center",
            lineBreak: false,
          }
        );
    };

    const generateTableRow = (doc, y, label, value) => {
      doc
        .fontSize(11)
        .fillColor("#333333")
        .font("Helvetica-Bold")
        .text(label, 70, y)
        .font("Helvetica")
        .text(value, 250, y);
    };

    const generateHr = (doc, y) => {
      doc
        .strokeColor("#DDDDDD")
        .lineWidth(1)
        .moveTo(70, y)
        .lineTo(doc.page.width - 70, y)
        .stroke();
    };
    // ✨ --- End of new helper functions ---

    // 1. Generate Header
    generateHeader(doc);

    // Move down past the header
    doc.y = 120;

    // 2. Customer & Event Information
    doc
      .fontSize(14)
      .fillColor("#0E4B85")
      .font("Helvetica-Bold")
      .text("Booking Details", { align: "center" });

    doc.moveDown(1.5);

    // Table-like structure for details
    const tableTop = doc.y;
    generateTableRow(doc, tableTop, "Booking ID:", bookingId);
    generateHr(doc, tableTop + 20);

    generateTableRow(doc, tableTop + 30, "Customer Name:", userName);
    generateHr(doc, tableTop + 50);

    generateTableRow(doc, tableTop + 60, "Email:", userEmail);
    generateHr(doc, tableTop + 80);

    generateTableRow(doc, tableTop + 90, "Vendor:", vendorName);
    generateHr(doc, tableTop + 110);

    generateTableRow(doc, tableTop + 120, "Event:", eventTitle);
    generateHr(doc, tableTop + 140);

    // Format date for better readability
    const formattedDate = new Date(eventDate).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    generateTableRow(doc, tableTop + 150, "Date & Time:", formattedDate);

    doc.moveDown(10);

    // 3. Total Amount Paid section
    const totalY = doc.y;
    doc.rect(70, totalY, doc.page.width - 140, 40).fill("#F0F4F8"); // Light blue/gray background

    doc
      .fontSize(12)
      .fillColor("#0E4B85")
      .font("Helvetica-Bold")
      .text("Total Amount Paid", 90, totalY + 13);

    doc
      .fontSize(14)
      .fillColor("#0E4B85")
      .font("Helvetica-Bold")
      .text(`₹${totalAmount.toLocaleString()}`, 250, totalY + 12, {
        align: "right",
        width: doc.page.width - 340,
      });

    doc.moveDown(4);

    // 4. Note
    doc
      .fontSize(9)
      .fillColor("#888888")
      .text(
        "This is an auto-generated receipt. No signature is required.",
        50,
        doc.y,
        { align: "center" }
      );

    // 5. Footer
    generateFooter(doc);

    // Finalize the PDF and end the stream
    doc.end();

    // The rest of your email sending and file deletion logic remains the same
    writeStream.on("finish", async () => {
      console.log(`✅ PDF saved: ${filePath}`);

      // ✅ Send Email with Attachment
      const subject = "📎 Your Booking Confirmation - EventsBridge";
      const html = `<p>Dear ${userName},</p>
        <p>Attached is your booking confirmation for the event <strong>${eventTitle}</strong>.</p>
        <p>Thank you for using EventsBridge!</p>`;

      const result = await sendEmail({
        to: userEmail,
        subject,
        html,
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      });

      if (result.success) {
        console.log("📧 Email with PDF sent!");
      } else {
        console.error("❌ Failed to send PDF email:", result.error);
      }

      // ✅ Delete the PDF file after sending
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("❌ Failed to delete PDF:", err);
        } else {
          console.log(`🧹 Deleted temp PDF: ${filePath}`);
        }
      });
    });

    writeStream.on("error", (err) => {
      console.error("❌ PDF write error:", err);
    });
  });
};

export default generateBookingPDF;
