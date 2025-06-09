import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Service from "./pages/customer/Service";
import VendorService from "./pages/vendor/VendorService";
import Footer from "./components/customer/Footer";
import LoginRegister from "./pages/customer/LoginRegister";
import Navbar from "./components/customer/Navbar"; 

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/category/VendorService"];
  const hideFooterRoutes = ["/category/VendorService"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/category" element={<ServiceList />}></Route>
          <Route path="/category/service" element={<Service />}></Route>
          <Route path="/LoginRegister" element={<LoginRegister />}></Route>
          <Route path="/category/VendorService" element={<VendorService /> }></Route>
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default App;