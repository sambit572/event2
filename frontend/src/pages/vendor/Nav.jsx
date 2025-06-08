import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="custom-header">
      <div className="logo-section">
        <img src="/WEBSITE LOGO.png" alt="EventsBridge Logo" className="logo" />
      </div>

      <div className="user-icon-container">
        <img
          src="/user 3.png"
          alt="User"
          className="user-avatar"
          title="Profile"
          onClick={() => navigate('/user/profile')}
        />
        <img
          src="/hamburger.png"
          alt="Menu"
          className="header-icon"
        />
      </div>
    </header>
  );
}
