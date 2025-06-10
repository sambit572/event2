import { useState, useEffect } from "react";
import "./LoginRegister.css";
import axios from "axios";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPVerification from "./OTPVerification.jsx";
import PasswordInput from "../../utils/PasswordInput.jsx";

const LoginRegister = ({ onClose }) => {
  const [step, setStep] = useState("form"); // 'form', 'otp', 'success'

  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  useEffect(() => {
    if (step === "success") {
      setShowSuccessIcon(false);

      const iconTimer = setTimeout(() => {
        setShowSuccessIcon(true); // Show success icon after 500ms
      }, 500);

      const closeTimer = setTimeout(() => {
        onClose(); // Close modal after 5 seconds
      }, 5000);

      return () => {
        clearTimeout(iconTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [step, onClose]);

  const renderContent = () => {
    if (step === "success")
      return <SuccessBlock showSuccessIcon={showSuccessIcon} />;
    if (step === "otp") return <OTPVerification setStep={setStep} />;
    return <FormBlock setStep={setStep} onClose={onClose} />;
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {renderContent()}
      </div>
    </div>
  ); // later correct sonarlint
};

LoginRegister.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const SuccessBlock = ({ showSuccessIcon }) => {
  return (
    <div className="success-container">
      <h2 className="success-heading">Congratulations</h2>
      <p>Welcome 🎉 to Eventsbridge</p>

      {showSuccessIcon && <div className="success-icon"></div>}

      <h3 className="success-heading">Thank you!</h3>
      <p className="success-message">
        Your OTP Verification has been completed successfully!
      </p>
    </div>
  );
};

SuccessBlock.propTypes = {
  showSuccessIcon: PropTypes.bool.isRequired,
};

const FormBlock = ({ setStep, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formDataSignUp, setFormDataSignUp] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    phoneNo: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormDataSignUp({ ...formDataSignUp, [e.target.name]: e.target.value });
  };
  const handleChangeLogin = (e) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value });
  };

  // otp logic
  function setupRecaptcha() {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear(); // optional
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
      }
    );
  }

  async function handleGetOTP(e) {
    e.preventDefault();

    const rawPhone = formDataLogin.phoneNo || "";
    const cleanedPhone = rawPhone.replace(/\D/g, "");
    const phoneNumber = "+91" + cleanedPhone;
    if (!phoneNumber) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      setErrorMsg("Enter a valid Indian phone number (e.g. +919123456789)");
      return;
    }

    try {
      // Setup reCAPTCHA (runs once)
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      console.log(phoneNumber);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("OTP sent successfully.");
      // Continue to OTP input step
      setStep("otp");
    } catch (error) {
      console.error("OTP sending failed:", error);
      setErrorMsg("Failed to send OTP. Please try again.");
    }
  }

  // otp logic end here

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register clicked");

    setStep("form");

    setErrorMsg("");
    // Add registration logic here
    try {
      if (formDataSignUp.password !== confirmPassword) {
        return setErrorMsg("Passwords do not match.");
      }
      const response = await axios.post(
        "http://localhost:8000/user/signup",
        formDataSignUp,
        { withCredentials: true }
      );
      console.log(response);
      const { user } = response.data.data;
      if (response.data.message === "user do exist") {
        setErrorMsg("User already exists. Please log in.");
      } else {
        setIsLogin(true);
        localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
        localStorage.setItem("currentlyLoggedIn", "true");
        window.dispatchEvent(new Event("userLoggedIn"));
        navigate("/", { replace: true });
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.message ||
        "something went wrong";

      console.log(error.response);
      console.log(backendMessage);
      setErrorMsg(backendMessage || "Something went wrong.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login clicked");
    setErrorMsg("");
    // Add login logic here
    try {
      if (!formDataLogin.email && !formDataLogin.phoneNo) {
        return setErrorMsg("Enter either email or phone number to log in.");
      }
      const response = await axios.post(
        "http://localhost:8000/user/login",
        {
          email: formDataLogin.email,
          phoneNo: formDataLogin.phoneNo,
          password: formDataLogin.password,
        },
        { withCredentials: true }
      );

      console.log(response.data.data);
      const { user } = response.data.data;
      if (response.status === 200) {
        localStorage.setItem("currentlyLoggedIn", "true");
        localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
        window.dispatchEvent(new Event("userLoggedIn"));
        console.log("Login successfull");
      } else {
        alert(response.data.message);
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
      if (
        error.response?.data?.message == "User does not exist" ||
        error.message == "User does not exist"
      ) {
        setErrorMsg("Please register atleast once before login");
      }
      setErrorMsg(
        `Login failed: May be either password or email is wrong [ ${
          error.response?.data?.message || error.message
        }]`
      );
    }
    onClose();
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      <h2 className="login-title">{isLogin ? "Log In" : "Sign Up"}</h2>

      {isLogin ? (
        <>
          <input
            type="text"
            className="login-input"
            name="phoneNo"
            placeholder="+91 | Enter your phone number"
            value={formDataLogin.phoneNo}
            onChange={handleChangeLogin}
            required
          />

          <button className="otp-button" onClick={handleGetOTP}>
            Get OTP
          </button>

          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Enter email"
            value={formDataLogin.email}
            onChange={handleChangeLogin}
            required
          />
          <PasswordInput
            name="password"
            placeholder="Enter password"
            value={formDataLogin.password}
            onChange={handleChangeLogin}
            required
            minLength={8}
          />

          <Link to="/forgot-password" className="Login-forget-password-link">
            Forgot your password?
          </Link>

          {errorMsg && <p className="error">{errorMsg}</p>}
          <button type="submit" className="otp-button" onClick={handleLogin}>
            Login
          </button>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span
              className="link"
              onClick={() => {
                setIsLogin(false);
                setStep("form");
                setErrorMsg("");
              }}
            >
              Sign Up
            </span>
          </p>
        </>
      ) : (
        <>
          <input
            type="text"
            name="fullName"
            className="login-input"
            placeholder="Enter full name"
            value={formDataSignUp.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Enter email"
            value={formDataSignUp.email}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="phoneNo"
            className="login-input"
            placeholder="+91 | Enter the 10 digit number"
            value={formDataSignUp.phoneNo}
            onChange={handleChange}
            required
          />
          <PasswordInput
            name="password"
            placeholder="Create password"
            value={formDataSignUp.password}
            onChange={handleChange}
            required
            minLength={8}
          />

          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />

          <button type="submit" className="otp-button" onClick={handleRegister}>
            Register
          </button>

          {errorMsg && <p className="error">{errorMsg}</p>}

          <p className="signup-text">
            Already have an account?{" "}
            <span
              className="link"
              onClick={() => {
                setIsLogin(true);
                setStep("form");
                setErrorMsg("");
              }}
            >
              Log In
            </span>
          </p>
        </>
      )}
    </>
  );
};

FormBlock.propTypes = {
  setStep: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginRegister;
