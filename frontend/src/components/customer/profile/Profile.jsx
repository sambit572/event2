import React, { useState, useEffect } from "react";
import UserSideBar from "./UserSideBar.jsx";
import PasswordInput from "../../../utils/PasswordInput.jsx";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant.js";
import "./Profile.css";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordChangeSubmit = async () => {
    try {
      if (newPassword !== confirmPassword) {
        return setErrorMsg("Passwords do not match");
      }

      const response = await axios.post(
        `${BACKEND_URL}/user/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password changed successfully");
      }
    } catch (error) {
      console.error("Password change error:", error);
    }

    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Hamburger Button */}
      <button
        className={`profile-hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <UserSideBar isOpen={isSidebarOpen} setShowPasswordModal={setShowPasswordModal} />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:px-12">
        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
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
              {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
              <div className="mt-4 flex justify-end gap-4">
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

        {/* Page Title */}
        <h2 className="boking-text text-2xl md:text-3xl font-bold text-center mb-6">My Bookings</h2>

        {/* Sort Dropdown */}
        <div className="flex justify-end mb-4">
          <select className="bg-purple-900 text-white px-4 py-2 font-semibold rounded shadow">
            <option className="bg-white text-black">Sort by</option>
            <option className="bg-white text-black" value="completed">Completed</option>
            <option className="bg-white text-black" value="pending">Pending</option>
            <option className="bg-white text-black" value="cancelled">Cancelled</option>
            <option className="bg-white text-black" value="last1">Last 3 months</option>
            <option className="bg-white text-black" value="last2">Last 6 months</option>
          </select>
        </div>

        {/* Booking Card */}
        <div className=" bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-[900px] md:ml-10 lg:ml-[140px] mx-auto space-y-4">
          <div className="relative flex flex-col md:flex-row gap-4">
            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600"
              alt="DJ Service"
              className="w-full md:w-[200px] h-[200px] object-cover rounded"
            />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-1 text-sm md:text-base text-left">
                <h3 className="text-lg md:text-xl font-bold text-purple-900">
                  DJ Wedding Service
                </h3>
                <p className="text-gray-700">Patia, Bhubaneswar, Odisha, India</p>
                <p className="text-gray-600">Booking Date: 10/06/2025</p>
                <p className="text-gray-600">Event Date: 10/06/2025</p>
                <a
                  href="#payment-details"
                  className="text-purple-700 underline font-medium block mt-2"
                >
                  Payment Details
                </a>

                {/* Payment Details */}
                <div className="mt-4 space-y-1">
                  <p>
                    Actual Amount: <strong>₹50,000</strong>
                  </p>
                  <p>
                    Paid Amount: <strong>₹3,000</strong>
                  </p>
                  <p>
                    Remaining Amount: <strong>₹47,000</strong>
                  </p>
                </div>
              </div>

              {/* Payment Status (bottom right) */}
              <div className="mt-6 flex justify-end">
                <p className="text-yellow-500 font-bold text-sm md:text-base">
                  Payment Pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
