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
import { FiEyeOff, FiEye } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { BACKEND_URL } from "../../utils/constant.js";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({ phoneNo: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      document.getElementById("footer")?.classList.add("hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.getElementById("footer")?.classList.remove("hidden");
      if (window.location.pathname !== "/vendor/register") {
        navigate("/");
      }
    }
    return () => {
    };
  }, [isOpen, navigate]);

  useEffect(() => {
    if (step === "success") {
      setShowSuccessIcon(false);
      const iconTimer = setTimeout(() => setShowSuccessIcon(true), 500);
      const closeTimer = setTimeout(() => setIsOpen(false), 5000);
      return () => {
        clearTimeout(iconTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function setupRecaptcha() {
    if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("Recaptcha passed"),
    });
  }

  async function handleGetOTP(e) {
    e.preventDefault();
    const phone = formData.phoneNo.replace(/\D/g, "");
    const phoneNumber = "+91" + phone;
    if (!/^\+91\d{10}$/.test(phoneNumber)) return setErrorMsg("Invalid Indian phone number.");

    try {
      setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setStep("otp");
    } catch (err) {
      setErrorMsg("OTP send failed. Try again.");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.email && !formData.phoneNo) return setErrorMsg("Enter email or phone to log in.");

    try {
      const res = await axios.post(`${BACKEND_URL}/vendors/login`, formData, { withCredentials: true });
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
      if (profilePic) localStorage.setItem("VendorProfilePic", profilePic);

      window.dispatchEvent(new Event("userLoggedIn"));
      setStep("success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg === "User does not exist" ? "Please register before login." : `Login failed: ${msg}`);
    }
  }

  const renderStep = () => {
    if (step === "success") return <SuccessBlock showSuccessIcon={showSuccessIcon} />;
    if (step === "otp") return <OTPVerification setStep={setStep} />;
    if (step === "form") {
      return (
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="number"
            name="phoneNo"
            placeholder="+91 | Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            className="login-input"
          />
          <button type="button" onClick={handleGetOTP} className="otp-button">
            Send OTP
          </button>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />

          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
              className="w-full px-4 pr-10 py-2 border border-[#001f3f] rounded-md focus:outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="Login-forget-password-link ">
            <a href="/vendor/forgot-password">Forgot your password?</a>
          </div>

          {errorMsg && <p className="error">{errorMsg}</p>}

          <button type="submit" className="otp-button">Login</button>

          <p className="signup-text">
            Don’t have an account? <span className="login-link" onClick={() => { setIsOpen(false); navigate("/vendor/register"); }}>Sign Up</span>
          </p>
        </form>
      );
    }
    return null;
  };

  return step === "success" ? (
    <div className="login-wrapper"><SuccessBlock showSuccessIcon={showSuccessIcon} /></div>
  ) : (
    isOpen && (
      <div className="login-wrapper" onClick={() => setIsOpen(false)}>
        <div className="login-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setIsOpen(false)}><RxCross2 /></button>
          <div id="recaptcha-container"></div>
          <h2 className="login-title">Vendor Login</h2>
          {renderStep()}
        </div>
      </div>
    )
  );
};

VendorLogin.propTypes = {};
export default VendorLogin;
