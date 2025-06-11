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
      console.log(
        "Old:",
        oldPassword,
        "New:",
        newPassword,
        "Confirm:",
        confirmPassword
      );

      if (newPassword !== confirmPassword) {
        return setErrorMsg("Password do not match");
      }

      const response = await axios.post(
        `${BACKEND_URL}/user/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("password change successfull");
        alert("password changed successfully");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
    setShowPasswordModal(false);
    // Reset fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
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

      <UserSideBar
        isOpen={isSidebarOpen}
        setShowPasswordModal={setShowPasswordModal}
      />

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <PasswordInput
              name="oldPassword"
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
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
              required
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
              required
            />

            <div className="modal-buttons">
              <button className="submit-btn" onClick={handlePasswordChangeSubmit}>Submit</button>
              <button className='cancel-btn' onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}
          </div>
        </div>
      )}

      <div className="main-content">
        <h2>Main content</h2>
      </div>
    </div>
  );
}

export default Profile;
