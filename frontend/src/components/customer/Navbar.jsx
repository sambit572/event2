import React, { useState, useEffect, useRef } from "react";
import LoginRegister from "/src/pages/customer/LoginRegister.jsx"; // make sure path is correct
import "./Navbar.css";
import {
  FaSearch,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaStore,
  FaEllipsisV,
  FaHandsHelping,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { MdMiscellaneousServices, MdReviews } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { SiBrandfolder } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMyProfileSub, setShowMyProfileSub] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setShowProfileDropdown(false); // Ensure dropdown stays closed when opening login modal
  };

  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev); // Toggle dropdown only when clicking arrow
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        setShowMyProfileSub(false);
      }
      if (ellipsisRef.current && !ellipsisRef.current.contains(event.target)) {
        setShowEllipsisDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">
        <span onClick={handleHomeClick}>EVENTSBRIDGE</span>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search for Services and More" />
      </div>

      {/* Nav Items */}
      <div className="nav-icons">
        {/* Profile Dropdown */}
        <div className="nav-item profile-dropdown-container" ref={profileRef}>
          <div className="profile-btn">
            <span onClick={handleOpenLoginModal} className="align_center login">
              <FaUser className="icon" />
              <span>Login</span>
            </span>{" "}
            {/* Opens only login modal */}
            {showLoginModal && (
              <LoginRegister onClose={() => setShowLoginModal(false)} />
            )}
            <span onClick={handleToggleProfileDropdown}>
              {showProfileDropdown ? (
                <FaChevronUp className="dropdown-arrow" />
              ) : (
                <FaChevronDown className="dropdown-arrow" />
              )}
            </span>{" "}
            {/* Click arrows to toggle dropdown */}
          </div>

          {showProfileDropdown && (
            <div className="dropdown-menu profile-menu">
              <h4 className="login-h4">Welcome</h4>
              <p className="login-p">To access account and manage services</p>
              <div className="dropdown-header">
                <span>New Customer?</span>
                <span className="signup-link" onClick={handleOpenLoginModal}>
                  Sign Up
                </span>
              </div>
              <hr />
              <div
                className="dropdown-item nested-toggle"
                onClick={() => setShowMyProfileSub((prev) => !prev)}
              >
                <FaUser style={{ marginRight: "4px" }} />
                My Profile
                {showMyProfileSub ? (
                  <FaChevronUp style={{ marginLeft: "4px" }} />
                ) : (
                  <FaChevronDown style={{ marginLeft: "4px" }} />
                )}
              </div>
              {showMyProfileSub && (
                <div className="nested-submenu">
                  <div className="dropdown-item">
                    <SiBrandfolder className="icon" />
                    <a href="./edit-profile">Edit My Profile</a>
                  </div>
                </div>
              )}
              <div className="dropdown-item">
                <FaHeart className="icon" style={{ marginRight: "4px" }} />
                <a href="./wishlist">Wishlist</a>
              </div>
              <div className="dropdown-item">
                <FaSignOutAlt className="icon" style={{ marginRight: "4px" }} />
                <a href="./Logout">Sign Out</a>
              </div>
            </div>
          )}
        </div>

        {/* Become Vendor */}
        <div className="nav-item" onClick={handleOpenLoginModal}>
          <FaStore className="icon" />
          <span>Become a Vendor</span>
        </div>

        {/* Three Dots Dropdown */}
        <div className="nav-item ellipsis-container" ref={ellipsisRef}>
          <FaEllipsisV
            onClick={() => setShowEllipsisDropdown((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
          {showEllipsisDropdown && (
            <div className="dropdown-menu ellipsis-menu">
              <div
                className="dropdown-item"
                onClick={() => navigate("/about_us")}
              >
                <FcAbout className="icon" /> About Us
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/services")}
              >
                <MdMiscellaneousServices className="icon" /> Services
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/reviews")}
              >
                <MdReviews className="icon" /> Reviews
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/help_us")}
              >
                <FaHandsHelping className="icon" /> Help Us
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/settings")}
              >
                <IoSettingsSharp className="icon" /> Settings
              </div>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginRegister onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Navbar;
