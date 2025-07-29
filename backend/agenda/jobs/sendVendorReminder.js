import { sendEmail } from "../../utilities/sendEmail.js";

const sendVendorReminder = (agenda) => {
  agenda.define("send vendor reminder", async (job) => {
    const { vendorEmail, vendorName, eventTitle, eventDate } = job.attrs.data;

    console.log("🔔 [Reminder Job] Running...");

    const subject = `⏰ Reminder: Your event "${eventTitle}" is coming up`;
    const html = `
      <h3>Hi ${vendorName},</h3>
      <p>This is a friendly reminder that you have an upcoming event scheduled.</p>
      <ul>
        <li><strong>Event:</strong> ${eventTitle}</li>
        <li><strong>Date & Time:</strong> ${new Date(
          eventDate
        ).toLocaleString()}</li>
      </ul>
      <p>Make sure you're ready and check your vendor dashboard for details.</p>
      <br/>
      <p>— Team EventsBridge</p>
    `;

    const response = await sendEmail({ to: vendorEmail, subject, html });

    if (!response.success) {
      throw new Error(`Email failed: ${response.error}`);
    }

    console.log("✅ Vendor reminder email sent successfully");
  });
};

export default sendVendorReminder;
