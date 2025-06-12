import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStepProgress from "./RegisterStepProgress";
import "./VendorRegistration.css";
import axios from "axios";

export default function VendorRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  //Basic validation function
  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  // Handle form submission with axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true); 

    try {
      
      const response = await axios.post('http://localhost:8000/vendor/register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      
      });

      // SUCCESS: API call worked
      console.log("Registration successful:", response.data);
      
      // Navigate to next step with the response data
      navigate("/category/VendorService", {
        state: {
          currentStep: 1,
          vendorData: form,
          apiResponse: response.data, // Pass API response if needed
        },
      });

    } catch (error) {
      // ERROR: API call failed
      console.error("Registration failed:", error);
      
      // error message
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.");
      } else if (error.response?.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false); 
    }
  };

  const currentStepIndex = location.state?.currentStep || 0;

  return (
    <div className="vendor-register-page">
      {/* Progress Bar */}
      <RegisterStepProgress currentStepIndex={currentStepIndex} />

      {/* Main white box container */}
      <div className="vendor-register-container">
        <div className="vendor-register-content">
          {/* Left: Registration Form */}
          <form className="vendor-register-form" onSubmit={handleSubmit}>
            <h2>Create Vendor Account</h2>
            <p>Welcome! Please fill in the details to register.</p>

            {/* error message */}
            {error && (
              <div style={{ 
                color: 'red', 
                backgroundColor: '#ffebee', 
                padding: '10px', 
                borderRadius: '4px', 
                marginBottom: '15px' 
              }}>
                {error}
              </div>
            )}

            <div className="social-signup-row">
              <div className="google-signup-btn">
                <img src="/GoogleImg.png" alt="Google Icon" />
                <span>Sign up with Google</span>
              </div>
            </div>

            <label>
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <label>
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label>
              Password <span className="required-star">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <img
                src={showPassword ? "/hide.png" : "/view.png"}
                alt={showPassword ? "Hide password" : "Show password"}
                onClick={togglePasswordVisibility}
              />
            </div>

            <label>
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword" 
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <img
                src={showPassword ? "/hide.png" : "/view.png"}
                alt={showPassword ? "Hide password" : "Show password"}
                onClick={togglePasswordVisibility}
              />
            </div>

            <label>Profile Picture (Optional)</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
            />

            {/* UPDATED: Button shows loading state */}
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Next"}
            </button>
          </form>

          {/* Right: Animation */}
          <div className="vendor-animation-container">
            <video src="/Animation.mp4" autoPlay muted loop playsInline />
          </div>
        </div>
      </div>
    </div>
  );
}