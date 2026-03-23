import Booking from "../../model/common/booking.model.js";
import VendorBooking from "../../model/vendor/vendorBookingHistory.model.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // Copy required fields to VendorBooking
    await VendorBooking.create({
      vendor: booking.vendor,
      booking: booking._id,
      user: booking.user,
      service: booking.service,
      location: booking.location,
      startDate: booking.startDate,
      endDate: booking.endDate,
      amount: booking.amount,
      paymentStatus: booking.paymentStatus,
      paymentMode: booking.paymentMode,
      paymentDate: booking.paymentDate,
      transactionId: booking.transactionId,
      bookingStatus: booking.bookingStatus,
      invoiceUrl: booking.invoiceUrl,
      isReviewed: booking.isReviewed,
    });

    res.status(201).json({
      success: true,
      message: "Booking created and added to vendor history.",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Update corresponding VendorBooking record
    await VendorBooking.findOneAndUpdate(
      { booking: booking._id },
      { bookingStatus }
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated.",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getVendorBookings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.query; // optional filter

    const filter = { vendor: vendorId };
    if (status) filter.bookingStatus = status;

    const bookings = await VendorBooking.find(filter)
      .populate("service", "serviceName serviceCategory")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

