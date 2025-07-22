import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPVerification from "./OTPVerification.jsx";
import PasswordInput from "../../utils/PasswordInput.jsx";
import { FiEyeOff, FiEye } from "react-icons/fi";
import SuccessBlock from "./SuccessBlock.jsx";
import axios from "axios";
import "./LoginRegister.css";
import ForgotPass from "../../pages/customer/ForgotPass.jsx";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = ({ onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // 'form', 'otp', 'success'
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (showForgotModal) {
      setStep("form");
    }
  }, [showForgotModal]);

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
        `${BACKEND_URL}/user/login`,
        {
          email: formData.email,
          phoneNo: formData.phoneNo,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const { user } = res.data.data;
      dispatch(setUser(user));
      const fullName = user.fullName || "";
      const firstName = fullName.split(" ")[0];
      const firstLetter = firstName?.charAt(0).toUpperCase() || "";
      const profilePic = user.profilePic || "";

      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
      window.dispatchEvent(new Event("userLoggedIn"));

      setStep("success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg === "User does not exist") {
        setErrorMsg("Please register before login.");
      } else {
        setErrorMsg(`Login failed: ${msg}`);
      }
    }
  }

  const renderStep = () => {
    if (step === "success")
      return <SuccessBlock showSuccessIcon={showSuccessIcon} />;
    if (step === "otp") return <OTPVerification setStep={setStep} />;

    return (
      <>
        <input
          type="number"
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

        {/* <PasswordInput
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
        /> */}

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
            className="w-full px-2 pr-10 py-2 border border-[#001f3f] rounded-md focus:outline-none"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="Login-forget-password-link mb-5  mt-5">
          <span
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => {
              setShowForgotModal(true);
              setStep("form");
            }}
          >
            Forgot your password?
          </span>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        <button className="otp-button" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span className="login-link cursor-pointer font-semibold text-blue-600 hover:underline" onClick={onSwitchToRegister}>
            Sign Up
          </span>
        </p>

      </>
    );
  };

  return (
    <div
      className="login-wrapper"
      onClick={(e) => {
        if (e.target.classList.contains("login-wrapper")) {
          onClose?.();
        }
      }}
    >
      <div className="login-modal">
        {onClose && (
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        )}
        <div id="recaptcha-container"></div>
        <h2 className="login-title">Log In</h2>
        {renderStep()}
      </div>

      {showForgotModal && (
        <ForgotPass onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
};

Login.propTypes = {
  onClose: PropTypes.func,
  onSwitchToRegister: PropTypes.func,
};

export default Login;
