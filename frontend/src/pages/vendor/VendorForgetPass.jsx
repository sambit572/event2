import axios from "axios"; 
import React, { useState } from "react";
import "./VendorForgetPass.css"; 

function VendorForgotPass({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/send-reset-link`,
        { email }
      );
      console.log(res.data.message);
      alert("Vendor reset link sent successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error sending vendor reset link", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error sending reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="custom-form modal-box">
        {/* ❌ Close button in top-right */}
        <button
          className="modal-close-button"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="custom-heading">Vendor Forgot Password</h2>
        <p className="subheading">Enter your registered vendor email address</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="custom-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="custom-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VendorForgotPass;
