// Load and start all node-cron based jobs here
import sendFestivalOffers from "./alljobs/sendFestivalOffers.js";
import monthlyFeedback from "./alljobs/monthlyFeedback.js";

//  Initialize each cron job
sendFestivalOffers();
monthlyFeedback();

