import React from 'react';
import './Footer.css';


function Footer() {
  return (
      <footer className="footer-enhanced">
        <div className="footer-top">
          <h3>Your one-stop platform for Booking Events effortlessly</h3>
          <p>EXPERIENCE EVENTSBIDGE APP ON MOBILE</p>
          <div className="app-buttons">
            <img src="/App Store.png" alt="Google Play" />
            <img src="/Google_Play.png" alt="App Store" />
          </div>
        </div>

        <div className="footer-columns-wrapper">
          <div className="footer-columns">
            <div>
              <h4>Contact Information</h4>
              <p><img src="/mail.png" alt="Email icon" className="icon" /> Email@Example.Com</p>
              <p><img src="/phone 1.png" alt="Phone icon" className="icon" /> 123-456-7890,3456780</p>
              <p><img src="/location.png" alt="Location icon" className="icon" />Bhubaneswar,Odisha</p>
              <div className="social-media">
                <h4>Follow Us</h4>
                <img src="/facebook 1.png" alt="Facebook" className="social-icon" />
                <img src="/twitter 1.png" alt="Twitter" className="social-icon" />
                <img src="/instagram-2 1.png" alt="Instagram" className="social-icon" />
                <img src="/linkedin-2 1.png" alt="LinkedIn" className="social-icon" />
                <img src="/email-2 1.png" alt="Gmail" className="social-icon" />
                <img src="/whatsapp.png" alt="Whatsapp" className="social-icon" />
              </div>
            </div>

            <div>
              <h4>Quick Links</h4>
              <p>About Us</p>
              <p>Services</p>
              <p>Help</p>
              <p>FAQs</p>
            </div>

            <div>
              <h4>Privacy Policy</h4>
              <p>Terms and Conditions</p>
              <p>Refund Policy</p>
              <p>Legal Information</p>
            </div>

            <div>
              <h4>About Company</h4>
              <p>Our Approach</p>
              <p>Awards & Reviews</p>
              <p>About HostGator</p>
            </div>
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