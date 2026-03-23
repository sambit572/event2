import Booking from "../models/Booking.model.js";
// You'll need to install date-fns: npm install date-fns
import { eachDayOfInterval } from "date-fns";

/**
 * @desc    Get all booked dates for a vendor for a given month
 * @route   GET /api/bookings/booked-dates/:vendorId
 */
export const getBookedDatesForVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Month and year query parameters are required." });
    }

    // Define the start and end of the month in UTC for accurate querying
    const startOfMonth = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const endOfMonth = new Date(Date.UTC(Number(year), Number(month), 0));

    // Find all confirmed or pending bookings that overlap with the current month
    const bookings = await Booking.find({
      vendor: vendorId,
      bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
      startDateNormalized: { $lte: endOfMonth },
      endDateNormalized: { $gte: startOfMonth },
    }).select("startDateNormalized endDateNormalized");

    // Use a Set to avoid duplicate dates
    const disabledDates = new Set();

    bookings.forEach((booking) => {
      // Create an interval for each booking
      const interval = {
        start: booking.startDateNormalized,
        end: booking.endDateNormalized,
      };

      // Get every single day within the booking's date range
      const daysInBooking = eachDayOfInterval(interval);

      daysInBooking.forEach((day) => {
        // Add each date to the set in YYYY-MM-DD format
        disabledDates.add(day.toISOString().slice(0, 10));
      });
    });

    res.status(200).json({ bookedDates: Array.from(disabledDates) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching booked dates", error: err.message });
  }
};

/**
 * @desc    Create a new booking, checking for overlaps
 * @route   POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const { vendor, service, startDate, endDate, ...otherFields } = req.body;
    // const userId = req.user._id; // Get user ID from your authentication middleware

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "A start and end date are required." });
    }

    // Critical logic to prevent double bookings
    const overlappingBooking = await Booking.findOne({
      vendor,
      bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message:
          "This date range is unavailable as it conflicts with an existing booking.",
      });
    }

    const booking = await Booking.create({
      vendor,
      service,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      // user: userId,
      ...otherFields,
    });

    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res
      .status(500)
      .json({ message: "Error creating your booking", error: err.message });
  }
};
