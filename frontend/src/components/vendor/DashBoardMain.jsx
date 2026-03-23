import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import ToggleTabs from "./ToggleTabs.jsx";
import "./DashboardMain.css";
import socket from "../../socket/socketClient.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PasswordInput from "./../../utils/PasswordInput.jsx";
import { BACKEND_URL } from "../../utils/constant.js";
import { FiEye, FiEyeOff } from "react-icons/fi";

function DashBoardMain() {
  const navigate = useNavigate();

  const vendor = useSelector((state) => state.vendor.vendor);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [popupData, setPopupData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [vendorShowPasswordModal, setVendorShowPasswordModal] = useState(false); // ✅ Added
  const [oldPassword, setOldPassword] = useState(""); // ✅ Added
  const [newPassword, setNewPassword] = useState(""); // ✅ Added
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Added
  const [errorMsg, setErrorMsg] = useState(""); // ✅ Added

  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");

  const [finalPrice, setFinalPrice] = useState(""); // ✅ Final price state

  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ Success popup state

  const handleConfirmPassword = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/verify-password`,
        {
          password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsVerified(true);
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

  // ✅ Handle Password Change
  const handlePasswordChangeSubmit = async () => {
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/vendors/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowSuccessPopup(true); // ✅ Show popup
        setTimeout(() => setShowSuccessPopup(false), 3000); // ✅ Hide after 3 sec
        setVendorShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Password change error:", error);
      const backendMsg =
        error.response?.data?.message ||
        "Failed to change password. Try again.";
      setErrorMsg(backendMsg);
    }
  };

  useEffect(() => {
    console.log("Negortiation circuit working");
    socket.emit("vendor-online", vendor?._id);

    socket.on("pending-negotiations", (requests) => {
      if (requests?.length) {
        console.log(`Pending negotiation of the vendor ${requests[0]}`);
        setPopupData(requests[0]);
      } else {
        f(null);
      }
    });

    socket.on("negotiation_to_vendor", (data) => {
      if (data.vendorId === vendor?._id) {
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
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("Popup Data:", popupData);

  const handleResponse = (action) => {
    if (!popupData?._id) return;

    socket.emit("vendor_response", {
      vendorId: vendor._id,
      bookedByUserId: popupData.bookedByUserId,
      serviceId: popupData.serviceId,
      action,
      finalPrice: parseFloat(
        finalPrice.trim() === "" ? popupData.proposedPrice : finalPrice
      ),
    });

    setPopupData(null);
  };

  return (
    <div className="dashboard-container-box">
      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: "115px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 32px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "2px solid black",
            fontWeight: "bold",
            color: "black",
            zIndex: 9999,
            textAlign: "center",
            animation: "popIn 0.3s ease-out forwards",
          }}
        >
          Your password updated successfully!
        </div>
      )}

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
        setVendorShowPasswordModal={setVendorShowPasswordModal} // ✅ Added to trigger password modal
        setIsVerified={setIsVerified}
      />

      <div className="main-contain">
        <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="relative max-h-[70vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[480px]">
          {activeTab === "services" ? (
            <DashboardServices />
          ) : (
            <DashBoardBooking />
          )}
        </div>

        {/* ✅ Password Change Modal */}
        {vendorShowPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <PasswordInput
                name="oldPassword"
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <PasswordInput
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setErrorMsg("");
                  setNewPassword(e.target.value);
                }}
              />
              <PasswordInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setErrorMsg("");
                  setConfirmPassword(e.target.value);
                }}
              />
              {errorMsg && (
                <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>
              )}
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={handlePasswordChangeSubmit}
                  className="bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setVendorShowPasswordModal(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrorMsg("");
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Password Modal */}
        {confirmPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Enter your password to confirm
              </h3>
              <div className="relative w-full mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={password}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

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

        {/* Booking Negotiation Popup */}
        {popupData && (
          <div className="popup-overlayfinal">
            <div className="popup-container">
              <h3 className="popup-title">New Booking Request</h3>
              <div className="popup-content">
                <p>
                  <strong>Service:</strong> {popupData.serviceName}
                </p>
                <p>
                  <strong>Venue:</strong> {popupData.venueLocation}
                </p>
                <p>
                  <strong>Type:</strong> {popupData.type}
                </p>
                {/* Updated to display the price range */}
                <p>
                  <strong>Original Price Range:</strong> ₹
                  {popupData.originalPriceRange.min} - ₹
                  {popupData.originalPriceRange.max}
                </p>
                <p>
                  <strong>Proposed Price:</strong>{" "}
                  {popupData.type === "No Negotiation Requested"
                    ? "To be negotiated upon discussion."
                    : `₹${popupData.proposedPrice}`}
                </p>
                {popupData && (
                  <p>
                    <strong>Enter Final Price:</strong>
                    <input
                      type="text"
                      placeholder="Enter Your Final Price"
                      className="VenueInput"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      required
                    />
                  </p>
                )}
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(popupData.date.startDate).toLocaleDateString() ===
                  new Date(popupData.date.endDate).toLocaleDateString()
                    ? new Date(popupData.date.startDate).toLocaleDateString()
                    : `${new Date(
                        popupData.date.startDate
                      ).toLocaleDateString()} to ${new Date(
                        popupData.date.endDate
                      ).toLocaleDateString()}`}
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
                  Reject
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
