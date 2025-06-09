import React from "react";

import "./Footer.css";
import google from "../../assets/home/google.png";
import appstore from "../../assets/home/appstore.png";
import { FaLocationDot } from "react-icons/fa6";

import {
  FaPhoneVolume,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaVoicemail,
} from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="section">
        <h3>EventsBridge</h3>
        <br />
        <p>Your one-stop platform for booking events effortlessly.</p>
      </div>

      <div className="align_center mid_container">
        <div className="section">
          <h4>Experience Eventsbridge App On Mobile</h4>
          <div className="store-icons">
            <img src={google} alt="playstore" />
            <img src={appstore} alt="appstore" />
          </div>
        </div>

        <div className="section">
          <h4>Follow Us</h4>
          <br />
          <ul className="list">
            <a href="https://facebook.com" className="followus">
              <FaFacebook />
            </a>

            <a href="https://twitter.com" className="followus">
              <FaTwitter />
            </a>

            <a href="https://www.instagram.com/eventsbridge_/profilecard/?igsh=d3NjcDc0YWJsY3Vx" className="followus">
              <FaInstagram />
            </a>

            <a href="https://www.linkedin.com/company/eventsbridge-com/posts/?feedView=all" className="followus">
              <FaLinkedin />
            </a>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="section">
          <h4>Contact Us</h4>
          <ul className="list">
            <li>
              <a href="/about" className="align_center">
                <FaEnvelope />
                email@gmail.com
              </a>
            </li>
            <li>
              <a href="/events" className="align_center">
                <FaPhoneVolume />
                123-456-7890
              </a>
            </li>
            <li>
              <a href="/pricing" className="align_center">
                <FaLocationDot />
                Bhunneshwar Odisha India
              </a>
            </li>
          </ul>
        </div>
        <div className="section">
          <h4>Quick Links</h4>
          <ul className="list">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/events">Services</a>
            </li>
            <li>
              <a href="/pricing">Help</a>
            </li>
            <li>
              <a href="/contact">FAQs</a>
            </li>
          </ul>
        </div>

        <div className="section">
          <h4>Privacy Policies</h4>
          <ul className="list">
            <li>
              <a href="/privacy">Terms and Conditions</a>
            </li>
            <li>
              <a href="/terms">Refund Policy</a>
            </li>
            <li>
              <a href="/refund">Legal Information</a>
            </li>
          </ul>
        </div>
        <div className="section">
          <h4>About Company</h4>
          <ul className="list">
            <li>
              <a href="/privacy">Our Approach</a>
            </li>
            <li>
              <a href="/terms">Awards & Reviews</a>
            </li>
            <li>
              <a href="/refund">About HostGator</a>
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
