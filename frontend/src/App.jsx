import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
import VendorLogin from "./pages/vendor/VendorLogin.jsx";
// Vendor Pages
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";

// Common
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Footer on specific pages
  const pagesWithoutFooter = ["/vendor/thank-you", "/admin", "/dashboard"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/admin" && <Navbar />}

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
          
          <Route
           path="/dashboardservices"
            element={
            <ProtectedRoute>
              <DashboardServices />
            </ProtectedRoute>
            } />

          {/* Vendor Routes */}

          <Route 
          path="/vendor/register" 
          element={
           <ProtectedRoute>
            <VendorRegistration />
           </ProtectedRoute>
          
          } />


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

          {/* Misc */}
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/userdetails" element={<UserDetails />}></Route>
          <Route path="/pop-up" element={<PopUp />}></Route>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendor-login" element={<VendorLogin/>} />
        </Routes>
      </main>

      <Chatbot />

      {/* Conditionally render Footer */}
      {!pagesWithoutFooter.includes(location.pathname) && <Footer />}
      <Toaster 
      toastOptions={{
          duration: 5000,
          style: {
            padding: '16px',
            color: '#fff',
            background: '#1f2937',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
          },
        }}
      position="top-right" reverseOrder={false} />

    </>
  );
};

export default App;
