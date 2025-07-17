import React, { useEffect, useState } from "react";
import "./OTPVerification.css";
import PropTypes from "prop-types";

const OTPVerification = ({ setStep }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      alert("Please enter all 6 digits.");
      return;
    }

    console.log("OTP entered:", otpCode);

    try {
      if (!window.confirmationResult) {
        alert("OTP session expired. Please try signing in again.");
        console.error("No confirmationResult found in window object.");
        return;
      }

      const result = await window.confirmationResult.confirm(otpCode);
      console.log("✅ Phone auth success:", result.user);
      setStep("success");
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!window.recaptchaVerifier || !window.phoneNumber) {
      alert("Something went wrong. Try logging in again.");
      console.error("recaptchaVerifier or phoneNumber missing.");
      return;
    }

    try {
      setTimer(30);
      console.log("🔁 Resending OTP to:", window.phoneNumber);

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await window.firebase
        .auth()
        .signInWithPhoneNumber(window.phoneNumber, appVerifier);

      window.confirmationResult = confirmationResult;
      console.log("✅ OTP resent successfully");
    } catch (err) {
      console.error("❌ Failed to resend OTP:", err);
      alert("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="otp-wrapper">
      <h2>Verify With OTP</h2>
      <p className="text-[#001F3F]">
        Enter the 6-digit OTP sent to your mobile.
      </p>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            className="otp-input"
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <p>
        {timer > 0 ? (
          <>
            Resend OTP in <strong>{timer}s</strong>
          </>
        ) : (
          <span className="link" onClick={handleResend}>
            Resend OTP
          </span>
        )}
      </p>

      <button className="otp-button" onClick={handleVerify}>
        Verify
      </button>

      <p>
        Having issues? <span className="link">Get Help</span>
      </p>
    </div>
  );
};

OTPVerification.propTypes = {
  setStep: PropTypes.func.isRequired,
};

export default OTPVerification;
