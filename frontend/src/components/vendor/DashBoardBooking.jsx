import React from "react";
import BookingData from "./BookingData.js";
import "./DashBoardBooking.css";
const DashBoardBooking = () => {
  return (
    <div className="booking-page">
      <main className="main-content">
        <div className="tabs">
          <select className="sort-dropdown">
            <option>Sort by</option>
            <option value="status">Status</option>
            <option value="serviceName">Service Name</option>
          </select>
        </div>
        <div className="booking-container">
          <div className="booking-header">
            <div>Number</div>
            <div>Service</div>
            <div>Booked By</div>
            <div>Price</div>
            <div>Booking Date</div>
            <div>Booking Day</div>
            <div>Status</div>
          </div>

          {BookingData.map((b, index) => (
            <div
              className={`booking-row ${b.number === 2 ? "highlight" : ""}`}
              key={b.number}
            >
              <div>{b.number}</div>
              <div>
                <strong>{b.service}</strong>
              </div>
              <div>{b.bookedBy}</div>
              <div>{b.price}</div>
              <div>{b.date}</div>
              <div>{b.days}</div>
              <div
                className={`status ${b.status.toLowerCase().replace(" ", "-")}`}
              >
                {b.status}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashBoardBooking;
