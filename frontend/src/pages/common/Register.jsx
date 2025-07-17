import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../../utils/PasswordInput.jsx";
import "./LoginRegister.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice.js";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = ({ onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        formData,
        { withCredentials: true }
      );

      const user = response.data.data;
      console.log(user);

      dispatch(setUser(user));

      if (response.data.message === "user do exist") {
        setErrorMsg("User already exists. Please log in.");
      } else {
        let userFirstName;

        if (user.fullName.length == 1) {
          userFirstName = user.fullName;
        } else {
          userFirstName = user.fullName.split(" ")[0];
        }

        localStorage.setItem("userFirstName", userFirstName);
        localStorage.setItem("currentlyLoggedIn", "true");
        window.dispatchEvent(new Event("userLoggedIn"));
        onClose();
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        )}

        <h2 className="login-title">Sign Up</h2>

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

          {/* <PasswordInput
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
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

          {/* <PasswordInput
            name="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          /> */}
          <div className="relative w-full mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
              className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {errorMsg && <p className="error">{errorMsg}</p>}

          <button type="submit" className="otp-button">
            Register
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <span className="login-link" onClick={onSwitchToLogin}>
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {

  onClose: PropTypes.func,
  onSwitchToLogin: PropTypes.func,
};

export default Register;
