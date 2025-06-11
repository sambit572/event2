import React, { useState, useEffect } from "react";
import UserSideBar from "./UserSideBar.jsx";
import "./Profile.css";

function Profile() {
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
    <div className="profile-container">
      {/* Hamburger / Cross button for mobile */}
      <button
        className={`hamburger ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <UserSideBar isOpen={isSidebarOpen} />

      <div className="main-content">
        <h2>Main content</h2>
      </div>
    </div>
  );
}

export default Profile;
