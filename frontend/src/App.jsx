import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Core Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Chatbot from "./components/common/Chatbot";

// Auth Modals
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Register.jsx";

// Customer Pages
import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import ReviewSlider from "./components/customer/home/ReviewSlider.jsx";
import ServiceDetails from "./pages/customer/ServiceDetails";

import VendorLegalConsent from "./pages/vendor/VendorLegalConsent";
import VendorPayment from "./pages/vendor/VendorPayment";
import VendorThankYou from "./pages/vendor/VendorThankYou";
import VendorRegistration from "./pages/vendor/VendorRegistration";
import VendorService from "./pages/vendor/VendorService";
import VendorLogin from "./pages/vendor/VendorLogin.jsx";

import AboutUs from "./pages/common/AboutUs";
import HelpUs from "./pages/common/HelpUs";
import HelpCenter from "./pages/common/HelpCenter";

import ForgotPass from "./pages/customer/ForgotPass.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";
import Profile from "./components/customer/profile/Profile.jsx";
import UserDetails from "./pages/customer/UserDetails.jsx";
import DashboardServices from "./components/vendor/DashboardServices.jsx";
import PopUp from "./components/customer/CustomerNegotiationModal";
import VendorResetPassword from "./pages/vendor/VendorResetPass.jsx";

// Vendor Pages
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";
import AddServiceInDashboard from "./components/vendor/AddServiceInDashboard.jsx";

// Common
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import BackToTop from "./pages/common/BackToTop";
import FaqSection from "./components/customer/home/FaqSection.jsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/UserSlice.js";
import { setVendor } from "./redux/VendorSlice.js";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AddToCart from "./components/customer/YourCart/AddToCart.jsx";
import ErrorPage from "./pages/common/ErrorPage.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Modal states for user
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Modal states for vendor
  const [showVendorRegisterModal, setShowVendorRegisterModal] = useState(false);
  const [showVendorLoginModal, setShowVendorLoginModal] = useState(false);

  const handleOpenVendorRegister = () => {
    setShowVendorRegisterModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseVendorModals = () => {
    setShowVendorRegisterModal(false);
    setShowVendorLoginModal(false);
    document.body.classList.remove("modal-open");
  };

  // Hide Footer on specific pages
  const pagesWithoutFooter = [
    "/vendor/thank-you",
    "/admin",
    "/dashboard",
    "/profile",
    "/reset-password",
  ];
  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    document.body.classList.add("modal-open");
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
    document.body.classList.add("modal-open");
  };
  const handleOpenVendorLogin = () => {
    setShowVendorLoginModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowVendorLoginModal(false);
    // Re-enable body scroll
    document.body.classList.remove("modal-open");
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const storedVendor = localStorage.getItem("vendor");
    if (storedVendor) {
      dispatch(setVendor(JSON.parse(storedVendor)));
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/get-email`, {
          withCredentials: true,
        });

        // this specific route provide whole user object so nothing to worry

        console.log("in app.jsx user dispatched:", res.data.data);
        dispatch(setUser(res.data.data));
      } catch (err) {
        console.error("Auth check failed:", err.message);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/vendors/me`, {
          withCredentials: true,
        });

        console.log("Vendor data received:", res.data.data);
        dispatch(setVendor(res.data.data));
      } catch (err) {
        console.error("Vendor auth check failed:", err.message);
      }
    };

    checkVendorAuth();
  }, []);

  useEffect(() => {
    const openLoginListener = () => handleOpenLogin();
    window.addEventListener("openLoginModal", openLoginListener);
    return () =>
      window.removeEventListener("openLoginModal", openLoginListener);
  }, []);

  return (
    <>
      <ScrollToTop />
      {/* Conditionally render Navbar */}
      {location.pathname !== "/admin" && (
        <Navbar
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onOpenVendorRegister={handleOpenVendorRegister}
          onOpenVendorLogin={handleOpenVendorLogin}
        />
      )}

      <main className="custom-mt mt-[50px]  sm:mt-[70px] md:mt-[60px]">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/category/:categoryId"
            element={<ServiceList onSwitchToLogin={handleOpenLogin} />}
          />
          {/* <Route path="/categories" element={<CategoryCard />}></Route> */}
          <Route path="/reviews" element={<ReviewSlider />} />
          <Route
            path="/service/:serviceId"
            element={<ServiceDetails onSwitchToLogin={handleOpenLogin} />}
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdetails"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboardservices"
            element={
              <ProtectedRoute>
                <DashboardServices />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes */}

          <Route
            path="/vendor/register"
            element={
              <ProtectedRoute>
                <VendorRegistration />
              </ProtectedRoute>
            }
          />

          <Route path="/category/VendorService" element={<VendorService />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route
            path="/vendor/legal-consent"
            element={<VendorLegalConsent />}
          />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />

          <Route path="/dashboard" element={<DashBoardMain />} />
          {/* <Route path="/vendor-login" element={<VendorLogin />} /> */}
          <Route
            path="/vendor/services/addServices"
            element={<AddServiceInDashboard />}
          />

          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/vendor/reset-password/:resetToken"
            element={<VendorResetPassword />}
          />

          {/* Misc */}
          <Route path="/your-cart" element={<AddToCart />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />
          <Route path="/faqs" element={<FaqSection />} />
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/userdetails" element={<UserDetails />}></Route>
          <Route path="/pop-up" element={<PopUp />}></Route>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <BackToTop />
      <Chatbot />

      {/* Auth Modals */}
      {showLoginModal && (
        <Login
          onClose={handleCloseModals}
          onSwitchToRegister={handleOpenRegister}
        />
      )}

      {showRegisterModal && (
        <Register
          onClose={handleCloseModals}
          onSwitchToLogin={handleOpenLogin}
        />
      )}

      {showVendorRegisterModal && (
        <VendorRegistration onClose={handleCloseVendorModals} />
      )}

      {showVendorLoginModal && (
        <VendorLogin
          onClose={handleCloseModals}
          onSwitchToLogin={handleOpenVendorLogin}
        />
      )}
      {/* Conditionally render Footer */}
      {!pagesWithoutFooter.includes(location.pathname) && <Footer />}
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            padding: "16px",
            color: "#fff",
            background: "#1f2937",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
};

export default App;
