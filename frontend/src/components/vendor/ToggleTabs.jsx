import React from "react";
import "./ToggleTabs.css";

function ToggleTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tab-btn md:ml-8">
      <div className={`bg-slider ${activeTab}`}></div>
      <button
        className={`button1 ${activeTab === "services" ? "active" : ""}`}
        onClick={() => setActiveTab("services")}
      >
        My Services
      </button>
      <button
        className={`button2 ${activeTab === "bookings" ? "active" : ""}`}
        onClick={() => setActiveTab("bookings")}
      >
        My Bookings
      </button>
    </div>
  );
}

export default ToggleTabs;
