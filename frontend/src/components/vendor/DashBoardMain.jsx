import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import "./DashboardMain.css";

function DashBoardMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock sidebar open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <button
        className="hamburger"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>
      <DashBoardSideBar isOpen={isSidebarOpen} />
      <div className="main-content">
        <DashboardServices />
      </div>
    </div>
  );
}

export default DashBoardMain;
