import React from "react";
import Milestones from "./Milestones";
import ReviewSlider from "./ReviewSlider";
import Design from "./Design";
import "./AboutUs.css";
import { FaCheckCircle } from "react-icons/fa";
import AboutUs_1 from "../../assets/home/AboutUs_1.jpeg";
import Aboutus_2 from "../../assets/home/Aboutus_2.png";
import AboutUs_3 from "../../assets/home/AboutUs_3.png";
import Team from "./Team";

import { useState, useEffect, useRef } from "react";

const AboutUs = () => {
  return (
    <div>
      {/* First Section */}
      <div className="aboutus-container">
        <div className="aboutus-left">
          <img src={AboutUs_1} alt="About Us" className="aboutus-image" />
        </div>
        <div className="aboutus-right">
          <h2>Your dream events start's with right vendors</h2>
          <p>
            Eventsbridge is a next-generation Platform-as-a-Service (PaaS) that
            simplifies how events are planned and managed by connecting
            customers with the right vendors — effortlessly, efficiently, and
            digitally. Whether you're planning a wedding, birthday, religious
            ceremony, or a corporate function, Eventsbridge brings every
            essential service provider under one roof.The platform is designed to empower
            both sides of the event ecosystem: Vendors gain more visibility,
            grow their customer base, and manage bookings with ease. We’re not
            just another event listing website — we’re your full-service digital
            partner. Our mission is to take the stress out of event planning by
            providing a one-stop solution where you can plan, personalize, and
            book all your services with confidence. At Eventsbridge, we don’t
            just help you organize an event — we help you make lasting memories.
          </p>
          <ul className="aboutus-points">
            <li>
              <FaCheckCircle className="check-icon" />
              For Vendors: Expand your reach, manage bookings effortlessly, and
              grow your business.
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              For Customers: Find trusted services, compare options, and book
              with confidence.
            </li>
          </ul>
        </div>
      </div>

      
      <Design />

      {/* Second Section (Reversed Layout) */}
      <div className="aboutus-container reverse">
        <div className="aboutus-right">
          <h2>We Bring Vendors & Customers Together</h2>
          <p>
            Choosing Eventsbridge means choosing convenience, quality, and
            confidence. In today’s fast-paced world, planning an event can feel
            overwhelming — making countless calls, chasing vendors, comparing
            quotes, and worrying about reliability. We built Eventsbridge to
            solve these pain points. Our platform brings all essential event
            services together in one place, offering a smarter, easier way to
            plan.Diverse Offerings: From
            traditional to modern, we support all cultures and event types. We
            stand for trust, professionalism, and customer satisfaction. For
            vendors, we offer a chance to grow without heavy marketing costs.
            For customers, we’re a one-stop platform where your celebration
            begins with a click. From big fat Indian weddings to intimate family
            functions — Eventsbridge makes every event effortless and
            extraordinary.
          </p>
          <ul className="aboutus-points">
            <li>
              <FaCheckCircle className="check-icon" />
              AI-driven service discovery & recommendations
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Secure booking and transparent reviews
            </li>
          </ul>
        </div>
        <div className="aboutus-left">
          <img src={Aboutus_2} alt="About Platform" className="aboutus-image" />
        </div>
      </div>

      <div className="aboutus-container">
        <div className="aboutus-left">
          <img src={AboutUs_3} alt="About Us" className="aboutus-image" />
        </div>
        <div className="aboutus-right">
          
  <h2>Your Perfect Event Starts with Eventsbridge</h2>
  <p>
    Eventsbridge offers an extensive range of event services that cater to every element of your big day — whether it's traditional, cultural, or modern.
    We understand that a great event depends on the small details being just right.
  </p>

  <p>
    That’s why we’ve curated a wide array of services from across regions and traditions, making us your ultimate one-stop booking platform.
  </p>

<div className="services-grid">
  <div className="service-section">
    <h3>🎵 Music & Entertainment</h3>
    <ul>
      <li>DJs</li>
      <li>Brass bands</li>
      <li>Regional bands</li>
      <li>Orchestras (dance and singing)</li>
      <li>Magicians</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>🎀 Decor & Setup</h3>
    <ul>
      <li>Tenthouse and themed decorations</li>
      <li>Flower decorators</li>
      <li>Personalized setups</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>🍽 Culinary Delights</h3>
    <ul>
      <li>Premium catering services</li>
      <li>Diverse menus (regional, traditional, international)</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>📸 Capture Moments</h3>
    <ul>
      <li>Photographers</li>
      <li>Videographers</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>🛐 Religious Services</h3>
    <ul>
      <li>Pandits</li>
      <li>Fathers</li>
      <li>Maulvis</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>💄 Beauty & Grooming</h3>
    <ul>
      <li>Professional makeup artists</li>
      <li>Mehendi artists</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>🚗 Grand Entries</h3>
    <ul>
      <li>Horse carts</li>
      <li>Luxury grooming cars</li>
    </ul>
  </div>

  <div className="service-section">
    <h3>🎆 Special Effects</h3>
    <ul>
      <li>Fireworks</li>
    </ul>
  </div>
   </div>
        </div>
      </div>
      <Team />
    </div>
    
  );
};

export default AboutUs;
