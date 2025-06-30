import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
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
import { useNavigate, Navigate } from "react-router-dom";
import ReviewSlider from "../customer/Home/ReviewSlider.jsx";
import ImageSlider from "./../customer/Home/ImageSlider";
import logo9 from "../../assets/logo9.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userFirstName, setUserFirstName] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);
  const vendorRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearchicon = (e) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.focus();
  };

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
      localStorage.removeItem("currentlyLoggedIn");
      setUserFirstName(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSearch = () => {
    setSearchInput("");
  };

  const handleLoginClick = () => {
    setShowProfileDropdown(false);
    onOpenLogin();
  };

  const handleSignupClick = () => {
    setShowProfileDropdown(false);
    onOpenRegister();
  };

  const handleVendorClick = () => {
    if (!userFirstName) {
      onOpenLogin();
    } else {
      navigate("/vendor/register");
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
      if (vendorRef.current && !vendorRef.current.contains(event.target)) {
        setShowVendorDropdown(false);
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
      <div className="logo">
        <span onClick={handleHomeClick}>
          <img src={logo9} alt="logo" />
        </span>
      </div>

      <div className="search-and-nav-icons-container">
        <div className="search-bar" onClick={handleSearch}>
          <FaSearch className="search-icon" onClick={handleSearchicon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Services and More"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="nav-icons">
          {/* Profile Dropdown */}
          <div className="nav-item profile-dropdown-container" ref={profileRef}>
            <div className="flex items-center gap-2 text-gray-700 cursor-pointer login">
              <span
                className="flex items-center gap-2 max-[1024px]:flex-row max-[1024px]:text-[12px] max-[820px]:text-[11px]"
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
                      <span className="text-[#001f3f]">New Customer?</span>
                      <button
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={handleSignupClick}
                      >
                        Sign Up
                      </button>
                    </div>
                    <hr />
                  </>
                ) : (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                    >
                      <FaUser /> My Profile
                    </div>
                    <div className="dropdown-item">
                      <FaHeart />
                      <a href="./wishlist">Wishlist</a>
                    </div>
                    <div className="dropdown-item">
                      <FaSignOutAlt />
                      <button onClick={handleLogout}>Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Become Vendor */}
          <div
            className="nav-items  max-[1024px]:flex-row max-[1024px]:text-[12px] max-[820px]:text-[11px]"
            onClick={() =>
              !userFirstName ? navigate("/login") : navigate("/vendor/register")
            }
          >
            <FaStore className="icons max-[1024px]:h-[18px] max-[1024px]:w-[18px]  max-[820px]:h-[15px]" />
            <span className="font-medium text-[#001F3F] hover:text-white max-[1024px]:mt-[6px] max-[820px]:text-[11px] max-[820px]:w-max">
              Be a Vendor
            </span>
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
                  className={`dropdown-item ${
                    location.pathname === "/about_us" ? "active" : ""
                  }`}
                  onClick={() => navigate("/about_us")}
                >
                  <FcAbout className="navbar_icon" /> About Us
                </div>

                <div
                  className={`dropdown-item ${
                    location.pathname === "/help_us" ? "active" : ""
                  }`}
                  onClick={() => navigate("/help_us")}
                >
                  <FaHandsHelping className="navbar_icon" /> Help Us
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  onOpenLogin: PropTypes.func.isRequired,
  onOpenRegister: PropTypes.func.isRequired,
};

export default Navbar;
