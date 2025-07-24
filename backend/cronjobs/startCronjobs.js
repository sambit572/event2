// Load and start all node-cron based jobs 
import sendFestivalOffers from "./alljobs/sendFestivalOffers.js";
import monthlyFeedback from "./alljobs/monthlyFeedback.js";
import monthlyReport from "./alljobs/monthlyReportForAdmin.js";

//  Initialize each cron job
sendFestivalOffers();
monthlyFeedback();
monthlyReport();
