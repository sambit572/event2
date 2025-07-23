import { Router } from "express";

import {
  scheduleDummyReminder,
  schedulePDFGeneration,
  scheduleReviewRequest,
  scheduleVendorReminder,
} from "../../controller/common/agendaTest.controller.js";

const test_router = Router();

// POST /api/test/reminder
test_router.post("/reminder", scheduleDummyReminder);

test_router.post("/vendor-reminder", scheduleVendorReminder);

test_router.post("/review-request", scheduleReviewRequest);

test_router.post("/booking-pdf", schedulePDFGeneration);

export default test_router;
