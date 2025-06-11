import React, { useState } from "react";
import BookingData from "./BookingData.js";
import BookingPopup from "./BookingPopup.jsx";
import "./DashBoardBooking.css";

const DashBoardBooking = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = (rowNumber) => {
    setClickedRow(clickedRow === rowNumber ? null : rowNumber);
  };

  const handleMouseEnter = (rowNumber) => {
    setHoveredRow(rowNumber);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const isPopupVisible = (rowNumber) => {
    return clickedRow === rowNumber || hoveredRow === rowNumber;
  };

  const closePopup = () => {
    setClickedRow(null);
  };

  return (
    <div className="booking-page">
      <main className="main-content">
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
              key={b.number}
              className="booking-row"
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => handleRowClick(b.number)}
              onMouseEnter={() => handleMouseEnter(b.number)}
              onMouseLeave={handleMouseLeave}
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

              {/* Popup */}
              {isPopupVisible(b.number) && (
                <div className="row-popup-wrapper">
                  <BookingPopup
                    isOpen={true}
                    onClose={closePopup}
                    booking={b}
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
