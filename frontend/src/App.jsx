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
// import Navbar from "./components/customer/Navbar";

import Chatbot from "./components/common/Chatbot";
import AboutUs from "./pages/common/AboutUs";

import ForgotPass from "./pages/customer/ForgotPass.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";
import Profile from "./components/customer/profile/Profile.jsx";
import UserDetails from "./pages/customer/UserDetails.jsx";

import Wishlist from "./pages/customer/Wishlist";
import DashboardServices from "./pages/customer/DashboardServices";
import ForgotPassword from "./pages/customer/ForgotPassword";

const App = () => {
  /*{ const location = useLocation();

  // Define routes where you want to hide the navbar
  const hideNavbarRoutes = [
    "/vendor/legal-consent",
    "/category/VendorService",
    "/vendor/payment-info",
    "/vendor/thank-you",
    "/vendor/register"
  ];
  const hideFooterRoutes = [
    "/vendor/legal-consent",
    "/category/VendorService",
    "/vendor/payment-info",
    "/vendor/thank-you",
    "/vendor/register"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname); }*/

  return (
    <>
      <Navbar />

      {/* {shouldShowNavbar && <Navbar />} */}

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/category" element={<ServiceList />} />

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
