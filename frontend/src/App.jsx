import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import ServiceList from "./pages/customer/ServiceList";
import Navbar from "./components/customer/Navbar";
import Service from "./pages/customer/Service";

const App = () => {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/category" element={<ServiceList />}></Route>
          <Route path="/category/service" element={<Service />}></Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
