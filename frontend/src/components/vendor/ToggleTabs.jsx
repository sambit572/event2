import React from "react";
import "./ToggleTabs.css";

function ToggleTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tab-btn md:ml-8">
      <div className={`bg-slider ${activeTab}`}></div>
      <button
        className={`${activeTab === "services" ? "active" : ""}`}
        onClick={() => setActiveTab("services")}
      >
        SERVICES
      </button>
      <button
        className={`${activeTab === "bookings" ? "active" : ""}`}
        onClick={() => setActiveTab("bookings")}
      >
        BOOKINGS
      </button>
    </div>
  );
}

export default ToggleTabs;
