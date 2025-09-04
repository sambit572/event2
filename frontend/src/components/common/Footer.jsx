import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Navigate, useNavigate } from "react-router-dom";

function Footer() {
  const [openSections, setOpenSections] = useState({
    contact: false,
    quick: false,
    company: false,
    privacy: false,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) => {
    if (isMobile) {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  return (
    <footer className="footer-enhanced">
      <div className="footer-top">
        <h3>Your one-stop platform for Booking Events effortlessly</h3>
        <p>EXPERIENCE EVENTSBIDGE APP ON MOBILE</p>
        <div className="app-buttons">
          <img
            src="/App Store.png"
            alt="App Store"
            className="cursor-pointer"
          />
          <img
            src="/Google_Play.png"
            alt="Google Play"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="footer-columns-wrapper">
        <div className="footer-columns">
          <div>
            <h4>Contact</h4>
            <a
              href="mailto:Support@eventsbridge.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:text-[#ffc107]">
                <img src="/gmail.png" alt="Email" className="icon" />{" "}
                techsupport@eventsbridge.com
              </p>
            </a>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              <img src="/phone-call.png" alt="Phone" className="icon" />{" "}
              <a href="tel:phone_number">+91 1169320147</a>
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              <img src="/placeholder.png" alt="Location" className="icon" />{" "}
              Bhubaneswar, Odisha
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p className="hover:text-[#ffc107] cursor-pointer">Our Approach</p>
            <p className="hover:text-[#ffc107] cursor-pointer">
              About HostGator
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/faqs")}
            >
              FAQs
            </p>
          </div>
          <div>
            <h4>Legal Information</h4>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/terms-and-conditions")}
            >
              Terms and Conditions
            </p>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/refund-policy")}
            >
              Refund Policy
            </p>
            <p
              className="hover:text-[#ffc107]"
              onClick={() => navigate("/privacy-policy")}
            >
              Privacy Policy
            </p>
          </div>
          <div>
            <h4>Company</h4>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/about_us")}
            >
              About Us
            </p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/reviews")}
            >
              Awards & Reviews
            </p>
            <p className="hover:text-[#ffc107]">Services</p>
            <p
              className="hover:text-[#ffc107] cursor-pointer"
              onClick={() => navigate("/help-Center")}
            >
              Help Desk
            </p>
          </div>
        </div>

        {/* Mobile View */}
        <div className="footer-columns-mobile-wrapper">
          <div className="footer-mobile-grid">
            {/* Left Column */}
            <div className="footer-mobile-column">
              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("contact")}>
                  Contact Us
                  <img
                    src={openSections.contact ? "/up-arrow.png" : "/down.png"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.contact ? "show" : ""
                  }`}
                >
                  <p>
                    <img src="/gmail.png" className="icon" alt="" />{" "}
                    techsupport@eventsbridge.com{" "}
                  </p>
                  <p>
                    <img src="/phone-call.png" className="icon" alt="" /> +91
                    1169320147
                  </p>
                  <p>
                    <img src="/placeholder.png" className="icon" alt="" />{" "}
                    Bhubaneswar, Odisha
                  </p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("company")}>
                  Company
                  <img
                    src={openSections.company ? "/up-arrow.png" : "/down.png"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.company ? "show" : ""
                  }`}
                >
                  <p>About Us</p>
                  <p>Awards & Reviews</p>
                  <p>Services</p>
                  <p>Help Desk</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="footer-mobile-column">
              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("quick")}>
                  Quick Links
                  <img
                    src={openSections.quick ? "/up-arrow.png" : "/down.png"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.quick ? "show" : ""
                  }`}
                >
                  <p>Our Approach</p>
                  <p>About HostGator</p>
                  <p>FAQs</p>
                </div>
              </div>

              <div className="footer-dropdown">
                <h4 onClick={() => toggleSection("privacy")}>
                  Legal Information
                  <img
                    src={openSections.privacy ? "/up-arrow.png" : "/down.png"}
                    className="dropdown-icon"
                    alt="toggle"
                  />
                </h4>
                <div
                  className={`footer-dropdown-content ${
                    openSections.privacy ? "show" : ""
                  }`}
                >
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms and Conditions
                  </p>
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/refund-policy")}
                  >
                    Refund Policy
                  </p>
                  <p
                    className="hover:text-[#ffc107]"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="social-media-column">
        <h4>Follow Us</h4>
        <div className="social-media">
          <a
            href="https://www.facebook.com/profile.php?id=61578112702655"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/facebook.png" alt="Facebook" className="social-icon" />
          </a>
          <a
            href="https://x.com/EVENTSBRID78581"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/twitter 1.png" alt="X" className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/eventsbridge__?igsh=MWVmNXNscWlodGVxNA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.png" alt="Instagram" className="social-icon" />
          </a>
          <a
            href="https://www.linkedin.com/company/eventsbridge-com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
          </a>
          <a
            href="mailto:Support@eventsbridge.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/gmail.png" alt="Gmail" className="social-icon" />
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/whatsapp.png" alt="Whatsapp" className="social-icon" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src="/youtube.png" alt="Youtube" className="social-icon" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          <span>🌐 India | English</span>
        </div>
        <div>
          <p>© Copyright 2025 EventsBridge. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
