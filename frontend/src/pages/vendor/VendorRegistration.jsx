import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVendor } from "../../redux/VendorSlice";
import StepProgress from "./StepProgress";
import VendorAutoFillConfirmModal from "../../components/vendor/VendorAutoFillConfirmModal";
import Spinner from "./../../components/common/Spinner";
import axios from "axios";
import laptopBackground from "/vendorRegistration/laptop_background.webp";
import { Seo } from "../../seo/seo";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const VendorRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [isLoading, setIsLoading] = useState(false);
  const [showAutofillModal, setShowAutofillModal] = useState(false);
  const [hasAutofilled, setHasAutofilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

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

  // Basic validation function
  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(form.email)) {
      setError("Invalid email! First letter must be lowercase.");
      return false;
    }

    const domain = form.email.split("@")[1];

    // 2. common typo detection
    const typoDomains = [
      "mail.com",
      "gmal.co",
      "gmal.con",
      "gmal.cm",

      "gmal.com",
      "gmial.com",
      "gmai.com",
      "gamil.com",
      "gmil.com",
      "gmaill.com",
      "gmailc.om",
      "gmail.con",
      "gmail.cm",
      "gmail.coom",
      "gmail.comm",
      "gmail.cmo",
      "gmail.om",
      "gmail.ocm",
      "gmsil.com",
      "gmaul.com",
      "gmqil.com",
      "gmakl.com",
      "gmail.co",
    ];

    if (typoDomains.includes(domain)) {
      setError("Email domain looks misspelled.");
      return false;
    }

    // 4. disposable email block
    const bannedDomains = [
      "mailinator.com",
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
      "throwawaymail.com",
    ];

    if (bannedDomains.includes(domain)) {
      setError("Disposable email addresses are not allowed.");

      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    setError("");
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
        setLoading(false);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phoneNumber", form.phone);
      formData.append("password", form.password);

      if (form.profilePic) {
        formData.append("profilePicture", form.profilePic);
      }

      const response = await axios.post(
        `${BACKEND_URL}/vendors/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Registration successful:", response.data);

      dispatch(setVendor(response.data.data));
      console.log("Vendor data set in Redux:", response.data.data);

      const vendor = response.data.data;

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
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setForm((prev) => ({
      ...prev,
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phoneNo || "",
    }));
    setHasAutofilled(true);
    setShowAutofillModal(false);
  };

  const handleDecline = () => {
    setShowAutofillModal(false);
    setHasAutofilled(true);
  };

  useEffect(() => {
    if (user && user.email && !hasAutofilled) {
      console.log("✅ Showing modal for autofill");
      setShowAutofillModal(true);
    } else {
      console.log("❌ Modal not shown. Either user null or already autofilled");
    }
  }, [user, hasAutofilled]);

  // Icon for password visibility toggle
  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
  const EyeSlashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228"
      />
    </svg>
  );

  return (
    <>
      <Seo
        title={"Register as a Vendor"}
        description={
          "Register as a vendor on Eventsbridge and connect with our platform. Sign up to offer your services and grow your business via our event platform."
        }
      />
      <div>
        {showAutofillModal && (
          <VendorAutoFillConfirmModal
            onAccept={handleAutofill}
            onDecline={handleDecline}
          />
        )}

        <StepProgress currentStep={0} />
        {isLoading && <Spinner />}

        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-2xl overflow-hidden">
            {/* LEFT SIDE: Form area - Full width on mobile */}
            <div
              className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${laptopBackground})`,
              }}
            >
              <div className="absolute inset-0 bg-black/30 "></div>
              <div className="relative z-10 w-full max-w-md">
                {/* Changed from bg-stone-100/95 to bg-stone-100/75 for more transparency */}
                <div className="bg-stone-100/65 backdrop-blur-md rounded-xl shadow-lg p-8">
                  <div className="flex flex-col gap-4">
                    <div className="text-left">
                      <h2 className="text-3xl font-bold text-gray-800">
                        Create Vendor Account
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Welcome! Please fill in the details to register.
                      </p>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div
                        className="bg-red-100/90 border-l-4 border-red-500 text-red-700 p-4 rounded-md backdrop-blur-sm"
                        role="alert"
                      >
                        <p>{error}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full p-3 pr-12 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center"
                        >
                          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="w-full p-3 pr-12 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center"
                        >
                          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture (Optional)
                      </label>
                      <input
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Registering..." : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Branding area - Hidden on mobile */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-white flex-col items-center justify-center text-center p-8 relative">
              {/* Placeholder for the illustrated image */}
              <div className="w-full max-w-sm mt-[-80px] ml-10">
                <img
                  decoding="async"
                  loading="lazy"
                  src="../new-illustrator.png"
                  alt="Registration Illustration"
                  className="w-full h-auto object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-[-10px] ">
                Register Here
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Join EventsBridge, your one-stop platform for discovering and
                booking trusted vendors, planning events, and creating
                unforgettable experiences. We make event planning simple, fast,
                and hassle-freeregister today and take the first step toward
                smarter celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Main App component to render the registration page
export default function App() {
  return <VendorRegister />;
}
