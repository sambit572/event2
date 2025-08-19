import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

import PopUp from "./components/customer/CustomerNegotiationModal";
import VendorResetPassword from "./pages/vendor/VendorResetPass.jsx";

// Vendor Pages
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";
import AddServiceInDashboard from "./components/vendor/AddServiceInDashboard.jsx";

// Common
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import BackToTop from "./pages/common/BackToTop";

import { useDispatch } from "react-redux";
import api from "./utils/api.js"; // ✅ 1. Import 'api' instead of 'axios'
import { setUser } from "./redux/UserSlice.js";
import { setVendor } from "./redux/VendorSlice.js";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AddToCart from "./components/customer/YourCart/AddToCart.jsx";
import DashboardEnforcement from "./utils/DashboardEnforcement.jsx";

//Feedback
import Feedback from "./pages/common/Feedback.jsx";
import FaqSection from "./components/customer/home/FaqSection.jsx";
import ErrorPage from "./pages/common/ErrorPage.jsx";
import ReviewSlider from "./components/customer/home/ReviewSlider.jsx";
import OrderSummary from "./components/customer/YourCart/orderSummary.jsx";

const App = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVendorRegisterModal, setShowVendorRegisterModal] = useState(false);
  const [showVendorLoginModal, setShowVendorLoginModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ 2. Use 'api' to automatically send the token
        const res = await api.get('/user/get-email');
        console.log("in app.jsx user dispatched:", res.data.data);
        dispatch(setUser(res.data.data));
      } catch (err) {
        // This is expected if the user is not logged in, so we don't need to log an error
      }
    };
    // Only check auth if a token exists
    if (localStorage.getItem("userToken")) {
        checkAuth();
    }
  }, [dispatch]);

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        // ✅ 3. Use 'api' to automatically send the token
        const res = await api.get('/vendors/me');
        console.log("Vendor data received:", res.data.data);
        dispatch(setVendor(res.data.data));
      } catch (err) {
        // This is expected if the vendor is not logged in
      }
    };
    if (localStorage.getItem("vendorToken")) { // Assuming you store a vendor token
        checkVendorAuth();
    }
  }, [dispatch]);


  // All your other functions for handling modals, etc. remain here
  // For brevity, I'm omitting them, but you should keep them in your file.
  const handleOpenLogin = () => {
    setShowLoginModal(true);
    document.body.classList.add("modal-open");
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
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
    document.body.classList.remove("modal-open");
  };
  
    const handleOpenVendorRegister = () => {
    setShowVendorRegisterModal(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseVendorModals = () => {
    setShowVendorRegisterModal(false);
    setShowVendorLoginModal(false);
    document.body.classList.remove("modal-open");
  };

  const pagesWithoutFooter = [
    "/vendor/thank-you",
    "/admin",
    "/dashboard",
    "/profile",
    "/reset-password",
  ];


  return (
    <>
      <ScrollToTop />
      {location.pathname !== "/admin" && (
        <Navbar
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onOpenVendorRegister={handleOpenVendorRegister}
          onOpenVendorLogin={handleOpenVendorLogin}
        />
      )}
      <main className="custom-mt mt-[50px] sm:mt-[70px] md:mt-[60px]">
        <Routes>
          {/* ... All your <Route> components ... */}
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<ServiceList onSwitchToLogin={handleOpenLogin} />}/>
          <Route path="/reviews" element={<ReviewSlider />} />
          <Route path="/service/:serviceId" element={<ServiceDetails onSwitchToLogin={handleOpenLogin}/>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          <Route path="/userdetails" element={<ProtectedRoute><UserDetails /></ProtectedRoute>}/>
          <Route path="/vendor/register" element={<ProtectedRoute><VendorRegistration /></ProtectedRoute>}/>
          <Route path="/category/VendorService" element={<VendorService />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route path="/vendor/legal-consent" element={<VendorLegalConsent />} />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />
          <Route path="/dashboard" element={<DashboardEnforcement><DashBoardMain /></DashboardEnforcement>}/>
          <Route path="/vendor/services/addServices" element={<AddServiceInDashboard />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/vendor/reset-password/:resetToken" element={<VendorResetPassword />} />
          <Route path="/your-cart" element={<AddToCart />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />
          <Route path="/faqs" element={<FaqSection />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/pop-up" element={<PopUp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/order-summary" element={<OrderSummary />} />
        </Routes>
      </main>
      <BackToTop />
      <Chatbot />
      {showLoginModal && <Login onClose={handleCloseModals} onSwitchToRegister={handleOpenRegister} />}
      {showRegisterModal && <Register onClose={handleCloseModals} onSwitchToLogin={handleOpenLogin} />}
      {showVendorRegisterModal && <VendorRegistration onClose={handleCloseVendorModals} />}
      {showVendorLoginModal && <VendorLogin onClose={handleCloseModals} onSwitchToLogin={handleOpenVendorLogin} />}
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
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  );
};
export default App;