import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import ToggleTabs from "./ToggleTabs.jsx";
import "./DashboardMain.css";
import { io } from "socket.io-client";
import axios from "axios";
const socket = io(import.meta.env.VITE_BACKEND_URL);
import { useSelector, useDispatch } from "react-redux";
import { setVendor } from "../../redux/VendorSlice"; // If you update vendor in Redux

const VENDOR_NAME = "Horse-Carriage Odisha"; // 🔁 Use dynamic vendor later

function DashBoardMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [popupData, setPopupData] = useState(null);
  const [callStatus, setCallStatus] = useState("Inactive");
  const [callStarted, setCallStarted] = useState(false);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [tempAccountNumber, setTempAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [tempIfscCode, setTempIfscCode] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [upiId, setUpiId] = useState("");
  const vendor = useSelector((state) => state.vendor.vendor);
  const dispatch = useDispatch();
  const [active, setActive] = useState(true);

  const handleConfirmPassword = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/verify-password`,
        { password }, // ensure it's sent as an object
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // ✅ Password is correct
        setAccountNumber(tempAccountNumber);
        setIfscCode(tempIfscCode);
        handleSaveChanges();
        setEditMode(false);
        setConfirmPasswordModal(false);
        console.log("password correct");
      } else {
        // ❌ Password is wrong
        alert("❌ Incorrect password. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      alert(`❌ ${message}`);
      console.error(err);
    }
  };
  const updateVendorDetails = async () => {
    try {
      console.log("Saving vendor details:", vendor);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/${vendor._id}`,
        {
          vendorId: vendor._id,
          fullName,
          email,
          phoneNumber,
          active,
        }
      );
      dispatch(setVendor(res.data.updatedVendor));
      console.log("Vendor details saved.");
    } catch (err) {
      console.error("Error saving vendor details:", err);
    }
  };
  const updateBankDetails = async () => {
    if (!vendor) {
      console.error("Vendor is not loaded yet!");
      return;
    }

    try {
      console.log("Sending bank details:", {
        upiId,
        tempAccountNumber,
        ifscCode,
      });

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/bank-details/${
          vendor._id
        }`,
        { upiId, tempAccountNumber, ifscCode },
        { withCredentials: true }
      );
      console.log("Vendor API response:", res.data);

      dispatch(setVendor(res.data.updatedVendor));
      console.log("Bank details saved.");
    } catch (err) {
      console.error("Error saving bank details:", err);
    }
  };
  const handleSaveChanges = async () => {
    if (!vendor || !vendor._id) {
      console.error("Vendor not loaded. Cannot save changes.");
      return;
    }

    await updateVendorDetails();
    await updateBankDetails();
  };

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
      <DashBoardSideBar
        active={active}
        setActive={setActive}
        fullName={fullName}
        phoneNumber={phoneNumber}
        upiId={upiId}
        email={email}
        setFullName={setFullName}
        setPhoneNumber={setPhoneNumber}
        setUpiId={setUpiId}
        setEmail={setEmail}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        setTempAccountNumber={setTempAccountNumber}
        setIfscCode={setTempIfscCode}
        setTempIfscCode={setTempIfscCode}
        setEditMode={setEditMode}
        tempAccountNumber={tempAccountNumber}
        ifscCode={tempIfscCode}
        tempIfscCode={tempIfscCode}
        editMode={editMode}
        isOpen={isSidebarOpen}
        isVerified={isVerified}
        setConfirmPasswordModal={setConfirmPasswordModal}
        handleSaveChanges={handleSaveChanges}
      />

      <div className="main-contain">
        <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "services" ? (
          <DashboardServices />
        ) : (
          <DashBoardBooking />
        )}

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
