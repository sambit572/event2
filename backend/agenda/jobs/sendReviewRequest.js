import { sendEmail } from "../../utilities/sendEmail.js";

const sendReviewRequest = (agenda) => {
  agenda.define("send review request", async (job) => {
    const { userEmail, userName, vendorName, eventTitle, eventDate } =
      job.attrs.data;

    console.log("📨 [Review Job] Running (Cool & Casual Version)...");
    console.log(`📧 To: ${userEmail}`);

    // ✨ New Subject
    const subject = `So... how was ${vendorName}? 👀 Spill the tea!`;

    // ✨ New HTML Body
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #111;">Hey ${userName}!</h2>
        <p>Hope you had an awesome time at your "<strong>${eventTitle}</strong>" event!</p>
        <p>We're dying to know how it went with <strong>${vendorName}</strong>. Was it epic? Legendary? Did they bring the good vibes? Your feedback helps everyone.</p>
        <p>Hit the button below and let us know what's up. It only takes a minute!</p>
        <a href="https://eventsbridge.in/reviews" 
           style="background-color: #7D3CF8; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 10px;">
           🎤 Drop a Review
        </a>
        <br/><br/>
        <p>High fives,<br/>The EventsBridge Crew 🤘</p>
      </div>
    `;

    const response = await sendEmail({ to: userEmail, subject, html });

    if (!response.success) {
      throw new Error(`Email failed: ${response.error}`);
    }

    console.log("✅ Review request email sent");
  });
};

export default sendReviewRequest;
