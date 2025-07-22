import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error(
        "Missing required email parameters: to, subject, and html are required"
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EventsBridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      ...(attachments && { attachments }), // ✅ safely include if exists
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return { success: false, error: err.message };
  }
};
