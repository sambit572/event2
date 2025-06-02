import React from "react";
import "./Navbar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaHandsHelping,
  FaStore,
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaRegEdit,
  FaHeart,
} from "react-icons/fa";
import { MdReviews, MdMiscellaneousServices } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";
import { FcAbout } from "react-icons/fc";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import LoginRegister from "/src/pages/customer/LoginRegister.jsx";

import { SiBrandfolder } from "react-icons/si";

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

      <NavLink to="/" onClick={handleHomeClick} className="logo">
        EVENTSBRIDGE
      </NavLink>

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
            <NavLink
              to="/login"
              onClick={handleOpenLoginModal}
              className="align_center login"
            >
              <FaUser className="icon" />
              <h4>Login</h4>
            </NavLink>
            {showLoginModal && (
              <LoginRegister onClose={() => setShowLoginModal(false)} />
            )}
            <span onClick={handleToggleProfileDropdown}>
              {showProfileDropdown ? (
                <FaChevronUp className="dropdown-arrow" />
              ) : (
                <FaChevronDown className="dropdown-arrow" />
              )}
            </span>
            {/* {showProfileDropdown ? <FaChevronUp /> : <FaChevronDown />} */}
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
                    <FaRegEdit className="icon" />
                    <a href="./edit-profile">Edit My Profile</a>
                  </div>
                </div>
              )}
              <div className="dropdown-item">
                <TbBrandBooking
                  className="icon"
                  style={{ marginRight: "4px" }}
                />
                <a href="./my-booking">Privious Booking</a>
              </div>
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

        <div className="nav-item">
          <NavLink to="/register-vendor" className="align_center">
            <FaStore className="icon" />
            Become a Vendor
          </NavLink>
        </div>

        {/* Three Dots Dropdown */}
        <div className="nav-item ellipsis-container" ref={ellipsisRef}>
          <FaEllipsisV
            onClick={() => setShowEllipsisDropdown((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />

          {showEllipsisDropdown && (
            <div className="dropdown-menu ellipsis-menu">
              <NavLink to="/about_us" className="dropdown-item">
                <FcAbout className="icon" style={{ marginright: "6px" }} />{" "}
                About Us
              </NavLink>
              <NavLink to="/services" className="dropdown-item">
                <MdMiscellaneousServices
                  className="icon"
                  style={{ marginright: "6px" }}
                />{" "}
                Services
              </NavLink>
              <NavLink to="/reviews" className="dropdown-item">
                <MdReviews className="icon" style={{ marginright: "6px" }} />
                Reviews
              </NavLink>
              <NavLink to="/help_us" className="dropdown-item">
                <FaHandsHelping
                  className="icon"
                  style={{ marginright: "6px" }}
                />{" "}
                Help Us
              </NavLink>
              <NavLink to="/setting" className="dropdown-item">
                <IoSettingsSharp
                  className="icon"
                  style={{ marginright: "6px" }}
                />{" "}
                Setting
              </NavLink>
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
