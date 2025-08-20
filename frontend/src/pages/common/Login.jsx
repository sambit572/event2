import { GoogleLogin } from "@react-oauth/google";
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
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import ForgotPass from "./../customer/ForgotPass";

const Login = ({ onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // 'form', 'otp', 'success', 'google-phone'
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [googleCredential, setGoogleCredential] = useState(null);
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

      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
      localStorage.setItem("userLastName", user.fullName.split(" ")[1]);
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // First attempt without phone number (for existing users)
      const { data } = await axios.post(
        `${BACKEND_URL}/user/auth/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      const { user } = data.data;
      dispatch(setUser(user));

      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
      window.dispatchEvent(new Event("userLoggedIn"));

      setStep("success");
    } catch (err) {
      // If error is about phone number being required for new users
      if (
        err.response?.data?.message === "Phone number is required for new users"
      ) {
        setGoogleCredential(credentialResponse.credential);
        setStep("google-phone");
      } else {
        console.error("Google login failed:", err);
        setErrorMsg("Google login failed. Try again.");
      }
    }
  };

  const handleGooglePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.phoneNo) {
      return setErrorMsg("Phone number is required.");
    }

    const phone = formData.phoneNo.replace(/\D/g, "");
    const phoneNumber = "+91" + phone;

    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      return setErrorMsg("Invalid Indian phone number.");
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/user/auth/google`,
        {
          token: googleCredential,
          phoneNo: phoneNumber,
        },
        { withCredentials: true }
      );

      const { user } = data.data;
      dispatch(setUser(user));

      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
      window.dispatchEvent(new Event("userLoggedIn"));

      setStep("success");
    } catch (err) {
      console.error("Google signup with phone failed:", err);
      const msg =
        err.response?.data?.message || "Google signup failed. Try again.";
      setErrorMsg(msg);
    }
  };

  const renderStep = () => {
    if (step === "success") return <SuccessBlock onClose={onClose} />;

    if (step === "otp") return <OTPVerification setStep={setStep} />;

    if (step === "google-phone") {
      return (
        <div className="w-full max-w-sm mx-auto p-6 rounded-lg shadow-lg bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Almost There!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Please enter your phone number to complete your Google registration.
          </p>

          <form onSubmit={handleGooglePhoneSubmit} className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNo"
                id="phoneNo"
                placeholder="+91 | Enter your phone number"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Complete Registration
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-sm text-white-500  mt-2"
            >
              Back to Login
            </button>
          </form>
        </div>
      );
    }

    return (
      <>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMsg("Google login failed.")}
          text="signup_with"
          shape="rectangular"
          logo_alignment="center"
        />

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

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

        <div
          className="Login-forget-password-link mb-5 cursor-pointer mt-5"
          onClick={() => setShowForgotModal(true)}
        >
          Forgot your password?
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        <button className="otp-button" onClick={handleLogin}>
          Login
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <p className="signup-text">
          Don't have an account?{" "}
          <span
            className="login-link cursor-pointer font-semibold text-blue-600 hover:underline"
            onClick={onSwitchToRegister}
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
};

export default Login;
