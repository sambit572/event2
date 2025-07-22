import { Router } from "express";

import { scheduleDummyReminder, scheduleVendorReminder } from "../../controller/common/agendaTest.controller.js";

const test_router = Router();

// POST /api/test/reminder
test_router.post("/reminder", scheduleDummyReminder);

test_router.post("/vendor-reminder", scheduleVendorReminder);

export default test_router;