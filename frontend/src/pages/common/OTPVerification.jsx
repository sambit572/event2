import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const OTPVerification = ({
  error,
  timer,
  inputRefs,
  handleResend,
  setStep,
  onClose,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // If parent didn't pass inputRefs, create a fallback ref
  const localRefs = useRef([]);
  const safeRefs = inputRefs && inputRefs.current ? inputRefs : localRefs;

  const navigate = useNavigate();

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
    <div
      className="login-wrapper"
      onClick={() => {
        if (onClose) onClose(false); // Close modal on background click
      }}
    >
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close button */}
        <button
          className="modal-close"
          onClick={() => {
            if (onClose) onClose(false); // Close modal when clicking ×
          }}
          style={{ cursor: "pointer" }}
        >
          ×
        </button>

        <h2 className="OTP-title">Verify With OTP</h2>

        <p className="otp-info">
          We’ve sent a 6-digit verification code to your registered mobile
          number
          <strong> +91-9692486267</strong> and email{" "}
          <strong>dummy@gmail.com</strong>. Enter it below to continue.
        </p>

        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              type="number" // or "tel" for numeric keypad on mobile
              inputMode="numeric" // ensures numeric keypad
              pattern="[0-9]*" // restricts input to digits
              key={index}
              ref={(el) => (safeRefs.current[index] = el)}
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              className="otp-input"
            />
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        <p className="resend-info">
          Not received your code?{" "}
          <span
            className={`link ${timer > 0 ? "disabled" : ""}`}
            onClick={timer > 0 ? undefined : handleResend}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </span>
        </p>

        <button className="otp-button" onClick={handleVerify}>
          Verify
        </button>

        <p className="help-text">
          Having difficulties with OTP?{" "}
          <span
            className="link"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/help-center");
            }}
            style={{ cursor: "pointer" }}
          >
            Help Us
          </span>
        </p>
      </div>
    </div>
  );
};

OTPVerification.propTypes = {
  otp: PropTypes.array,
  error: PropTypes.string,
  timer: PropTypes.number.isRequired,
  inputRefs: PropTypes.object,
  handleResend: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  onClose: PropTypes.func, // Optional
};

export default OTPVerification;
