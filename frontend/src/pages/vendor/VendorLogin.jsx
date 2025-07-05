import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPVerification from "../common/OTPVerification.jsx";
import PasswordInput from "../../utils/PasswordInput.jsx";
import SuccessBlock from "../common/SuccessBlock.jsx";
import axios from "axios";
import "../common/LoginRegister.css";
import { useDispatch } from "react-redux";
import { setVendor } from "../../redux/VendorSlice.js";
import { BACKEND_URL } from "../../utils/constant.js";

const VendorLogin = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // 'form', 'otp', 'success'
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  const [formData, setFormData] = useState({
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (step === "success") {
      setShowSuccessIcon(false);
      const iconTimer = setTimeout(() => setShowSuccessIcon(true), 500);
      const closeTimer = setTimeout(() => onClose?.(), 5000);
      return () => {
        clearTimeout(iconTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [step, onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function setupRecaptcha() {
    if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => console.log("Recaptcha passed"),
      }
    );
  }

  async function handleGetOTP(e) {
    e.preventDefault();
    const phone = formData.phoneNo.replace(/\D/g, "");
    const phoneNumber = "+91" + phone;

    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      setErrorMsg("Invalid Indian phone number.");
      return;
    }

    try {
      setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setStep("otp");
    } catch (err) {
      console.error("OTP error:", err);
      setErrorMsg("OTP send failed. Try again.");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email && !formData.phoneNo) {
      return setErrorMsg("Enter email or phone to log in.");
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/vendors/login`,
        {
          email: formData.email,
          phoneNo: formData.phoneNo,
          password: formData.password,
        },
        { withCredentials: true }
      );

      console.log(res.data.data);
      const { vendor } = res.data.data;
      dispatch(setVendor(vendor));
      const fullName = vendor.fullName || "";
      const firstName = fullName.split(" ")[0];
      const firstLetter = firstName?.charAt(0).toUpperCase() || "";
      const profilePic = vendor.profilePic || "";

      localStorage.setItem("VendorCurrentlyLoggedIn", "true");
      localStorage.setItem("VendorFullName", fullName);
      localStorage.setItem("VendorFirstName", firstName);
      localStorage.setItem("VendorInitial", firstLetter);
      if (profilePic) {
        localStorage.setItem("VendorProfilePic", profilePic);
      }

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg === "Vendor not found") {
        setErrorMsg("Please register before login.");
      } else {
        setErrorMsg(`SignIn failed: ${msg}`);
      }
    }
  }

  const renderStep = () => {
    if (step === "otp") return <OTPVerification setStep={setStep} />;

    return (
      <>
        <input
          type="text"
          className="login-input"
          name="phoneNo"
          placeholder="+91 | Enter your phone number"
          value={formData.phoneNo}
          onChange={handleChange}
        />
        <button className="otp-button" onClick={handleGetOTP}>
          Get OTP
        </button>

        <input
          type="email"
          name="email"
          className="login-input"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordInput
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
        />

        <div className="Login-forget-password-link">
          <a href="/forgot-password">Forgot your password?</a>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        <button className="otp-button" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span
            className="login-link"
            onClick={() => navigate("/vendor/register")}
          >
            Sign Up
          </span>
        </p>
      </>
    );
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        )}
        <div id="recaptcha-container"></div>
        <h2 className="login-title">Vendor SignIn</h2>
        {renderStep()}
      </div>
    </div>
  );
};

VendorLogin.propTypes = {
  onClose: PropTypes.func,
};

export default VendorLogin;
