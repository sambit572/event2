import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// Core Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Chatbot from "./components/common/Chatbot";

// Auth Modals
import Login from "./pages/common/Login.jsx";
import Register from "./pages/common/Resgister.jsx";

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
import ForgotPassword from "./pages/customer/ForgotPassword.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";
import Profile from "./components/customer/profile/Profile.jsx";
import UserDetails from "./pages/customer/UserDetails.jsx";
import DashboardServices from "./components/vendor/DashboardServices.jsx";

// Vendor Pages

import DashBoardMain from "./components/vendor/DashBoardMain.jsx";

// Common
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";

const App = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar /> 

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<ServiceList />} />
          <Route path="/categories" element={<CategoryCard />}></Route>
          <Route path="/reviews" element={<ReviewSlider />} />
          <Route path="/category/service" element={<ServiceDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userdetails" element={<UserDetails />} />
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

          {/* Auth Routes */}
          <Route
            path="/login"
            element={<Login onClose={() => navigate(-1)} />}
          />
          <Route
            path="/register"
            element={<Register onClose={() => navigate(-1)} />}
          />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* Misc */}
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />

        </Routes>
      </main>

      <Chatbot />
      <Footer />
    </>
  );
};

export default App;
