import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import ToggleTabs from "./ToggleTabs.jsx";
import "./DashboardMain.css";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UseVendorProfile } from "./UseVendorProfile.jsx";

const VENDOR_NAME = "Horse-Carriage Odisha";
const socket = io(import.meta.env.VITE_BACKEND_URL);

function DashBoardMain() {
  const navigate = useNavigate();
  const { form, updateBank, updateVendor, updateField } = UseVendorProfile();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [popupData, setPopupData] = useState(null);

  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");

  // 🔁 Called when "Add Service" is clicked
  const handleOpenAddService = () => {
    navigate("/vendor/services/addServices");
  };

  // 🔐 Handle password confirmation
  const handleConfirmPassword = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/verify-password`,
        { password },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsVerified(true); // 👉 Triggers update in DashBoardSideBar
        setConfirmPasswordModal(false);
        console.log("✅ Password correct.");
      } else {
        alert("❌ Incorrect password.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      alert(`❌ ${msg}`);
    }
  };

  // 📶 Socket setup
  useEffect(() => {
    socket.emit("vendor-online", VENDOR_NAME);

    socket.on("pending-negotiations", (requests) => {
      if (requests?.length) {
        setPopupData(requests[0]);
      } else {
        setPopupData(null);
      }
    });

    socket.on("negotiation_to_vendor", (data) => {
      if (data.vendorName === VENDOR_NAME) {
        setPopupData(data);
      }
    });

    return () => {
      socket.off("pending-negotiations");
      socket.off("negotiation_to_vendor");
    };
  }, []);

  // 💻 Sidebar responsive toggle
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResponse = (action) => {
    if (!popupData?._id) return;

    socket.emit("vendor_response", {
      bookingId: popupData._id,
      action,
      vendorName: popupData.vendorName,
    });

    setPopupData(null);
  };

  // ⏳ Auto-dismiss booking popup
  useEffect(() => {
    if (popupData) {
      const timer = setTimeout(() => setPopupData(null), 30000);
      return () => clearTimeout(timer);
    }
  }, [popupData]);

  return (
    <div className="dashboard-container-box">
      <button
        className={`dashboard-hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <DashBoardSideBar
        isOpen={isSidebarOpen}
        isVerified={isVerified}
        setConfirmPasswordModal={setConfirmPasswordModal}
        onSaveComplete={() => setIsVerified(false)} // ✅ Reset flag after update
      />

      <div className="main-contain">
        <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <button
          className="flex items-center justify-center gap-2 text-center relative xl:right-[-950px] xl:top-[-70px] rounded-full bg-[#001f3f] font-semibold px-6 py-3 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={handleOpenAddService}
        >
          <span className="text-xl font-bold">+</span>
          <span className="text-base tracking-wide">Add Services</span>
        </button>

        <div className="relative max-h-[70vh] overflow-y-auto">
          {activeTab === "services" ? (
            <DashboardServices />
          ) : (
            <DashBoardBooking />
          )}
        </div>

        {/* Password Confirmation Modal */}
        {confirmPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Enter your password to confirm
              </h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleConfirmPassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmPasswordModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Negotiation Popup */}
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
                {popupData.proposedPrice < popupData.originalPrice && (
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
