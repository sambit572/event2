import React, { useState, useEffect, useRef } from "react";
import UserProfileIcon from "../../pages/common/UserProfileIcon.jsx";
import toast from "react-hot-toast";

import "./Navbar.css";
import { CgProfile } from "react-icons/cg";

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
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import ReviewSlider from "../customer/Home/ReviewSlider.jsx";
import ImageSlider from "./../customer/Home/ImageSlider";
import logo from "../../assets/logo.png";
import {
  attemptVendorSilentLogin,
  checkVendorEmailStatus,
} from "../../utils/VendorAuth.jsx";
import VendorEmailConfirmModal from "../vendor/VendorEmailConfirmModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  const [userFirstName, setUserFirstName] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [VendorFirstName, setVendorFirstName] = useState(null);

  const [searchInput, setSearchInput] = useState("");

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);
  const vendorRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearchicon = (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  const vendorLogout = async (req, res) => {
    try {
      console.log("Logging out vendor...");
      await axios.post(
        "http://localhost:8000/vendors/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("VendorFullName");
      localStorage.removeItem("VendorFirstName");
      localStorage.removeItem("VendorInitial");
      localStorage.removeItem("VendorCurrentlyLoggedIn");
      setVendorFirstName(null);
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

  const handleVendorClick = async () => {
    if (!userFirstName) {
      onOpenLogin(); // force user to login first
      return;
    }

    // 1. Try silent login with vendor token
    const silentRes = await attemptVendorSilentLogin();
    if (silentRes.success) {
      navigate("/dashboard");
      return;
    }

    // 2. Check email status for current user
    const email = await axios.get("http://localhost:8000/user/get-email");
    const emailStatus = await checkVendorEmailStatus(email);

    console.log(emailStatus);

    if (emailStatus.existsInVendor) {
      navigate("/vendor-login"); // already a vendor
    } else if (emailStatus.existsInUser) {
      // prompt UI to confirm: "Use same email to register as vendor?"
      <VendorEmailConfirmModal />;
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
      const storedVendor = localStorage.getItem("VendorFirstName");
      setUserFirstName(storedName);
      setVendorFirstName(storedVendor);
    };

    updateName();
    window.addEventListener("userLoggedIn", updateName);
    return () => window.removeEventListener("userLoggedIn", updateName);
  }, []);

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">
        <span onClick={handleHomeClick}>
          <img src={logo} alt="logo" />
        </span>
      </div>

      <div className="search-and-nav-icons-container ">
        {/* Search Bar */}
        <div className="search-bar" onClick={handleSearch}>
          <FaSearch className="search-icon" onClick={handleSearchicon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Services and More"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>

        {/* Nav Icons */}
        <div className="nav-icons">
          {/* Profile Dropdown */}
          <div className="nav-item profile-dropdown-container" ref={profileRef}>
            <div className="flex items-center gap-2 text-gray-700 cursor-pointer login">
              <span
                className="flex items-center gap-2 max-[1024px]:flex-col max-[1024px]:text-[12px] max-[820px]:text-[11px]"
                onClick={!userFirstName ? () => navigate("/login") : undefined}
              >
                {!userFirstName ? (
                  <>
                    <CgProfile className="text-2xl" />
                    <span className="font-medium">Login</span>
                  </>
                ) : (
                  <>
                    <UserProfileIcon />
                    <span className="font-medium">{`Hi, ${userFirstName}`}</span>
                  </>
                )}
              </span>

              {/* ⬇️ Always show dropdown toggle arrow */}
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
                        onClick={() => navigate("/register")}
                      >
                        Sign Up
                      </button>
                    </div>
                    <hr />
                  </>
                ) : (
                  <>
                    <div
                      className="flex flex-row gap-1 mb-[10px] text-[#001f3f] hover:text-[#022f5d] hover:font-bold text-[15px]"
                      onClick={() => navigate("/profile")}
                    >
                      <FaUser style={{ marginRight: "8px" }} />
                      My Profile
                    </div>
                    <div className="dropdown-item hover:text-[#001f3f] hover:font-bold">
                      <FaHeart
                        className="navbar_icon "
                        style={{ marginRight: "4px" }}
                      />
                      <a href="./wishlist">Wishlist</a>
                    </div>
                    <div className="dropdown-item">
                      <FaSignOutAlt
                        className="navbar_icon hover:text-[#001f3f] hover:font-bold"
                        style={{ marginRight: "4px" }}
                      />
                      <button
                        className="signOutButton hover:text-[#001f3f] hover:font-bold"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Become Vendor */}
          <div className="nav-item profile-dropdown-container" ref={vendorRef}>
            <div className="nav-items max-[1024px]:flex-col max-[1024px]:text-[12px] max-[820px]:text-[11px] cursor-pointer">
              <div className="flex items-center gap-2">
                <FaStore
                  className="icons max-[1024px]:h-[18px] max-[1024px]:w-[18px] max-[820px]:h-[15px]"
                  onClick={handleVendorClick}
                />
                <span
                  className="text-[#001F3F] hover:text-white font-semibold max-[1024px]:mt-[6px] max-[820px]:text-[11px] max-[820px]:w-max"
                  onClick={() => {
                    if (!userFirstName) {
                      const toastId = toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                          } bg-white text-black px-4 py-3 rounded shadow-lg relative mt-20`}
                        >
                          <span>Please login as a user first.</span>
                          <div className="toast-progress"></div>
                        </div>
                      ));
                      setTimeout(() => toast.dismiss(toastId), 2000);
                    } else {
                      if (!VendorFirstName && userFirstName) {
                        navigate("/vendor/register");
                      } else {
                        setShowVendorDropdown((prev) => !prev);
                      }
                    }
                  }}
                >
                  {!VendorFirstName ? (
                    <>
                      <CgProfile className="text-2xl" />
                      <span className="font-medium">Be a Vendor</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">
                        <UserProfileIcon />
                        {VendorFirstName}
                      </span>
                    </>
                  )}
                </span>

                <span onClick={() => setShowVendorDropdown((prev) => !prev)}>
                  {showVendorDropdown ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </span>
              </div>
            </div>

            {showVendorDropdown && (
              <div className="dropdown-menu profile-menu">
                <h4 className="login-h4">Welcome Vendor</h4>
                <p className="login-p">Access your vendor tools and profile</p>
                <div className="dropdown-header">
                  <span className="text-[#001f3f]">New Vendor?</span>
                  <button
                    className=" bg-black hover:bg-gray-800 text-white"
                    onClick={() => {
                      setShowVendorDropdown(false);
                      if (!userFirstName) {
                        const toastId = toast.custom((t) => (
                          <div
                            className={`${
                              t.visible ? "animate-enter" : "animate-leave"
                            } bg-white text-black px-4 py-3 rounded shadow-lg relative mt-20`}
                          >
                            <span>Please register as a user first.</span>
                            <div className="toast-progress"></div>
                          </div>
                        ));

                        // Auto dismiss after 3 seconds
                        setTimeout(() => toast.dismiss(toastId), 2000);
                      } else {
                        navigate("/vendor/register");
                      }
                    }}
                  >
                    Register
                  </button>
                </div>
                <hr />
                <div className="dropdown-header">
                  <button
                    className=" bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      setShowVendorDropdown(false);
                      if (!userFirstName) {
                        const toastId = toast.custom((t) => (
                          <div
                            className={`${
                              t.visible ? "animate-enter" : "animate-leave"
                            } bg-white text-black px-4 py-3 rounded shadow-lg relative mt-20`}
                          >
                            <span>Please register as a user first.</span>
                            <div className="toast-progress"></div>
                          </div>
                        ));

                        // Auto dismiss after 3 seconds
                        setTimeout(() => toast.dismiss(toastId), 2000);
                      } else {
                        navigate("/vendor/register");
                      }
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className=" bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setShowVendorDropdown(false);
                      if (!userFirstName) {
                        const toastId = toast.custom((t) => (
                          <div
                            className={`${
                              t.visible ? "animate-enter" : "animate-leave"
                            } bg-white text-black px-4 py-3 rounded shadow-lg relative mt-20`}
                          >
                            <span>Please register as a user first.</span>
                            <div className="toast-progress"></div>
                          </div>
                        ));

                        // Auto dismiss after 3 seconds
                        setTimeout(() => toast.dismiss(toastId), 2000);
                      } else {
                        vendorLogout();
                      }
                    }}
                  >
                    SignOut
                  </button>
                </div>
              </div>
            )}
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
                  <FcAbout className="navbar_icon" /> About Us
                </div>

                <div
                  className="dropdown-item"
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

export default Navbar;
