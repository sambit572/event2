import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Navbar from "./components/customer/Navbar";
import Service from "./pages/customer/Service";

import Footer from "./components/customer/Footer";

import LoginRegister from "./pages/customer/LoginRegister";

import Chatbot from "./components/customer/Chatbot";
import AboutUs from "./components/customer/AboutUs";

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
          <Route path="/about_us" element={<AboutUs />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </>
  );
};

export default App;
