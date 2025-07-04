import React, { useState, useEffect } from "react";
import UserSideBar from "./UserSideBar.jsx";
import PasswordInput from "../../../utils/PasswordInput.jsx";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant.js";
import "./Profile.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePasswordChangeSubmit = async () => {
    setErrorMsg(""); // Reset on each submit

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password changed successfully");
        // Only reset after success
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Password change error:", error);

      // Try to show a clean error message from backend
      const backendMsg =
        error.response?.data?.message ||
        "Failed to change password. Try again.";

      console.log(backendMsg);

      setErrorMsg(backendMsg); // ✅ Show it in UI

      // Optional: don't alert here unless critical
      // alert(backendMsg);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const sidebar = document.querySelector(".profile-sidebar-fixed");
        if (entry.isIntersecting) {
          sidebar.style.position = "relative";
        } else {
          sidebar.style.position = "sticky";
          sidebar.style.top = "0";
        }
      },
      { threshold: 0.1 }
    );

    const footerEl = document.querySelector("footer"); // Add an id if needed
    if (footerEl) observer.observe(footerEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="profile_section mb-[-148px] relative w-full min-h-screen flex flex-col md:flex-row bg-white xl:overflow-x-hidden sm:Class	CSS Equivalent
"
    >
      <div className="profile-sidebar-fixed">
        {/* Hamburger Button */}
        <button
          className={`profile-hamburger ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <UserSideBar
          isOpen={isSidebarOpen}
          setShowPasswordModal={setShowPasswordModal}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-12 ">
          {/* Password Modal */}
          {showPasswordModal && (
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
                    onClick={() => setShowPasswordModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <div className="profile-scrollable-content max-[430px]:flex-row">
        <h2 className="boking-text text-2xl md:text-3xl font-bold text-center mb-4">
          My Bookings
        </h2>

        <div className="w-1/2 ml-auto mr-[40px] flex justify-end items-center p-4 mt-[-20px]">
          <div className="relative">
            <select
              className="sortby-dropdown appearance-none pr-6 max-w-xs bg-[#001F3F]  text-white p-2 font-semibold rounded-lg shadow"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <option value="">Sort by</option>
              <option className="bg-white text-black" value="completed">
                Completed
              </option>
              <option className="bg-white text-black" value="pending">
                Pending
              </option>
              <option className="bg-white text-black" value="cancelled">
                Cancelled
              </option>
              <option className="bg-white text-black" value="last1">
                Last 3 months
              </option>
              <option className="bg-white text-black" value="last2">
                Last 6 months
              </option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
              {isDropdownOpen ? (
                <FaChevronUp className="text-sm text-white" />
              ) : (
                <FaChevronDown className="text-sm text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Cards Container with scroll detection */}
        <div className="booking-card-container" id="bookingCards">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="modern-booking-card">
              <div className="image-section">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600"
                  alt="DJ Service"
                  className="rounded-lg"
                />
              </div>
              <div className="info-section">
                <div className="user-booking-info-section">
                  <h3 className="text-xl font-bold text-[#001F3F]">
                    DJ Wedding Service
                  </h3>
                  <p className="text-black">
                    Patia, Bhubaneswar, Odisha, India
                  </p>
                  <p className="text-sm text-black mt-[-20px] mb-[8px]">
                    Booking Date: 10/06/2025
                  </p>
                  <p className="text-sm text-black ">Event Date: 10/06/2025</p>
                  <a
                    href="#payment-details"
                    className="text-[#001F3F] underline font-medium mt-2 block"
                  >
                    Payment Details
                  </a>
                </div>
                <div className="payment mt-3 ml-[80px]">
                  <p className="text-black mb-[8px]">
                    Actual:<span className="text-black"> ₹50,000</span>
                  </p>
                  <p className="text-black mb-[8px]">Paid: ₹3,000</p>
                  <p className="text-black">Remaining: ₹47,000</p>
                  <p className="text-yellow-600 font-semibold mt-2">
                    Payment Pending
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
