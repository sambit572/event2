import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";

import ServiceDetails from "./pages/customer/ServiceDetails";

import VendorLegalConsent from "./pages/vendor/VendorLegalConsent";
import VendorPayment from "./pages/vendor/VendorPayment";
import VendorThankYou from "./pages/vendor/VendorThankYou";
import VendorRegistration from "./pages/vendor/VendorRegistration";
import Footer from "./components/customer/Footer";
import LoginRegister from "./pages/customer/LoginRegister";

import VendorService from "./pages/vendor/VendorService";
import Navbar from "./components/customer/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<ServiceList />} />
          <Route path="/category/service" element={<ServiceDetails />} />
          <Route path="/LoginRegister" element={<LoginRegister />}></Route>
          {/* Vendor Routes */}
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route
            path="/category/VendorService"
            element={<VendorService currentStep={1} />}
          />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route
            path="/vendor/legal-consent"
            element={<VendorLegalConsent />}
          />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
