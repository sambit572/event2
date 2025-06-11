import React, { useState } from "react";
import BookingData from "./BookingData.js";
import BookingPopup from "./BookingPopup.jsx";
import "./DashBoardBooking.css";

const DashBoardBooking = () => {
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = (booking) => {
    setClickedRow(clickedRow?.number === booking.number ? null : booking);
  };

  const handleClose = () => {
    setClickedRow(null);
  };

  return (
    <div className="booking-page">
      <main className="main-contents">
        <div className="tabs">
          <select className="sort-dropdown">
            <option>Sort by</option>
            <option value="status">Status</option>
            <option value="serviceName">Service Name</option>
            <option value="cancelled">Cancelled</option>
            <option value="last1">Last 3 months</option>
            <option value="last2">Last 6 months</option>
          </select>
        </div>

        <div className="booking-container">
          <div className="booking-header">
            <div className="number">No.</div>
            <div className="middle">
              <div>Service</div>
              <div>Booked By</div>
              <div>Price</div>
              <div>Booking Date</div>
              <div>Booking Day</div>
            </div>
            <div className="status">Status</div>
          </div>
          {BookingData.map((b) => (
            <div
              className={`booking-row ${b.number === 2 ? "highlight" : ""}`}
              key={b.number}
              onClick={() => handleRowClick(b)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <div className="number">{b.number}</div>

              <div className="middle">
                <div>
                  <strong>{b.service}</strong>
                </div>
                <div>{b.bookedBy}</div>
                <div>{b.price}</div>
                <div>{b.date}</div>
                <div>{b.days}</div>
              </div>

              <div
                className={`status ${b.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {b.status}
              </div>

              {/* Popup only for clicked row */}
              {clickedRow?.number === b.number && (
                <div className="row-popup-wrapper">
                  <BookingPopup
                    isOpen={true}
                    onClose={handleClose}
                    booking={clickedRow}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashBoardBooking;
