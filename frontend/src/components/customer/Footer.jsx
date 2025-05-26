import React from "react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="section">
        <h3>EventsBridge</h3>
        <br />
        <p>Your one-stop platform for booking events effortlessly.</p>
      </div>

      <div className="container">
        <div className="section">
          <h4>Quick Links</h4>
          <ul className="list">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/events">Browse Events</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="section">
          <h4>Policies</h4>
          <ul className="list">
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/refund">Refund Policy</a>
            </li>
          </ul>
        </div>

        <div className="section">
          <h4>Follow Us</h4>
          <ul className="list">
            <li>
              <a href="https://facebook.com">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com">Twitter</a>
            </li>
            <li>
              <a href="https://instagram.com">Instagram</a>
            </li>
            <li>
              <a href="https://linkedin.com">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="copy">
        &copy; {new Date().getFullYear()} EventsBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
