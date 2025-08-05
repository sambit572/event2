import React from "react";
import "./BookingPopup.css";

const BookingPopup = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const price = parseInt(booking.price.replace(/[₹,]/g, "")) || 0;
  const advanceAmount = booking.advanceAmount || 0;
  const pendingAmount = price - advanceAmount;

  return (
    <div className="booking-popup-box inline-popup">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2 className="popup-titles">Booking Details</h2>
      <div className="popup-contents">
        <div className="popup-row"><strong>Booked By:</strong> {booking.bookedBy}</div>
        <div className="popup-row"><strong>Event Location:</strong> {booking.location}</div>
        <div className="popup-row"><strong>Event Date:</strong> {booking.date}</div>
        <div className="popup-row"><strong>Total Price:</strong> ₹{price.toLocaleString()}</div>
        <div className="popup-row"><strong>Advance Payment:</strong> ₹{advanceAmount.toLocaleString()}</div>
        <div className="popup-row"><strong>Pending Amount:</strong> ₹{pendingAmount.toLocaleString()}</div>
        {typeof advanceAmount === "number" && (
          <div className="popup-row">
            <strong>Advance Status:</strong>{" "}
            <span className={advanceAmount > 0 ? "status-paid" : "status-unpaid"}>
              {advanceAmount > 0 ? "Paid" : "Unpaid"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPopup;
