import cron from "node-cron";
import {User} from "../../model/user/user.model.js";
import Vendor from "../../model/vendor/vendor.model.js";
import { sendEmail } from "../../utilities/sendEmail.js"; 

export default function monthlyFeedback() {
  //  For testing purpose
  // cron.schedule("* * * * *", async () => { 
  // Run on 1st of every month at 10:00 AM
    cron.schedule("0 10 1 * *", async () => {
    try {
      console.log("📬 Running Monthly Feedback Cron Job...");

      const users = await User.find({});
      const vendors = await Vendor.find({});

      const feedbackLink = `${process.env.FRONTEND_URL}/feedback`; //Feedback link 

      const subject = "We'd Love Your Feedback! 💬";    
      const html = `
        <h2>Hello 👋</h2>
        <p>We're always working to improve EventsBridge. Please take a moment to tell us how we're doing.</p>
        <a href="${feedbackLink}" style="padding: 10px 20px; background: #0d6efd; color: white; border-radius: 4px; text-decoration: none;">Give Feedback</a>
      `;

      // sendEmail usage
      for (let user of users) {
        await sendEmail({ to: user.email, subject, html });
      }

      for (let vendor of vendors) {
        await sendEmail({ to: vendor.email, subject, html });
      }

      console.log("✅ Monthly feedback emails sent successfully.");
    } catch (err) {
      console.error("❌ Error in monthly feedback cron job:", err);
    }
  });
}
