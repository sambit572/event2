import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import MarketAnalytics from "./MarketAnalytics.jsx";
import "./DashboardMain.css";
import socket from "../../socket/socketClient.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PasswordInput from "./../../utils/PasswordInput.jsx";
import { BACKEND_URL } from "../../utils/constant.js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdPeople, MdSettings, MdNotificationsNone } from "react-icons/md";

/* ─── Customers placeholder ─── */
function CustomersTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
        <MdPeople size={36} color="#fff" />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>Customers</h2>
      <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", maxWidth: 320, margin: 0 }}>
        Your customer management hub is coming soon. You'll be able to view booking history, messages, and reviews from all your clients here.
      </p>
      <span style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 999, padding: "6px 18px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>COMING SOON</span>
    </div>
  );
}

/* ─── Settings placeholder ─── */
function SettingsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(245,158,11,0.35)" }}>
        <MdSettings size={36} color="#fff" />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>Settings</h2>
      <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", maxWidth: 320, margin: 0 }}>
        Configure notifications, payment preferences, availability calendar, and more. Full settings panel coming soon.
      </p>
      <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999, padding: "6px 18px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>COMING SOON</span>
    </div>
  );
}

function DashBoardMain() {
  const navigate = useNavigate();
  const vendor = useSelector((state) => state.vendor.vendor);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [popupData, setPopupData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [vendorShowPasswordModal, setVendorShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleConfirmPassword = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/verify-password`,
        { password },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsVerified(true);
        setConfirmPasswordModal(false);
      } else {
        alert("❌ Incorrect password.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      alert(`❌ ${msg}`);
    }
  };

  const handlePasswordChangeSubmit = async () => {
    setErrorMsg("");
    if (newPassword !== confirmPassword) return setErrorMsg("Passwords do not match");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/vendors/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
        setVendorShowPasswordModal(false);
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch (error) {
      const backendMsg = error.response?.data?.message || "Failed to change password. Try again.";
      setErrorMsg(backendMsg);
    }
  };

  useEffect(() => {
    socket.emit("vendor-online", vendor?._id);
    socket.on("pending-negotiations", (requests) => {
      if (requests?.length) setPopupData(requests[0]);
      else setPopupData(null);
    });
    socket.on("negotiation_to_vendor", (data) => {
      if (data.vendorId === vendor?._id) setPopupData(data);
    });
    return () => {
      socket.off("pending-negotiations");
      socket.off("negotiation_to_vendor");
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResponse = (action) => {
    if (!popupData?._id) return;
    socket.emit("vendor_response", {
      vendorId: vendor._id,
      bookedByUserId: popupData.bookedByUserId,
      serviceId: popupData.serviceId,
      action,
      finalPrice: parseFloat(finalPrice.trim() === "" ? popupData.proposedPrice : finalPrice),
    });
    setPopupData(null);
  };

  /* ── Tab label map for main header ── */
  const tabTitles = {
    services: "My Services",
    bookings: "Bookings",
    analytics: "Market Analytics",
    customers: "Customers",
    settings: "Settings",
  };

  return (
    <div className="dashboard-container-box">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: "fixed", top: "115px", left: "50%",
          transform: "translate(-50%, -50%)", padding: "20px 32px",
          borderRadius: "8px", background: "rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          border: "2px solid black", fontWeight: "bold", color: "black",
          zIndex: 9999, textAlign: "center",
        }}>
          Your password updated successfully!
        </div>
      )}

      {/* Mobile hamburger */}
      <button
        className={`dashboard-hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar now owns navigation */}
      <DashBoardSideBar
        isOpen={isSidebarOpen}
        isVerified={isVerified}
        setConfirmPasswordModal={setConfirmPasswordModal}
        setVendorShowPasswordModal={setVendorShowPasswordModal}
        setIsVerified={setIsVerified}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <div className="main-contain">
        {/* Top bar */}
        <div className="main-topbar">
          <div>
            <h1 className="main-topbar-title">{tabTitles[activeTab]}</h1>
            <p className="main-topbar-sub">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="main-topbar-actions">
            <button className="topbar-icon-btn" title="Notifications">
              <MdNotificationsNone size={22} />
            </button>
            <div className="topbar-greeting">
              Hi, {vendor?.fullName?.split(" ")[0] || "Vendor"} 👋
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="main-tab-content">
          {activeTab === "services"   && <DashboardServices />}
          {activeTab === "bookings"   && <DashBoardBooking />}
          {activeTab === "analytics"  && <MarketAnalytics />}
          {activeTab === "customers"  && <CustomersTab />}
          {activeTab === "settings"   && <SettingsTab />}
        </div>

        {/* Password Change Modal */}
        {vendorShowPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <PasswordInput name="oldPassword" type="password" placeholder="Current Password"
                value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <PasswordInput name="newPassword" type="password" placeholder="New Password"
                value={newPassword} onChange={(e) => { setErrorMsg(""); setNewPassword(e.target.value); }} />
              <PasswordInput name="confirmPassword" type="password" placeholder="Confirm Password"
                value={confirmPassword} onChange={(e) => { setErrorMsg(""); setConfirmPassword(e.target.value); }} />
              {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
              <div className="mt-4 flex justify-center gap-4">
                <button onClick={handlePasswordChangeSubmit} className="bg-purple-700 text-white px-4 py-2 rounded">Submit</button>
                <button onClick={() => { setVendorShowPasswordModal(false); setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setErrorMsg(""); }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password Modal */}
        {confirmPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">Enter your password to confirm</h3>
              <div className="relative w-full mb-3">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder={password}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={handleConfirmPassword} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Confirm</button>
                <button onClick={() => setConfirmPasswordModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Negotiation Popup */}
        {popupData && (
          <div className="popup-overlayfinal">
            <div className="popup-container">
              <h3 className="popup-title">New Booking Request</h3>
              <div className="popup-content">
                <p><strong>Service:</strong> {popupData.serviceName}</p>
                <p><strong>Venue:</strong> {popupData.venueLocation}</p>
                <p><strong>Type:</strong> {popupData.type}</p>
                <p><strong>Original Price Range:</strong> ₹{popupData.originalPriceRange.min} – ₹{popupData.originalPriceRange.max}</p>
                <p><strong>Proposed Price:</strong>{" "}
                  {popupData.type === "No Negotiation Requested" ? "To be negotiated upon discussion." : `₹${popupData.proposedPrice}`}
                </p>
                {popupData && (
                  <p><strong>Enter Final Price:</strong>
                    <input type="text" placeholder="Enter Your Final Price" className="VenueInput"
                      value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} required />
                  </p>
                )}
                <p><strong>Date:</strong>{" "}
                  {new Date(popupData.date.startDate).toLocaleDateString() === new Date(popupData.date.endDate).toLocaleDateString()
                    ? new Date(popupData.date.startDate).toLocaleDateString()
                    : `${new Date(popupData.date.startDate).toLocaleDateString()} to ${new Date(popupData.date.endDate).toLocaleDateString()}`}
                </p>
              </div>
              <div className="popup-actions">
                <button className="btn-accept" onClick={() => handleResponse("accept")}>Accept</button>
                <button className="btn-decline" onClick={() => handleResponse("decline")}>Reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoardMain;
