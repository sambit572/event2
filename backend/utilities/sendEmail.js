import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {

    // Input validation
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, and html are required');
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
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    
    // Return success status
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending email:", err);
    
    // Return error status instead of just logging
    return { success: false, error: err.message };
  }
};