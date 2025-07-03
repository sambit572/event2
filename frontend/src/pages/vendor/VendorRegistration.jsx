import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepProgress from "./StepProgress";
import "./VendorRegistration.css";
import axios from "axios";
import Spinner from "./../../components/common/Spinner";

export default function VendorRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = location.state?.apiResponse?.vendor?.id || 
  sessionStorage.getItem('vendor_id');

  const saveFormData = (stepNumber, data) => {
    sessionStorage.setItem(`vendor_step_${stepNumber}`, JSON.stringify(data));
  };
  
  const loadFormData = (stepNumber) => {
    const saved = sessionStorage.getItem(`vendor_step_${stepNumber}`);
    return saved ? JSON.parse(saved) : {};
  };

  
 const [form, setForm] = useState(() => {
  const savedData = loadFormData(1);
  return {
    fullName: savedData.fullName || "",
    email: savedData.email || "",
    phone: savedData.phone || "",
    password: savedData.password || "",
    confirmPassword: savedData.confirmPassword || "",
    profilePic: savedData.profilePic || "",
  };
});

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add this after your last useState
useEffect(() => {
  const timeoutId = setTimeout(() => {
    saveFormData(1, form);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [form]);


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
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    setLoading(true);

    
    try {
      if (form.confirmPassword !== form.password) {
        setError("Password not matching");
      }

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phoneNumber", form.phone);
      formData.append("password", form.password);

      if (form.profilePic) {
        formData.append("profilePicture", form.profilePic); // file appended
      }

      const response = await axios.post(
        "http://localhost:8000/vendors/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // important
          },
        }
      );
      
      console.log("Registration successful:", response.data);
      saveFormData(1, form);

      navigate("/category/VendorService", {
        state: {
          currentStep: 1,
          vendorData: form,
          apiResponse: response.data,
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);

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
    setIsLoading(false);
  };


  const StepIndex = location.state?.currentStep || 0;

  return (
    <>
      <StepProgress currentStep={0} />
      {isLoading && <Spinner />}
      <div className="vendor-register-page">
        {/* Progress Bar */}

        {/* Main white box container */}
        <div className="vendor-register-container">
          <div className="vendor-register-content">
            {/* Left: Registration Form */}
            <form className="vendor-register-form" onSubmit={handleSubmit}>
              <h2>Create Vendor Account</h2>
              <p>Welcome! Please fill in the details to register.</p>

              {/* error message */}
              {error && (
                <div
                  style={{
                    color: "red",
                    backgroundColor: "#ffebee",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "15px",
                  }}
                >
                  {error}
                </div>
              )}

            {/*   <div className="social-signup-row">
                <div className="google-signup-btn">
                  <img src="/GoogleImg.png" alt="Google Icon" />
                  <span>Sign up with Google</span>
                </div>
              </div> */}

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
                disabled={isEditMode}
                style={isEditMode ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              />

              <label>
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="text"
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
              <video src="/New Video.mp4" autoPlay muted loop playsInline />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
