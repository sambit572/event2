import axios from "axios";
import React, { useState } from "react";
import "./ForgotPass.css";
function ForgotPass() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`,
        {
          email,
        }
      );
      console.log(res.data.message);
      alert("Reset link sent successfully!");
    } catch (error) {
      console.error("Error sending reset link", error);
      alert("Error sending reset link. Try again.");
    }
  };

  return (
    <div className="custom-container">
      <form onSubmit={handleSubmit} className="custom-form">
        <h2 className="custom-heading">Forgot Password</h2>
        <p className="subheading">Enter your valid email address</p>
        <input
          type="email"
          className="custom-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="custom-button">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

// Inline CSS Styles

export default ForgotPass;
