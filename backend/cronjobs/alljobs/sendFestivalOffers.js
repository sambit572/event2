import cron from "node-cron";
import fetchFestivalDates from "../../utilities/fetchFestivalDates.js";
import { sendEmail } from "../../utilities/sendEmail.js";
import Vendor from "../../model/vendor/vendor.model.js";

const sendFestivalOffers = () => {
  // Schedule to run every minute for testing purposes
  //cron.schedule("* * * * *", async () => {
       cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Cron job running: Checking festivals for today...");

    const today = new Date().toISOString().split("T")[0];

    const festivals = await fetchFestivalDates();

    const todayFestivals = festivals.filter((f) => f.date === today);

    if (todayFestivals.length === 0) {
      console.log("📭 No festivals today. No emails sent.");
      return;
    }

    // ✅ Fetch vendor emails BEFORE the loop
    const vendors = await Vendor.find({}, "email");

    for (const fest of todayFestivals) {
      const festName = fest.name || "Festival";
      const festDescription =
        fest.description || "Celebrate with special offers!";
      const festDate = fest.date || today;

      for (const vendor of vendors) {
        if (!vendor.email) {
          console.warn("⚠️ Skipping vendor with missing email.");
          continue;
        }

        try {
          const response = await sendEmail({
            to: vendor.email,
            subject: `🎉 Celebrate ${festName} with Special Offers!`,
            html: `
            <div style="font-family: Arial; color: #333;">
              <h2>🎊 ${festName} is Here!</h2>
              <p>${festDescription}</p>
              <p><strong>Boost your vendor visibility today by offering festival promotions on EventsBridge!</strong></p>
              <p style="margin-top: 20px;">📅 Date: ${festDate}</p>
            </div>
          `,
          });

          //  Log the response so it's not unused
          console.log("📧 Email sent:", response);
        } catch (error) {
          console.error(`❌ Failed to send email to ${vendor.email}:`, error);
        }
      }
    }
  });
};

export default sendFestivalOffers;