import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { getFirebaseAuth } from "../../utils/firebase.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPVerification from "../common/OTPVerification.jsx";
import SuccessBlock from "../common/SuccessBlock.jsx";
import axios from "axios";
import "../common/LoginRegister.css";
import { useDispatch, useSelector } from "react-redux";
import { setVendor } from "../../redux/VendorSlice.js";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import VendorForgotPass from "./VendorForgetPass.jsx"; //  NEW
import { BACKEND_URL } from "../../utils/constant.js";

const VendorLogin = ({ onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const auth = getFirebaseAuth();
  const [formData, setFormData] = useState({
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useSelector((state) => state.user);
  console.log("Current user in login:", user);
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
      document.body.classList.remove("overflow-hidden");
      document.getElementById("footer")?.classList.remove("hidden");
    };
  }, []);

  useEffect(() => {
    if (step === "success") {
      setShowSuccessIcon(false);
      const iconTimer = setTimeout(() => setShowSuccessIcon(true), 500);
      const closeTimer = setTimeout(() => onClose?.(), 3000);
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
    if (!/^\+91\d{10}$/.test(phoneNumber))
      return setErrorMsg("Invalid Indian phone number.");

    try {
      setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("OTP sent successfully : ", confirmationResult);
      setStep("otp");
    } catch (err) {
      setErrorMsg("OTP send failed. Try again.");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    console.log("user", user);
    if (!user) {
      console.log("userInside", !user);
      toast("Please login as a user first.", { duration: 2000 });

      return; // stop vendor login here
    }
    if (!formData.email && !formData.phoneNo)
      return setErrorMsg("Enter email or phone to log in.");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/vendors/login`,
        {
          email: formData.email.toLowerCase(),
          phoneNo: formData.phoneNo,
          password: formData.password,
        },
        { withCredentials: true }
      );
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
      localStorage.setItem("vendorId", vendor._id);

      window.dispatchEvent(new Event("userLoggedIn"));
      setStep("success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(
        msg === "User does not exist"
          ? "Please register before login."
          : `Login failed: ${msg}`
      );
    }
  }

  const renderStep = () => {
    if (step === "success")
      return <SuccessBlock showSuccessIcon={showSuccessIcon} />;
    if (step === "otp")
      return (
        <OTPVerification
          setStep={setStep}
          onClose={onClose}
          phoneNum={formData.phoneNo}
          type="vendor"
        />
      );
    if (step === "form") {
      return (
        <form className="flex flex-col w-full space-y-5" onSubmit={handleLogin}>
          {/* Phone Number Input */}
          <div className="relative">
            <input
              type="number"
              name="phoneNo"
              placeholder=" Phone Number"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
            />
          </div>
          <button
            type="button"
            onClick={handleGetOTP}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
          >
            Send OTP
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" Password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 pr-10 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
            >
              Forgot password?
            </span>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm text-center font-medium">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
          >
            Login
          </button>

          <p className="text-center text-gray-700 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => {
                onClose();
                navigate("/vendor/register");
              }}
            >
              Sign Up
            </span>
          </p>
        </form>
      );
    }
    return null;
  };

  const modalContent = (
    <div
      className="login-wrapper h-[90vh] flex items-center justify-center z-[9999] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="p-0 login-modal lg:h-[90vh] sm:h-0 max-w-3xl  flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Image Section */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gradient-to-b from-purple-800 via-indigo-900 to-black p-3 overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center space-y-3 z-10">
            <img
              decoding="async"
              loading="lazy"
              src="../new-illustrator.webp"
              alt="Welcome"
              className="h-[60%] w-auto object-contain opacity-95 drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            />
            <div className="bg-white/10 backdrop-blur-lg p-3 rounded-xl shadow-lg border border-white/20 max-w-xs">
              <h2 className="text-yellow-300 text-2xl font-bold mb-1">
                Welcome Back, Vendor
              </h2>
              <p className="text-indigo-100 text-[14px] leading-relaxed">
                Manage your services, bookings, and customers — all from one
                place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-indigo-50 p-6 relative">
          <button
            className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-red-500 transition"
            onClick={onClose}
          >
            <RxCross2 />
          </button>
          <div id="recaptcha-container"></div>
          <h2 className="text-center text-3xl font-extrabold text-indigo-900 mb-6">
            Vendor Login
          </h2>
          {renderStep()}
        </div>
      </div>

      {showForgotModal && (
        <div onClick={(e) => e.stopPropagation()}>
          <VendorForgotPass onClose={() => setShowForgotModal(false)} />
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

VendorLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func,
};

export default VendorLogin;
