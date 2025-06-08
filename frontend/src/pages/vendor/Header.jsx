// src/components/Header.jsx
import React from "react";
import logo from "/public/logo.png";
import userIcon from "/public/user.png";
import menuIcon from "/public/menu.png";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title"></h1>
      </div>
      <div className="header-right">
        <img src={userIcon} alt="User Icon" className="icon" />
        <img src={menuIcon} alt="Menu Icon" className="icon" />
      </div>
    </header>
  );
};

export default Header;
