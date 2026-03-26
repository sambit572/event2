// Register.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./LoginRegister.css";
import SuccessBlock from "./SuccessBlock.jsx";

const Register = ({ onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState("form"); // form or success
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  // Show success icon and auto-close modal
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-side validation
    if (!formData.fullName.trim()) return setErrorMsg("Full name is required.");
    if (!formData.email.trim()) return setErrorMsg("Email is required.");
    if (!formData.phoneNo.trim() || formData.phoneNo.length !== 10)
      return setErrorMsg("Enter a valid 10-digit phone number.");
    if (formData.password.length < 8)
      return setErrorMsg("Password must be at least 8 characters long.");
    if (formData.password !== confirmPassword)
      return setErrorMsg("Passwords do not match.");

    try {
      setLoading(true);
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${BACKEND_URL}/user/signup`,
        formData,
        { withCredentials: true }
      );

      if (response?.data?.statusCode === 400 || response?.data?.message === "User already exists") {
        setErrorMsg("User already exists. Please log in.");
        setLoading(false);
        return;
      }

      const { user } = response?.data?.data;

      // Save user to Redux & localStorage
      dispatch(setUser(user));
      localStorage.setItem(
        "userFirstName",
        user?.fullName?.split(" ")[0] || ""
      );
      localStorage.setItem("currentlyLoggedIn", "true");

      // Notify other components & show success
      window.dispatchEvent(new Event("userLoggedIn"));
      setStep("success");
    } catch (error) {
      console.error("Registration error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong during registration.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === "success") {
      return <SuccessBlock showIcon={showSuccessIcon} onClose={onClose} />;
    }
    return (
      <form
        onSubmit={handleRegister}
        className="space-y-4 w-full max-w-md mx-auto"
      >
        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all"
        />

        {/* Phone */}
        <input
          type="number"
          name="phoneNo"
          placeholder="Phone Number"
          value={formData.phoneNo}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
            className="w-full px-4 py-3 pr-10 rounded-xl bg-white/80 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            className="w-full px-4 py-3 pr-10 rounded-xl bg-white/80 border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 cursor-pointer"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {errorMsg && (
          <p className="text-center text-red-500 text-sm font-medium animate-pulse">
            {errorMsg}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={onSwitchToLogin}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </form>
    );
  };

  return (
    <div
      className="login-wrapper  h-[90vh] flex items-center justify-center z-[9999] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-0 login-modal lg:h-[90vh] sm:h-0 max-w-3xl  flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/20"
      >
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gradient-to-b from-purple-800 via-indigo-900 to-black p-3 overflow-hidden">
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
                Join EventsBridge !
              </h2>
              <p className="text-indigo-100 text-[14px] leading-relaxed">
                Discover, book, and experience unforgettable event services —
                all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-indigo-50 p-4 md:p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-indigo-600 transition-all hover:rotate-90"
            >
              ×
            </button>
          )}
          <h2 className="text-center text-3xl font-extrabold text-indigo-900 mb-6">
            Create Account
          </h2>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  onClose: PropTypes.func,
  onSwitchToLogin: PropTypes.func,
};

export default Register;
