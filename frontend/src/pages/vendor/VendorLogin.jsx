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
import { BACKEND_URL } from "../../utils/constant.js";
import { RxCross2 } from "react-icons/rx";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      document.getElementById("footer")?.classList.add("hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.getElementById("footer")?.classList.remove("hidden");

      // ✅ Navigate to home only if not going to /vendor/register
      if (window.location.pathname !== "/vendor/register") {
        navigate("/");
      }
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.getElementById("footer")?.classList.remove("hidden");
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


      window.dispatchEvent(new Event("userLoggedIn"));
      setStep("success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg === "User does not exist"
        ? "Please register before login."
        : `Login failed: ${msg}`);
    }
  }

  const renderStep = () => {
    if (step === "success") return <SuccessBlock showSuccessIcon={showSuccessIcon} />;
    if (step === "otp") return <OTPVerification setStep={setStep} />;

    return (
      <form onSubmit={handleLogin} className="space-y-4 w-full relative">
        <input
          type="text"
          name="phoneNo"
          placeholder="+91 | Phone Number"
          value={formData.phoneNo}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
        />
        <button
          type="button"
          onClick={handleGetOTP}
          className="w-[340px] ml-1.5 bg-yellow-500 text-[#001f3f] font-semibold py-2 rounded-md transition"
        >
          Send OTP
        </button>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            className="w-full border border-gray-300 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="text-right text-sm">
          <a href="/vendor/forgot-password" className="text-blue-600 hover:underline">
            Forgot Your Password?
          </a>
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          className="w-[340px] ml-1.5 bg-yellow-500 text-[#001f3f] font-semibold py-2 rounded-md hover:bg-yellow-550 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-[#001f3f]">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              setIsOpen(false);
              navigate("/vendor/register");
            }}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-[#ededde] rounded-lg shadow-lg p-6 w-[400px] h-[475px] mt-14 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-[#001f3f] text-2xl cursor-pointer"
        >
          <RxCross2 />
        </span>

        <div id="recaptcha-container" />
        <h2 className="text-2xl font-semibold text-center text-[#001f3f] mb-4">
          Vendor Login
        </h2>

        {renderStep()}
      </div>
    </div>
  );
};

export default VendorLogin;
