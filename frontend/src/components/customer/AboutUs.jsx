import React from 'react';
import Milestones from './Milestones';
import './AboutUs.css';
import { FaCheckCircle } from 'react-icons/fa';
import AboutUs1 from '../../assets/home/AboutUs1.jpeg';
import AboutUs2 from '../../assets/home/AboutUs2.jpeg'; // Assuming you have a second image
 // Add a second image
 
import { useState, useEffect, useRef } from "react";

const AboutUs = () => {
  return (
    <div>
      {/* First Section */}
      <div className="aboutus-container">
        <div className="aboutus-left">
          <img src={AboutUs1} alt="About Us" className="aboutus-image" />
        </div>
        <div className="aboutus-right">
          <h2>Your dream events start's with right vendors</h2>
          <p>
            Our Platform-as-a-service (PaaS) Company empowers vendors to effortlessly list their services while enabling customers to seamlessly discover and book them. Whether you're a service provider looking for a streamlined way to manage bookings or a customer searching for reliable services, our platform bridges the gap with efficiency and ease.
          </p>
          <ul className="aboutus-points">
            <li><FaCheckCircle className="check-icon" />For Vendors: Expand your reach, manage bookings effortlessly, and grow your business.</li>
            <li><FaCheckCircle className="check-icon" />For Customers: Find trusted services, compare options, and book with confidence.</li>
          </ul>
          <button className="learn-more-btn">Book now</button>
        </div>
      </div>
      <Milestones />

      {/* Second Section (Reversed Layout) */}
      <div className="aboutus-container reverse">
        <div className="aboutus-right">
          <h2>We Bring Vendors & Customers Together</h2>
          <p>
            Our intuitive platform and smart discovery system ensure vendors gain visibility, while customers enjoy hassle-free event planning. Whether it's a wedding, corporate event, or party—our platform brings everything under one roof.
          </p>
          <ul className="aboutus-points">
            <li><FaCheckCircle className="check-icon" />AI-driven service discovery & recommendations</li>
            <li><FaCheckCircle className="check-icon" />Secure booking and transparent reviews</li>
          </ul>
          <button className="learn-more-btn">Explore Services</button>
        </div>
        <div className="aboutus-left">
          <img src={AboutUs2} alt="About Platform" className="aboutus-image" />
        </div>
      </div>
    </div>

    
  );
};

export default AboutUs;
