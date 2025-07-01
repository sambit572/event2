import React, { useState, useEffect } from 'react';
import './Footer.css';

function Footer() {
  const [openSections, setOpenSections] = useState({
    contact: false,
    quick: false,
    company: false,
    privacy: false
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section) => {
    if (isMobile) {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

  return (
    <footer className="footer-enhanced">
      <div className="footer-top">
        <h3>Your one-stop platform for Booking Events effortlessly</h3>
        <p>EXPERIENCE EVENTSBIDGE APP ON MOBILE</p>
        <div className="app-buttons">
          <img src="/App Store.png" alt="App Store" />
          <img src="/Google_Play.png" alt="Google Play" />
        </div>
      </div>

      <div className="footer-columns-wrapper">
        {/* Desktop */}
        <div className="footer-columns">
          <div>
            <h4>Contact</h4>
            <p><img src="/gmail.png" alt="Email" className="icon" /> Eb@Example.Com</p>
            <p><img src="/phone-call.png" alt="Phone" className="icon" /> 123-456-7890</p>
            <p><img src="/placeholder.png" alt="Location" className="icon" /> Bhubaneswar, Odisha</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p>Our Approach</p>
            <p>About HostGator</p>
            <p>FAQs</p>
          </div>
          <div>
            <h4>Privacy Policy</h4>
            <p>Terms and Conditions</p>
            <p>Refund Policy</p>
            <p>Legal Information</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Awards & Reviews</p>
            <p>Services</p>
            <p>Help Desk</p>
          </div>
        </div>

        {/* Mobile */}
        <div className="footer-columns-mobile-wrapper">
          <div className="footer-row">
            <div className="footer-dropdown">
              <h4 onClick={() => toggleSection('contact')}>
                Contact Us
                <img
                  src={openSections.contact ? '/up-arrow.png' : '/down.png'}
                  alt="dropdown icon"
                  className="dropdown-icon"
                />
              </h4>
              <div className={`footer-dropdown-content ${openSections.contact ? 'show' : ''}`}>
                <p><img src="/gmail.png" alt="Email" className="icon" />Support@eventsbridge.com</p>
                <p><img src="/phone-call.png" alt="Phone" className="icon" /> 123-456-7890</p>
                <p><img src="/placeholder.png" alt="Location" className="icon" /> Bhubaneswar, Odisha</p>
              </div>
            </div>
            <div className="footer-vertical-divider" />
            <div className="footer-dropdown">
              <h4 onClick={() => toggleSection('quick')}>
                Quick Links
                <img
                  src={openSections.quick ? '/up-arrow.png' : '/down.png'}
                  alt="dropdown icon"
                  className="dropdown-icon"
                />
              </h4>
              <div className={`footer-dropdown-content ${openSections.quick ? 'show' : ''}`}>
                <p>Our Approach</p>
                <p>About HostGator</p>
                <p>FAQs</p>
              </div>
            </div>
          </div>

          <div className="footer-row">
            <div className="footer-dropdown">
              <h4 onClick={() => toggleSection('company')}>
                Company
                <img
                  src={openSections.company ? '/up-arrow.png' : '/down.png'}
                  alt="dropdown icon"
                  className="dropdown-icon"
                />
              </h4>
              <div className={`footer-dropdown-content ${openSections.company ? 'show' : ''}`}>
                <p>About Us</p>
                <p>Awards & Reviews</p>
                <p>Services</p>
                <p>Help Desk</p>
              </div>
            </div>
            <div className="footer-vertical-divider" />
            <div className="footer-dropdown">
              <h4 onClick={() => toggleSection('privacy')}>
                Privacy Policy
                <img
                  src={openSections.privacy ? '/up-arrow.png' : '/down.png'}
                  alt="dropdown icon"
                  className="dropdown-icon"
                />
              </h4>
              <div className={`footer-dropdown-content ${openSections.privacy ? 'show' : ''}`}>
                <p>Terms and Conditions</p>
                <p>Refund Policy</p>
                <p>Legal Information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="social-media-column">
        <h4>Follow Us</h4>
        <div className="social-media">
          <a href="https://www.facebook.com/profile.php?id=61578112702655" target="_blank" rel="noopener noreferrer">
          <img src="/facebook.png" alt="Facebook" className="social-icon" />
          </a>
           <a href="https://x.com/EVENTSBRID78581" target="_blank" rel="noopener noreferrer">
          <img src="/twitter 1.png" alt="X" className="social-icon" />
          </a>
          <a href="https://www.instagram.com/eventsbridge__?igsh=MWVmNXNscWlodGVxNA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
          <img src="/instagram.png" alt="Instagram" className="social-icon" />
          </a>
           <a href="https://www.linkedin.com/company/eventsbridge-com/" target="_blank" rel="noopener noreferrer">
          <img src="/linkedin.png" alt="LinkedIn" className="social-icon" />
          </a>
          <a href="mailto:Support@eventsbridge.com" target="_blank" rel="noopener noreferrer">
          <img src="/gmail.png" alt="Gmail" className="social-icon" />
          </a>
           <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
          <img src="/whatsapp.png" alt="Whatsapp" className="social-icon" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div><span>🌐 India | English</span></div>
        <div><p>© Copyright 2025 EventsBridge. All Rights Reserved.</p></div>
      </div>
    </footer>
  );
}

export default Footer;
