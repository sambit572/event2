import React from "react";
import { useNavigate } from "react-router-dom";
import "./VendorThankYou.css";

export default function VendorThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <div className="checkmark-wrapper">
          <svg className="animated-check" viewBox="0 0 52 52">
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="23"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h1 class="text-[rgb(235,235,101)] font-bold text-[28px] mb-2.5">
          Thank you!
        </h1>
        <p class="text-[15px] text-white mb-[30px]">
          We've received your submission. You can find more information on our
          website or social pages.
        </p>
        {/*  Go to Profile */}
        <div className="thankyou-visit">
          <h3>View Your Profile</h3>
          <button
            className="vendor-thankyou-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
