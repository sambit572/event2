import express from "express";
import { getBookedDates } from "../../controller/common/calendar.controller.js";

const router = express.Router();

// GET route to fetch all unavailable dates for a specific vendor

router.get("/booked-dates/:vendorId", getBookedDates);

export default router;
