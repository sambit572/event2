import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";
import DashBoardBooking from "./DashBoardBooking.jsx";
import ToggleTabs from "./ToggleTabs.jsx";
import "./DashboardMain.css";

function DashBoardMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

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
    <div className="dashboard-container-box">
      {/* Hamburger / Cross button for mobile */}
      <button
        className={`dashboard-hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <DashBoardSideBar isOpen={isSidebarOpen} />

      <div className="main-contain">
        <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "services" ? (
          <DashboardServices />
        ) : (
          <DashBoardBooking />
        )}
      </div>
    </div>
  );
}

export default DashBoardMain;
