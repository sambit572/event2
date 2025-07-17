import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VendorResetPass.css"; 

const VendorResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (confirmPassword === newPassword) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/reset-password/${resetToken}`,
          { newPassword }
        );

        console.log("✅ Vendor password reset successful:", response.data.message);
        alert("Password reset successful! Please login.");
        navigate("/"); 
      } catch (error) {
        console.error("❌ Error resetting password:", error.response?.data || error);
        alert(
          error.response?.data?.message ||
            "Error resetting password. Try again."
        );
      }
    } else {
      alert("Your password does not match, please re-enter!");
    }
  };

  return (
    <div className="headpart">
      <form onSubmit={handleResetPassword} className="formpart">
        <h2 className="subhead">New Password</h2>
        <p className="subheadingRP">
          Please create a new password.
        </p>
        <input
          type="password"
          placeholder="Create new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="inputpart"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="inputpart"
          required
        />
        <button type="submit" className="submitbutton">
          Create Password
        </button>
      </form>
    </div>
  );
};

export default VendorResetPassword;
