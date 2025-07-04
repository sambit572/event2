import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

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
import CategoryCard from "./components/customer/Home/CategoryCard.jsx";
import ReviewSlider from "./components/customer/Home/ReviewSlider.jsx";
import ServiceDetails from "./pages/customer/ServiceDetails";

import VendorLegalConsent from "./pages/vendor/VendorLegalConsent";
import VendorPayment from "./pages/vendor/VendorPayment";
import VendorThankYou from "./pages/vendor/VendorThankYou";
import VendorRegistration from "./pages/vendor/VendorRegistration";
import VendorService from "./pages/vendor/VendorService";

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

// Vendor Pages
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";

// Common
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ScrollToTop from "./components/common/ScrollToTop";
import BackToTop from "./pages/common/BackToTop";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Hide Footer on specific pages
  const pagesWithoutFooter = ["/vendor/thank-you", "/admin", "/dashboard","/profile"];

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

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    // Re-enable body scroll
    document.body.classList.remove("modal-open");
  };

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/admin" && (
        <Navbar
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
      )}

      <ScrollToTop />
      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<ServiceList />} />
          <Route path="/categories" element={<CategoryCard />}></Route>
          <Route path="/reviews" element={<ReviewSlider />} />
          <Route path="/category/service" element={<ServiceDetails />} />
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
          <Route path="/dashboardservices" element={<DashboardServices />} />

          {/* Vendor Routes */}
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/category/VendorService" element={<VendorService />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route
            path="/vendor/legal-consent"
            element={<VendorLegalConsent />}
          />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />
          <Route path="/dashboard" element={<DashBoardMain />} />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />

          {/* Misc */}
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/userdetails" element={<UserDetails />}></Route>
          <Route path="/pop-up" element={<PopUp />}></Route>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <BackToTop />
      <Chatbot />

      {/* Conditionally render Footer */}
      {!pagesWithoutFooter.includes(location.pathname) && <Footer />}

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
    </>
  );
};

export default App;