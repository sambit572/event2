import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Navbar from "./components/customer/Navbar";
import Service from "./pages/customer/Service";
import LoginRegister from "./pages/customer/LoginRegister";
import Wishlist from "./pages/customer/Wishlist";
import ForgotPassword from "./pages/customer/ForgotPassword";
import DashboardServices from "./pages/customer/DashboardServices";

const App = () => {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/category" element={<ServiceList />}></Route>
          <Route path="/category/service" element={<Service />}></Route>
          <Route path="/LoginRegister" element={<LoginRegister />}></Route>
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
          <Route path="/dashboardservices" element={<DashboardServices />}></Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
