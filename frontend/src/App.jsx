import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";
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
const VendorRegistration = React.lazy(() =>
  import("./pages/vendor/VendorRegistration")
);
import VendorService from "./pages/vendor/VendorService";
const VendorLogin = React.lazy(() => import("./pages/vendor/VendorLogin.jsx"));

import AboutUs from "./pages/common/AboutUs";
import HelpUs from "./pages/common/HelpUs";
import HelpCenter from "./pages/common/HelpCenter";

import ForgotPass from "./pages/customer/ForgotPass.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";
import Profile from "./components/customer/profile/Profile.jsx";
import UserDetails from "./pages/customer/UserDetails.jsx";

import PopUp from "./socket/user/CustomerNegotiationModal.jsx";
import VendorResetPassword from "./pages/vendor/VendorResetPass.jsx";

// Vendor Pages
const DashBoardMain = React.lazy(() =>
  import("./components/vendor/DashBoardMain.jsx")
);
const AddServiceInDashboard = React.lazy(() =>
  import("./components/vendor/AddServiceInDashboard.jsx")
);

import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
const AdminDashboard = React.lazy(() =>
  import("./pages/admin/AdminDashboard.jsx")
);

import BackToTop from "./pages/common/BackToTop";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/UserSlice.js";
import { setVendor } from "./redux/VendorSlice.js";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AddToCart from "./components/customer/YourCart/AddToCart.jsx";
import DashboardEnforcement from "./utils/DashboardEnforcement.jsx";
const BookingSuccess = React.lazy(() =>
  import("./pages/common/BookingSuccess.jsx")
);
import PrivacyPolicy from "./components/common/PrivacyPolicy.jsx";
import RefundPolicy from "./components/common/RefundPolicy.jsx";
import TermsAndConditions from "./components/common/TermsAndConditions.jsx";
//Feedback
import Feedback from "./pages/common/Feedback.jsx";
import ErrorPage from "./pages/common/ErrorPage.jsx";
const ReviewSlider = React.lazy(() =>
  import("./components/customer/home/ReviewSlider")
);
const FaqSection = React.lazy(() =>
  import("./components/customer/home/FaqSection")
);

import VendorSocketManager from "./socket/vendor/VendorSocketManager.jsx";
import OrderSummary from "./components/customer/YourCart/orderSummary.jsx";
import { BACKEND_URL } from "./utils/constant.js";
import ComingSoon from "./utils/ComingSoon.jsx";

import MyReports from "./pages/common/myreports/MyReports.jsx";
import SearchPage from "./pages/search/SearchPage.jsx";
import VendorForgotPass from "./pages/vendor/VendorForgetPass.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import MyApproach from "./pages/common/MyApproach.jsx";
import QRPayment from "./pages/common/payment/QrPayment.jsx";
import { PaymentSuccess } from "./pages/common/payment/PaymentSuccess.jsx";

const App = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVendorRegisterModal, setShowVendorRegisterModal] = useState(false);
  const [showVendorLoginModal, setShowVendorLoginModal] = useState(false);
  const vendor = useSelector((state) => state.vendor.vendor);
  const dispatch = useDispatch();

  // All your other functions for handling modals, etc. remain here
  // For brevity, I'm omitting them, but you should keep them in your file.
  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
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
    "/service/:categoryId/:serviceId",
    "/category/:categoryId",
  ];

  function clearVendorSession() {
    [
      "VendorCurrentlyLoggedIn",
      "VendorFirstName",
      "VendorFullName",
      "VendorInitial",
    ].forEach((key) => localStorage.removeItem(key));
  }

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
        clearVendorSession();
        console.error("Vendor auth check failed:", err.message);
      }
    };

    checkVendorAuth();
  }, [dispatch]);

  useEffect(() => {
    const openLoginListener = () => handleOpenLogin();
    window.addEventListener("openLoginModal", openLoginListener);
    return () =>
      window.removeEventListener("openLoginModal", openLoginListener);
  }, []);

  return (
    <>
      <ScrollToTop />
      {location.pathname !== "/admin" && (
        <Navbar
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onOpenVendorRegister={handleOpenVendorRegister}
          onOpenVendorLogin={handleOpenVendorLogin}
          setShowPasswordModal={setShowPasswordModal}
        />
      )}

      {showPasswordModal && (
        <VendorChangePassword onClose={() => setShowPasswordModal(false)} />
      )}

      <main className="custom-mt mt-[52px]  sm:mt-[52px] md:mt-[62px]">
        {vendor?._id && <VendorSocketManager />}
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
              zIndex: 9999,
            },
          }}
          containerClassName="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
        />
        <Routes>
          {/* ... All your <Route> components ... */}
          <Route path="/" element={<Home />} />
          <Route
            path="/category/:categoryId"
            element={<ServiceList onSwitchToLogin={handleOpenLogin} />}
          />
          <Route path="/search" element={<SearchPage />} />
          {/* <Route path="/categories" element={<CategoryCard />}></Route> */}
          <Route
            path="/reviews"
            element={
              <Suspense>
                <ReviewSlider />{" "}
              </Suspense>
            }
          />
          <Route path="/faqs" element={<FaqSection />} />
          {/* Other routes */}
          <Route
            path="/service/:categoryId/:serviceId"
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
            path="/vendor/register"
            element={
              <ProtectedRoute>
                <Suspense>
                  <VendorRegistration />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/category/VendorService" element={<VendorService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendor/payment-info" element={<VendorPayment />} />
          <Route
            path="/vendor/legal-consent"
            element={<VendorLegalConsent />}
          />
          <Route path="/vendor/thank-you" element={<VendorThankYou />} />
          <Route
            path="/dashboard"
            element={
              <DashboardEnforcement onOpenVendorLogin={handleOpenVendorLogin}>
                <Suspense>
                  <DashBoardMain />
                </Suspense>
              </DashboardEnforcement>
            }
          />
          <Route
            path="/vendor/services/addServices"
            element={
              <DashboardEnforcement onOpenVendorLogin={handleOpenVendorLogin}>
                <Suspense>
                  <AddServiceInDashboard />
                </Suspense>
              </DashboardEnforcement>
            }
          />
          <Route
            path="/vendor/forgot-password"
            element={<VendorForgotPass />}
          />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/vendor/reset-password/:resetToken"
            element={<VendorResetPassword />}
          />
          <Route path="/your-cart" element={<AddToCart />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/help_us" element={<HelpUs />} />
          <Route path="/help-Center" element={<HelpCenter />} />
          <Route path="/feedback" element={<Feedback />} /> {/* Feedback */}
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/approach" element={<MyApproach />}></Route>
          <Route
            path="/userdetails/:serviceId"
            element={<UserDetails />}
          ></Route>
          <Route path="/pop-up/:userDetailsId" element={<PopUp />}></Route>
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/admin"
            element={
              <Suspense>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/report" element={<MyReports />} />
          <Route
            path="/booking-success"
            element={
              <Suspense fallback={<div>Loading ...</div>}>
                <BookingSuccess />{" "}
              </Suspense>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/order-summary/:userDetailsId"
            element={<OrderSummary />}
          />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/qr-payment" element={<QRPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </main>
      <BackToTop />
      <ToastContainer
        position="top-center" // still required
        autoClose={3000}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <Chatbot />
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
      {!pagesWithoutFooter.includes(location.pathname) && <Footer />}
    </>
  );
};
export default App;
//  <Suspense fallback={<div>Loading...</div>}>
//       <VendorProfile />
//     </Suspense>
