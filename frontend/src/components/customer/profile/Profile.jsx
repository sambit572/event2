import React, { useState, useEffect } from "react";
import UserSideBar from "./UserSideBar.jsx";
import "./Profile.css";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="profile-container">
      {/* Hamburger / Cross button for mobile */}
      <button
        className={`hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <UserSideBar isOpen={isSidebarOpen} />

      <div className="main-content">
        
          <h2 className="booking-title">My Bookings</h2>
          <div className="sort-btn">sort by <span>▼</span></div>
      

        <div className="booking-card">
          <div className="booking-content">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600"
              alt="DJ Service"
              className="booking-image"
            />

            <div className="booking-details">
              <div className="booking-left">
                <h3>DJ Weeding Service</h3>
                <p>Patia, Bhubaneswar, Odisha, India</p>
                <p>Booking Date :- 10/06/2025</p>
                <p>Event Date :- 10/06/2025</p>
                <a href="#payment-details">Payment Details</a>
              </div>

              <div className="booking-right">
                <div>Actual Amount :- <strong>₹50,000</strong></div>
                <div className="strike">Paid Amount :-  <strong>₹3,000</strong></div>
                <hr />
                <div>Remaining Amount :- <strong>₹47,000</strong></div>
                <p className="status">Pending<span className="dots">...</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
