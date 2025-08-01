// agenda/agenda.js
import { Agenda } from "agenda";
import sendDummyReminder from "./jobs/sendDummyReminder.js"; // Corrected import path
import sendVendorReminder from "./jobs/sendVendorReminder.js";
import sendReviewRequest from "./jobs/sendReviewRequest.js";
import generateBookingPDF from "./jobs/generateBookingPDF.js";

const mongoConnectionString = process.env.MONGODB_URL;

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: "AgendaJobs",
  },
  processEvery: "10 seconds",
  defaultLockLifetime: 10000,
});

// 🔁 Register all jobs here
sendDummyReminder(agenda);
sendVendorReminder(agenda); 
sendReviewRequest(agenda);
generateBookingPDF(agenda);

// Optional but helpful: Logging lifecycle events
agenda.on("start", (job) => {
  console.log(`⏳ Job starting: ${job.attrs.name}`);
});

agenda.on("complete", (job) => {
  console.log(`✅ Job completed: ${job.attrs.name}`);
});

agenda.on("fail", (err, job) => {
  console.error(`❌ Job failed: ${job.attrs.name}`, err);
});

export default agenda;
