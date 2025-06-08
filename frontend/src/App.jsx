import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";

import Service from "./pages/customer/Service";
import VendorService from "./pages/vendor/VendorService";


const App = () => {
  return (
    <>
      {/* Only show this Navbar/Header globally if needed */}
      {/* <Navbar /> or <Header /> could go here for customer routes if needed */}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<ServiceList />} />
          <Route path="/category/service" element={<Service />} />
          <Route path="/category/VendorService" element={<VendorService currentStep={1} />} />
        </Routes>
        
      </main>
    </>
  );
};

export default App;