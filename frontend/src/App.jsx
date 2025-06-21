import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";

import ServiceDetails from "./pages/customer/ServiceDetails";

import VendorLegalConsent from "./pages/vendor/VendorLegalConsent";
import VendorPayment from "./pages/vendor/VendorPayment";
import VendorThankYou from "./pages/vendor/VendorThankYou";
import VendorRegistration from "./pages/vendor/VendorRegistration";

import Footer from "./components/common/Footer";
import LoginRegister from "./pages/common/LoginRegister";
import Navbar from "./components/common/Navbar";

import VendorService from "./pages/vendor/VendorService";


import Chatbot from "./components/common/Chatbot";
import AboutUs from "./pages/common/AboutUs";

import ForgotPass from "./pages/customer/ForgotPass.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";
import Profile from "./components/customer/profile/Profile.jsx";
import UserDetails from "./pages/customer/UserDetails.jsx";

import Wishlist from "./pages/customer/Wishlist.jsx";
import DashboardServices from "./pages/customer/DashboardServices";
import ForgotPassword from "./pages/customer/ForgotPassword";
import ReviewSlider from "./components/customer/Home/ReviewSlider.jsx";
import CategoryCard from "./components/customer/Home/CategoryCard.jsx";

const App = () => {


  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/category" element={<ServiceList />} />
          <Route path="/categories" element={<CategoryCard/>}></Route>
          <Route path="/reviews" element={<ReviewSlider />} />
          <Route path="/category/service" element={<ServiceDetails />} />
          <Route path="/LoginRegister" element={<LoginRegister />}></Route>

          {/* Vendor Routes */}
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/category/VendorService" element={<VendorService />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route
            path="/vendor/legal-consent"
            element={<VendorLegalConsent />}
          />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />

          {/* a */}
          <Route path="/forgot-password" element={<ForgotPass />}></Route>
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/dashboard" element={<DashBoardMain />}></Route>
          <Route path="/about_us" element={<AboutUs />} />

          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
          <Route
            path="/dashboardservices"
            element={<DashboardServices />}
          ></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/userdetails" element={<UserDetails />}></Route>
        </Routes>
      </main>
      {/* {shouldShowFooter && <Footer />} */}

      <Chatbot />

      <Footer />
    </>
  );
};

export default App;
