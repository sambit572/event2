import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import ToggleTabs from "./ToggleTabs.jsx";
import "./DashboardMain.css";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const VENDOR_NAME = "Horse-Carriage Odisha"; // 🔁 Use dynamic vendor later

function DashBoardMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [popupData, setPopupData] = useState(null);
  const [callStatus, setCallStatus] = useState("Inactive");
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    // 🔌 Notify backend vendor is online
    socket.emit("vendor-online", VENDOR_NAME);

    // 📦 Receive pending negotiations
    socket.on("pending-negotiations", (requests) => {
      if (requests && requests.length > 0) {
        console.log("⏳ Received pending negotiations:", requests);
        setPopupData(requests[0]); // Show first
      } else {
        console.log("✅ No pending requests");
        setPopupData(null);
      }
    });

    // 🔄 Real-time update for new request
    socket.on("negotiation_to_vendor", (data) => {
      if (data.vendorName === VENDOR_NAME) {
        console.log("📬 Real-time negotiation:", data);
        setPopupData(data);
      }
    });

    return () => {
      socket.off("pending-negotiations");
      socket.off("negotiation_to_vendor");
    };
  }, []);

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

  const handleResponse = (action) => {
    if (!popupData || !popupData._id) return;

    socket.emit("vendor_response", {
      bookingId: popupData._id, // ✅ MongoDB ID
      action: action, // ✅ "accept" or "decline"
      vendorName: popupData.vendorName, // ✅ Must match backend
    });

    setPopupData(null); // Hide current popup, next will come automatically
  };

  useEffect(() => {
    if (popupData) {
      const timer = setTimeout(() => setPopupData(null), 3000000); // 30s auto-hide
      return () => clearTimeout(timer);
    }
  }, [popupData]);

  return (
    <div className="dashboard-container-box">
      {/* Hamburger / Cross button for mobile */}
      <button
        className={`dashboard-hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <DashBoardSideBar isOpen={isSidebarOpen} />

      <div className="main-contain">
        <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "services" ? (
          <DashboardServices />
        ) : (
          <DashBoardBooking />
        )}

        {/* 🔽 Popup Block Added Below */}
        {popupData && (
          <div className="popup-overlayfinal">
            <div className="popup-container">
              <h3 className="popup-title">New Booking Request</h3>
              <div className="popup-content">
                <p>
                  <strong>Service:</strong> {popupData.vendorName}
                </p>
                <p>
                  <strong>Venue:</strong> {popupData.venueLocation}
                </p>
                <p>
                  <strong>Type:</strong> {popupData.type}
                </p>
                <p>
                  <strong>Original Price:</strong> ₹{popupData.originalPrice}
                </p>
                <p>
                  <strong>Proposed Price:</strong> ₹{popupData.proposedPrice}
                </p>

                {popupData.proposedPrice &&
                  Number(popupData.proposedPrice) <
                    Number(popupData.originalPrice) && (
                    <p>
                      <strong>Enter Final Price:</strong>
                      <input
                        type="text"
                        placeholder="Enter Your Final Price"
                        className="VenueInput"
                      />
                    </p>
                  )}

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(popupData.date).toLocaleDateString()}
                </p>
              </div>

              <div className="popup-actions">
                <button
                  className="btn-accept"
                  onClick={() => handleResponse("accept")}
                >
                  Accept
                </button>
                <button
                  className="btn-decline"
                  onClick={() => handleResponse("decline")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoardMain;
