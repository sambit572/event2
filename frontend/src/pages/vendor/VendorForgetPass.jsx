import axios from "axios";
import React, { useState } from "react";

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
    <div className=" fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-[9999] bg-black bg-opacity-50 backdrop-blur-[12px]">
      <div className=" relative flex flex-col  justify-center items-center p-10 bg-gradient-to-r from-[#f1ecad] to-[#fdf47e] rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-[350px] max-w-[90vw] transition-all duration-300 ease-in-out sm:w-[400px] sm:p-8  only-1024x600-vendor-forgot-pass md:mb-[30rem] lg:mb-[50rem] xl:mb-[5rem] min-[390px]:mb-[20rem] max-[344px]:mb-[15rem] only-912x1368-vendor-forgot-pass">
        {/* ❌ Close button in top-right */}
        <button
          className=" absolute top-[10px] right-[15px] bg-transparent border-none text-[28px] font-bold text-[#130751] cursor-pointer z-[100] p-2 rounded-full transition-colors duration-200 ease-linear leading-none w-10 h-10 flex items-center justify-center hover:bg-black hover:bg-opacity-10"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className=" text-[1.8rem] font-bold mb-5 text-center text-[#1f1263] font-['Poppins',sans-serif] text-2xl sm:text-3xl">
          Vendor Forgot Password
        </h2>

        <p className=" text-[1.12rem] mb-5 text-center text-gray-600 text-base sm:text-lg">
          Enter your registered vendor email address
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <input
            type="email"
            className="w-full py-3 px-[15px] my-[10px] rounded-[10px] border border-[#200f73] text-[15px] font-medium outline-none box-border 
                      hover:enabled:border-[#5034ba] focus:border-2 focus:border-[#22136d] 
                      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className=" mt-5 py-3 px-5 bg-[#22136d] text-white font-bold min-w-[150px] border-none rounded-[10px] cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out 
                      hover:enabled:bg-[#1185c8] hover:enabled:-translate-y-0.5
                      disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VendorForgotPass;
