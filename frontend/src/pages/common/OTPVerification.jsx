import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";

const OTPVerification = ({
  error,
  timer,
  inputRefs,
  handleResend,
  setStep,
  onClose,
  phoneNum,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const dispatch = useDispatch();

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

      const response = await axios.post(
        `${BACKEND_URL}/user/verify-otp`,
        {
          phoneNo: phoneNum,
        },
        {
          withCredentials: true,
        }
      );

      console.log("OTP verification response:", response.data.data);

      const { loggedInUser } = response.data.data;
      console.log("Verified user data:", loggedInUser);
      dispatch(setUser(loggedInUser));

      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem(
        "userFirstName",
        loggedInUser.fullName.split(" ")[0]
      );
      localStorage.setItem("userLastName", loggedInUser.fullName.split(" ")[1]);

      window.dispatchEvent(new Event("userLoggedIn"));

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
          <strong>+91-{phoneNum}</strong>. Enter it below to continue.
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
  phoneNum: PropTypes.string.isRequired,
};

export default OTPVerification;
