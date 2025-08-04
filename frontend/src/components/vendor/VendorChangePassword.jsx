import React, { useState } from "react";
import "./VendorChangePassword.css";
import PasswordInput from "../../utils/PasswordInput";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";
const VendorChangePassword = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
        alert("Password changed successfully");
        setShowPasswordModal(false);
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
  return (
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
        {errorMsg && <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handlePasswordChangeSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setShowPasswordModal(false);
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
  );
};

export default VendorChangePassword;
