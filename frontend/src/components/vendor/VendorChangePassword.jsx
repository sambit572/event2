import React, { useState } from "react";
import "./VendorChangePassword.css";
import PasswordInput from "../../utils/PasswordInput";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";
const VendorChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [VendorShowPasswordModal, setVendorShowPasswordModal] = useState(false);
  const handlePasswordChangeSubmit = async () => {
    setErrorMsg("");

    // Trim passwords and validate non-empty
    const trimmedOld = oldPassword.trim();
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedOld || !trimmedNew || !trimmedConfirm) {
      return setErrorMsg("Please fill out all fields.");
    }

    if (trimmedNew !== trimmedConfirm) {
      return setErrorMsg("Passwords do not match");
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/vendors/change-password`,
        {
          oldPassword: trimmedOld,
          newPassword: trimmedNew,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password changed successfully");
        onClose(); // ✅ Close modal from parent
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
            className="bg-purple-700 text-white px-3 py-1 rounded"
            onClick={handlePasswordChangeSubmit}
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
  );
};

export default VendorChangePassword;
