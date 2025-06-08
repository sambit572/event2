import React, { useState } from "react";
import RegisterStepProgress from "./RegisterStepProgress"; 
import "./VendorRegistration.css";

export default function VendorRegister() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
  };

  const currentStepIndex = location.state?.currentStep || 0; // Default to step 1

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

            <div className="social-signup-row">
              <div className="google-signup-btn">
                <img src="/google.png" alt="Google Icon" />
                <span>Sign up with Google</span>
              </div>

              {/* <div className="apple-signup-btn">
                <img src="/apple-logo.png" alt="Apple Icon" />
                <span>Sign up with Apple</span>
              </div> */}
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

            <label>Profile Picture (Optional)</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
            />

            <button type="submit">Next</button>
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
