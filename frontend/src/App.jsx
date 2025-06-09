import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Navbar from "./components/customer/Navbar";
import Service from "./pages/customer/Service";
import VendorLegalConsent from "./pages/vendor/VendorLegalConsent";
import VendorPayment from "./pages/vendor/VendorPayment";
import VendorThankYou from "./pages/vendor/VendorThankYou"; 
import VendorRegistration from "./pages/vendor/VendorRegistration";

import Footer from "./components/customer/Footer";

import LoginRegister from "./pages/customer/LoginRegister";

const App = () => {
  const location = useLocation();

  // Define routes where you want to hide the navbar
  const hideNavbarRoutes = [
    "/vendor/legal-consent",
    "/vendor/payment-info",
    "/vendor/thank-you",
    "/vendor/register"
  ];
  const hideFooterRoutes = [
    "/vendor/legal-consent",
    "/vendor/payment-info",
    "/vendor/thank-you",
    "/vendor/register"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);
  
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<ServiceList />} />
          <Route path="/category/service" element={<Service />} />
          <Route path="/LoginRegister" element={<LoginRegister />} />

          {/* Vendor Routes */}
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route path="/vendor/legal-consent" element={<VendorLegalConsent />} />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />
        </Routes>
      </main>
     {shouldShowFooter && <Footer />}
    </>
  );
};

export default App;