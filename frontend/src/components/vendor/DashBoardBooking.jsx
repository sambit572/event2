import React, { useState } from "react";
import BookingData from "./BookingData.js";
import BookingPopup from "./BookingPopup.jsx";
import "./DashBoardBooking.css";

const DashBoardBooking = () => {
  const [clickedRow, setClickedRow] = useState(null);
  // const [sortDropdownOpen,setSortDropdownOpen]=useState(false)

  const handleRowClick = (booking) => {
    setClickedRow(clickedRow?.number === booking.number ? null : booking);
  };

  const handleClose = () => {
    setClickedRow(null);
  };

  return (
    <div className="dashboard-booking-page">
      <main className="dashboard-main-content">
        {/* Sort Dropdown */}
        <div className="dashboard-controls">
          <select className="dashboard-sort-dropdown">
            <option>Sort by</option>
            <option value="status">Status</option>
            <option value="serviceName">Service Name</option>
            <option value="cancelled">Cancelled</option>
            <option value="last3">Last 3 months</option>
            <option value="last6">Last 6 months</option>
          </select>
        </div>

        {/* Booking Table */}
        <div className="dashboard-booking-scroll">
          <div className="dashboard-booking-container">
            {/* Header Row (fixed at top) */}
            <div className="dashboard-booking-header">
              <div className="booking-col-number">No.</div>
              <div className="booking-col-middle">
                <div>Service</div>
                <div>Booked By</div>
                <div>Price</div>
                <div>Booking Date</div>
                <div>Booking Day</div>
              </div>
              <div className="booking-col-status">Status</div>
            </div>

            {/* ✅ Scrollable Rows Wrapper */}
            <div className="booking-rows-scroll">
              {BookingData.map((booking) => (
                <div
                  className={`dashboard-booking-row ${
                    clickedRow?.number === booking.number ? "expanded" : ""
                  }`}
                  key={booking.number}
                  onClick={() => handleRowClick(booking)}
                >
                  <div className="booking-col-number">{booking.number}</div>
                  <div className="booking-col-middle">
                    <div>
                      <strong>{booking.service}</strong>
                    </div>
                    <div>{booking.bookedBy}</div>
                    <div>{booking.price}</div>
                    <div>{booking.date}</div>
                    <div>{booking.days}</div>
                  </div>
                  <div
                    className={`booking-col-status status-${booking.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Popup */}
            {clickedRow && (
              <div className="popup-overlay">
                <BookingPopup
                  isOpen={true}
                  onClose={handleClose}
                  booking={clickedRow}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashBoardBooking;
