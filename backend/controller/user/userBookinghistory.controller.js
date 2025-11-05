import Booking from "../../model/common/booking.model.js";
import UserBookingHistory from "../../model/user/userBookinghistory.model.js";

/**
 * Create booking for user and add to UserBookingHistory
 */
export const createUserBooking = async (req, res) => {
  try {
    // Step 1: Create a new booking
    const booking = await Booking.create(req.body);

    // Step 2: Copy relevant booking details to user booking history
    await UserBookingHistory.create({
      userId: booking.user,
      booking: booking._id,
      vendorId: booking.vendor,
      serviceId: booking.service,
      location: booking.location,
      startDate: booking.startDate,
      endDate: booking.endDate,
      amount: booking.amount,
      paymentStatus: booking.paymentStatus,
      paymentMode: booking.paymentMode,
      paymentDate: booking.paymentDate,
      transactionId: booking.transactionId,
      bookingStatus: booking.bookingStatus,
      notes: booking.notes,
      isReviewed: booking.isReviewed,
    });

    // Step 3: Return success response
    res.status(201).json({
      success: true,
      message: "Booking created and added to user history.",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update booking status (and sync with user history)
 */
export const updateUserBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;

    // Step 1: Update main Booking model
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Step 2: Update user booking history
    await UserBookingHistory.findOneAndUpdate(
      { booking: booking._id },
      { bookingStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all bookings for a user (with optional status filter)
 */
export const getUserBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status) filter.bookingStatus = status;

    const bookings = await UserBookingHistory.find(filter)
      .populate("serviceId", "serviceName serviceCategory serviceImage")
      .populate("vendorId", "email phoneNumber fullName")

      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
