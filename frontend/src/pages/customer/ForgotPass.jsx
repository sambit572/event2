import axios from "axios";
import React, { useState } from "react";

function ForgotPass({ onClose }) {
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
        `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`,
        {
          email,
        }
      );
      console.log(res.data.message);
      alert("Reset link sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending reset link", error);
      if (error.response && error.response.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error sending reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg h-auto sm:h-auto bg-gradient-to-r from-[#f1ecad] to-[#fdf47e]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 bg-yellow-300 right-4 text-gray-800 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-black">
          Forgot Password
        </h2>

        {/* Subheading */}
        <p className="text-base text-center text-gray-600 mb-4">
          Enter your valid email address
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-[#ffbf00] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;
