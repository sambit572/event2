import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import "./DashboardMain.css";

function DashBoardMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Hamburger / Cross button for mobile */}
      <button
        className={`hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <DashBoardSideBar isOpen={isSidebarOpen} />

      <div className="main-contain">
        <DashboardServices />
      </div>
    </div>
  );
}

export default DashBoardMain;
