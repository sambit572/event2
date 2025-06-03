// OTPVerification.jsx
import React, { useState } from 'react';
import './OTPVerification.css'; // style as needed

const OTPVerification = ({ onCancel }) => {
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

  const handleVerify = () => {
    const otpCode = otp.join("");
    console.log("OTP entered:", otpCode);
    // Add actual verification logic here
  };

  return (
    <div className="otp-wrapper">
      <h2>Verify With OTP</h2>
      <p>To ensure your security, enter the 6-digit code sent to your registered mobile number/email below.</p>
      
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

      <p>Not received your code? <span className="link">Resend OTP</span></p>

      <button className="otp-button" onClick={handleVerify}>Verify</button>
      <button className="otp-cancel" onClick={onCancel}>Cancel</button>

      <p>Having difficulties with OTP? <span className="link">Get Help</span></p>
    </div>
  );
};

export default OTPVerification;
