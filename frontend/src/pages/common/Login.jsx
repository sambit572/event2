// Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import OTPVerification from "./OTPVerification.jsx";
import SuccessBlock from "./SuccessBlock.jsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";
import ForgotPass from "./../customer/ForgotPass";
import { FiEyeOff, FiEye } from "react-icons/fi";
import Spinner from "./../../components/common/Spinner";
import { Seo } from "../../seo/seo.js";
let firebaseAuthCache = null;

async function loadFirebaseAuth() {
  if (!firebaseAuthCache) {
    const [{ getFirebaseAuth }, authModule] = await Promise.all([
      import("../../utils/firebase.js"), // your new firebaseAuth file
      import("firebase/auth"),
    ]);

    const auth = await getFirebaseAuth();

    firebaseAuthCache = {
      auth,
      RecaptchaVerifier: authModule.RecaptchaVerifier,
      signInWithPhoneNumber: authModule.signInWithPhoneNumber,
    };
  }

  return firebaseAuthCache;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = ({ onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [formData, setFormData] = useState({
    phoneNo: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const recaptchaVerifierRef = useRef(null);

  // Initialize reCAPTCHA
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { auth, RecaptchaVerifier } = await loadFirebaseAuth();

        if (cancelled || recaptchaVerifierRef.current) return;

        const verifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("Enterprise reCAPTCHA passed", response);
            },
            "expired-callback": () => {
              verifier.clear();
              recaptchaVerifierRef.current = null;
            },
          },
          { type: "recaptcha-enterprise" }
        );

        await verifier.render();
        recaptchaVerifierRef.current = verifier;
      } catch (err) {
        setErrorMsg("Enterprise reCAPTCHA failed to load.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleGetOTP(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const phone = formData.phoneNo.replace(/\D/g, "");
    const phoneNumber = "+91" + phone;

    if (!recaptchaVerifierRef.current) {
      setIsLoading(false);
      return setErrorMsg("ReCAPTCHA is not ready. Please wait...");
    }

    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      setIsLoading(false);
      return setErrorMsg("Invalid Indian phone number.");
    }

    try {
      const { auth, signInWithPhoneNumber } = await loadFirebaseAuth();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifierRef.current
      );

      window.confirmationResult = confirmationResult;
      setStep("otp");
    } catch (err) {
      console.error("OTP error:", err);
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setErrorMsg("OTP send failed. Check number or reCAPTCHA.");
    }

    setIsLoading(false);
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
      setErrorMsg(
        msg === "User does not exist"
          ? "Please register before login."
          : `Login failed: ${msg}`
      );
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
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
      if (
        err.response?.data?.message === "Phone number is required for new users"
      ) {
        setGoogleCredential(credentialResponse.credential);
        setStep("google-phone");
      } else {
        setErrorMsg("Google login failed. Try again.");
      }
    }
  };

  const handleGooglePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const phone = formData.phoneNo.replace(/\D/g, "");
    const phoneNumber = "+91" + phone;

    if (!formData.phoneNo || !/^\+91\d{10}$/.test(phoneNumber)) {
      return setErrorMsg("Invalid Indian phone number.");
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/user/auth/google`,
        { token: googleCredential, phoneNo: phoneNumber },
        { withCredentials: true }
      );
      const { user } = data.data;
      dispatch(setUser(user));
      localStorage.setItem("currentlyLoggedIn", "true");
      localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
      window.dispatchEvent(new Event("userLoggedIn"));
      setStep("success");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Google signup failed. Try again."
      );
    }
  };

  const renderStep = () => {
    if (step === "success")
      return <SuccessBlock autoCloseTime={3000} onClose={onClose} />;

    if (step === "otp")
      return (
        <OTPVerification
          phoneNum={formData.phoneNo}
          onClose={onClose}
          setStep={setStep}
          type="user"
        />
      );

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
            <input
              type="text"
              name="phoneNo"
              placeholder="+91 | Enter your phone number"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
              Complete Registration
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-sm text-gray-500 mt-2"
            >
              Back to Login
            </button>
          </form>
        </div>
      );
    }

    return (
      <>
        <div className="w-full flex justify-center py-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg("Google login failed.")}
            text="signup_with"
            shape="pill"
            logo_alignment="center"
            width="100%"
          />
        </div>

        <div className="flex items-center my-1">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <input
          type="number"
          name="phoneNo"
          placeholder="+91 | Enter your phone number"
          value={formData.phoneNo}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
        />
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
          onClick={handleGetOTP}
        >
          Send OTP
        </button>
        <div className="flex items-center my-3">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 pr-10 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div
          className="text-right mb-3 text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setShowForgotModal(true)}
        >
          Forgot your password?
        </div>

        {errorMsg && <p className="text-sm text-red-600 mb-3">{errorMsg}</p>}
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
          >
            Sign Up
          </span>
        </p>
      </>
    );
  };

  return (
    <>
      <Seo
        title={"Login to EventsBridge"}
        description={
          "Log in to your Eventsbridge account to manage bookings, vendor services or event plans. Secure access for seamless event coordination."
        }
      />
      <div
        className="login-wrapper  h-[90vh] flex items-center justify-center z-[9999] backdrop-blur-md"
        onClick={onClose}
      >
        {isLoading && <Spinner />}
        <div
          className="p-0 login-modal lg:h-[90vh] sm:h-0 max-w-3xl  flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side - Image + Welcome Message */}
          <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gradient-to-b from-purple-800 via-indigo-900 to-black p-3 overflow-hidden">
            {/* Container to center image and text together */}
            <div className="flex flex-col items-center justify-center text-center space-y-1 z-10">
              {/* Image */}
              <img
                decoding="async"
                loading="lazy"
                src="../new-illustrator.webp"
                alt="Welcome"
                className="h-[60%] w-auto object-contain opacity-95 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              {/* Welcome Text Block */}
              <div className="bg-white/10 backdrop-blur-lg p-3 rounded-xl shadow-lg border border-white/20 max-w-xs">
                <h2 className="text-yellow-300 text-2xl font-bold mb-1 drop-shadow-md">
                  Welcome Back !
                </h2>
                <p className="text-indigo-100 text-[14px] leading-relaxed">
                  Log In to your account and continue exploring endless
                  opportunities with us.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-indigo-50 p-4 md:p-6 relative">
            <div id="recaptcha-container"></div>

            {onClose && (
              <button
                className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-red-500 transition-colors"
                onClick={onClose}
              >
                ×
              </button>
            )}

            <div className="text-center mb-2">
              <h2 className="text-center text-3xl font-extrabold text-indigo-900 mb-2">
                Log In
              </h2>
            </div>

            <div className="space-y-3">{renderStep()}</div>
          </div>
        </div>

        {showForgotModal && (
          <ForgotPass onClose={() => setShowForgotModal(false)} />
        )}
      </div>
    </>
  );
};

Login.propTypes = {
  onClose: PropTypes.func,
  onSwitchToRegister: PropTypes.func,
};

export default Login;
