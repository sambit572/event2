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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        formData,
        { withCredentials: true }
      );

      if (response?.data?.message === "user do exist") {
        setErrorMsg("User already exists. Please log in.");
        setLoading(false);
        return;
      }

      const { user } = response?.data?.data;

      // Save user to Redux & localStorage
      dispatch(setUser(user));
      localStorage.setItem("userFirstName", user?.fullName?.split(" ")[0] || "");
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
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="fullName"
          className="login-input"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          className="login-input"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="phoneNo"
          className="login-input"
          placeholder="+91 | Enter the 10 digit number"
          value={formData.phoneNo}
          onChange={handleChange}
          required
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
            className="w-full px-2 pr-10 py-2 border border-[#001f3f] rounded-md focus:outline-none"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="relative w-full mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            className="w-full px-2 pr-10 py-2 border border-[#001f3f] rounded-md focus:outline-none"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit" className="otp-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <span
            className="login-link text-blue-600 cursor-pointer hover:underline underline-offset-2"
            onClick={onSwitchToLogin}
          >
            Log In
          </span>
        </p>
      </form>
    );
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal max-w-[420px] border border-blue-500 bg-white px-[30px] py-[20px]" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        )}
        <h2 className="login-title">Sign Up</h2>
        {renderStep()}
      </div>
    </div>
  );
};

Register.propTypes = {
  onClose: PropTypes.func,
  onSwitchToLogin: PropTypes.func,
};

export default Register;
