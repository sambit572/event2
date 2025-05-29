import React from "react";
import "./Navbar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  return (
    <nav>
      <ul className="navbar_listings">
        <li>
          <NavLink to="/" onClick={handleHomeClick}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">Category</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Signup</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
