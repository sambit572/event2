import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Navbar from "./components/customer/Navbar";
import Service from "./pages/customer/Service";
import LoginRegister from "./pages/customer/LoginRegister";
import ForgotPass from "./pages/customer/ForgotPass.jsx";
import ResetPassword from "./pages/customer/ResetPassword.jsx";
import ProtectedRoute from "./utils/ProtectedRoutes.jsx";
import DashBoardMain from "./components/vendor/DashBoardMain.jsx";
import Profile from "./components/customer/profile/Profile.jsx";

const App = () => {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/category" element={<ServiceList />}></Route>
          <Route path="/category/service" element={<Service />}></Route>
          <Route path="/LoginRegister" element={<LoginRegister />}></Route>
          <Route path="/forgot-password" element={<ForgotPass />}></Route>
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/dashboard" element={<DashBoardMain />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
