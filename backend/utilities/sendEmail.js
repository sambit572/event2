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

    const wrappedHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    <h2 style="color: #0d6efd;">EventsBridge</h2>
    ${html}
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #888;">This email was sent automatically by EventsBridge. Please do not reply directly to this email.</p>
  </div>
`;

    const plainText = html.replace(/<[^>]+>/g, "");

    const mailOptions = {
      from: `"EventsBridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: wrappedHtml,
      text: plainText,
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
