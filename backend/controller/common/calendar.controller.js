import Booking from "../../model/common/booking.model.js";
/* import { Negotiation } from '../../model/common/Negotiation.model.js'; */
import mongoose from "mongoose";

export const getBookedDates = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Month and year query parameters are required." });
    }
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid Vendor ID." });
    }

    const startDateOfMonth = new Date(
      Date.UTC(Number(year), Number(month) - 1, 1)
    );
    const endDateOfMonth = new Date(Date.UTC(Number(year), Number(month), 1));

    // Find confirmed/pending bookings that overlap with the month
    const bookings = await Booking.find({
      vendor: vendorId,
      bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
      startDate: { $lt: endDateOfMonth },
      endDate: { $gte: startDateOfMonth },
    }).select("startDate endDate");

    // Find pending negotiations that overlap with the month
    /*     const negotiations = await Negotiation.find({
            vendorId: vendorId,
            status: "pending",
            'date.startDate': { $lt: endDateOfMonth },
            'date.endDate': { $gte: startDateOfMonth }
        }).select('date.startDate date.endDate');
 */
    const unavailableDates = new Set();
    // Process confirmed bookings
    bookings.forEach((booking) => {
      let currentDate = new Date(booking.startDate);
      const lastDate = new Date(booking.endDate);
      while (currentDate <= lastDate) {
        unavailableDates.add(currentDate.toISOString().slice(0, 10));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
    });

    // Process pending negotiations
    /*  negotiations.forEach(neg => {
            let currentDate = new Date(neg.date.startDate);
            const lastDate = new Date(neg.date.endDate);
            while (currentDate <= lastDate) {
                unavailableDates.add(currentDate.toISOString().slice(0, 10));
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }
        }); */

    res.status(200).json({ bookedDates: [...unavailableDates] });
  } catch (err) {
    console.error("Error fetching booked dates:", err);
    res
      .status(500)
      .json({ message: "Error fetching booked dates", error: err.message });
  }
};
