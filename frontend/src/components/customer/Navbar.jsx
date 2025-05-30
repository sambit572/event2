import React, { useState, useEffect, useRef } from 'react';
import {
  FaSearch, FaUser, FaSignOutAlt, FaHandsHelping, FaStore,
  FaEllipsisV, FaChevronDown, FaChevronUp, FaRegEdit, FaHeart
} from 'react-icons/fa';
import { MdReviews, MdMiscellaneousServices,  } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";
import { FcAbout } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMyProfileSub, setShowMyProfileSub] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);

  const profileRef = useRef(null);
  const ellipsisRef = useRef(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfileDropdown(false);
    setShowMyProfileSub(false);
    setShowEllipsisDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
        setShowMyProfileSub(false);
      }

      if (
        ellipsisRef.current && !ellipsisRef.current.contains(event.target)
      ) {
        setShowEllipsisDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">
        {/* <img src="/header-logo.png" alt="Eventsbridge logo" />  */}
        <span>EVENTSBRIDGE</span>
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
          <div
            className="profile-btn"
            onClick={() => setShowProfileDropdown(prev => !prev)}
          >
            <FaUser className='icon' />
            <span onClick={() => handleNavigation('/login')}>Login</span>
            {showProfileDropdown ? (
              <FaChevronUp className="dropdown-arrow" />
            ) : (
              <FaChevronDown className="dropdown-arrow" />
            )}
          </div>

          {showProfileDropdown && (
            <div className="dropdown-menu profile-menu">
              <h4 className='login-h4'>Welcome</h4>
              <p className='login-p'>To access account and manage services</p>
              <div className="dropdown-header">
                <span>New Customer?</span>
                <span className="signup-link" onClick={() => handleNavigation('/register')}>Sign Up</span>
              </div>
              <hr/>

              <div
                className="dropdown-item nested-toggle"
                onClick={() => setShowMyProfileSub(prev => !prev)}
              >
                <FaUser  style={{ marginRight: '4px' }} />
                My Profile
                {showMyProfileSub ? (
                  <FaChevronUp style={{ marginLeft: '4px' }} />
                ) : (
                  <FaChevronDown style={{ marginLeft: '4px' }} />
                )}
              </div>

              {showMyProfileSub && (
                <div className="nested-submenu">
                  <div className="dropdown-item"><FaRegEdit className='icon' /><a href="./edit-profile">Edit My Profile</a></div>
                </div>
              )}
              <div className='dropdown-item'><TbBrandBooking className='icon' style={{ marginRight: '4px' }} /><a href="./my-booking">Privious Booking</a></div>
              <div className='dropdown-item'><FaHeart className='icon' style={{ marginRight: '4px' }} /><a href="./wishlist">Wishlist</a></div>
              <div className='dropdown-item'><FaSignOutAlt className='icon'  style={{ marginRight: '4px' }} /><a href="./Logout">Sign Out</a></div>
            </div>

          )}
        </div>

        {/* Become Vendor */}
        <div className="nav-item">
          <FaStore className='icon' /><a href="./register-vendor">Become a Vendor</a>
        </div>

        {/* Three Dots Dropdown */}
        <div className="nav-item ellipsis-container" ref={ellipsisRef}>
          <FaEllipsisV onClick={() => setShowEllipsisDropdown(prev => !prev)} style={{ cursor: 'pointer' }} />

          {showEllipsisDropdown && (
            <div className="dropdown-menu ellipsis-menu">
              <div className="dropdown-item" onClick={() => handleNavigation('/about_us')}><FcAbout className='icon' style={{ marginright: '6px'}}/> About Us</div>
              <div className="dropdown-item" onClick={() => handleNavigation('/services')}><MdMiscellaneousServices className='icon'  style={{ marginright: '6px'}}/>Services</div>
              <div className="dropdown-item" onClick={() => handleNavigation('/reviews')}><MdReviews className='icon' style={{ marginright: '6px'}}/>Reviews</div>
              <div className="dropdown-item" onClick={() => handleNavigation('/help_us')}><FaHandsHelping className='icon' style={{ marginright: '6px'}}/>Help Us</div>
              <div className="dropdown-item" onClick={() => handleNavigation('/help_us')}><IoSettingsSharp className='icon' style={{ marginright: '6px'}}/>Setting</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default Navbar;
