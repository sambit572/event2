import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [userFirstName, setUserFirstName] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/user/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userFirstName");
      setUserFirstName(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (ellipsisRef.current && !ellipsisRef.current.contains(event.target)) {
        setShowEllipsisDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateName = () => {
      const storedName = localStorage.getItem("userFirstName");
      setUserFirstName(storedName);
    };

    updateName();
    window.addEventListener("userLoggedIn", updateName);
    return () => window.removeEventListener("userLoggedIn", updateName);
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

      {/* Nav Icons */}
      <div className="nav-icons">
        {/* Profile Dropdown */}
        <div className="nav-item profile-dropdown-container" ref={profileRef}>
          <div className="flex items-center gap-2 text-gray-700 cursor-pointer login">
            <span
              className="flex items-center gap-2"
              onClick={!userFirstName ? () => navigate("/login") : undefined}
            >
              <FaUser className="text-lg" />
              <span className="font-medium">
                {userFirstName ? `${userFirstName}` : "Login"}
              </span>
            </span>
            <span onClick={handleToggleProfileDropdown}>
              {showProfileDropdown ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </span>
          </div>

          {showProfileDropdown && (
            <div className="dropdown-menu profile-menu">
              {!userFirstName ? (
                <>
                  <h4 className="login-h4">Welcome</h4>
                  <p className="login-p">
                    To access account and manage services
                  </p>
                  <div className="dropdown-header">
                    <span>New Customer?</span>
                    <span
                      className="signup-link"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </span>
                  </div>
                  <hr />
                </>
              ) : (
                <>
                  <div
                    className="flex text-[rgb(59,3,64)] text-opacity-90"
                    onClick={() => navigate("/profile")}
                  >
                    <FaUser style={{ marginRight: "8px" }} />
                    My Profile
                  </div>
                  <div className="dropdown-item">
                    <FaHeart className="icon" style={{ marginRight: "4px" }} />
                    <a href="./wishlist">Wishlist</a>
                  </div>
                  <div className="dropdown-item">
                    <FaSignOutAlt
                      className="icon"
                      style={{ marginRight: "4px" }}
                    />
                    <button className="signOutButton" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Become Vendor */}
        <div
          className="nav-items"
          onClick={() =>
            !userFirstName ? navigate("/login") : navigate("/vendor/register")
          }
        >
          <FaStore className="icons" />
          <span className="vendor">Become a Vendor</span>
        </div>

        {/* Three Dots Dropdown */}
        <div className="nav-item ellipsis-container" ref={ellipsisRef}>
          <FaEllipsisV
            className="three-dot"
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
                onClick={() => navigate("/category")}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
