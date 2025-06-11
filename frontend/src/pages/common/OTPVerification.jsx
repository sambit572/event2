// OTPVerification.jsx
import React, { useState } from "react";
import "./OTPVerification.css"; // style as needed
import PropTypes from "prop-types";

const OTPVerification = ({ setStep }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;
    console.log("OTP entered:", otpCode);
    // Add actual verification logic here

    try {
      if (!window.confirmationResult) {
        alert("OTP session expired. Please try signing in again.");
        return;
      }
      const result = await window.confirmationResult.confirm(otpCode);
      console.log("Phone auth success:", result.user);
      setStep("success");
    } catch (err) {
      console.error("OTP verification failed", err);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-wrapper">
      <h2>Verify With OTP</h2>
      <p>
        To ensure your security, enter the 6-digit code sent to your registered
        mobile number/email below.
      </p>

      <div className="otp-inputs">
        {otp.map((data, index) => (
          <input
            key={index}
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            className="otp-input"
          />
        ))}
      </div>

      <p>
        Not received your code? <span className="link">Resend OTP</span>
      </p>

      <button className="otp-button" onClick={handleVerify}>
        Verify
      </button>

      <p>
        Having difficulties with OTP? <span className="link">Get Help</span>
      </p>
    </div>
  );
};

OTPVerification.propTypes = {
  setStep: PropTypes.func.isRequired,
};

export default OTPVerification;
