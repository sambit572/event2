import React from 'react';
import './Footer.css';
import payment from "../../assets/home/payment.png";


function Footer() {
  return (
    <footer className="footer-enhanced">
      <div className="footer-top">
        <h3 className='top-h3'>Your one-stop platform for Booking Events effortlessly</h3>
        <p className='top-p'>EXPERIENCE EVENTSBIDGE APP ON MOBILE</p>
        <div className="app-buttons">
          <img src="/App Store.png" alt="Google Play" />
          <img src="/Google_Play.png" alt="App Store" />
        </div>
      </div>

      <div className="footer-columns-wrapper">
        <div className="footer-columns">
          <div className='flex flex-row gap-20'>
            <div>
              <h4 className='columns-h4'>Contact Information</h4>
              <p className='columns-p'><img src="/mail.png" alt="Email icon" className="icon" /> Email@Example.Com</p>
              <p className='columns-p'><img src="/phone 1.png" alt="Phone icon" className="icon" /> 123-456-7890,3456780</p>
              <p className='columns-p'><img src="/location.png" alt="Location icon" className="icon" />Bhubaneswar,Odisha</p>
            </div>

            <div className='links'>
              <h4 className='links-h4'>Quick Links</h4>
              <div className='links-p'>About Us</div>
              <div className='links-p'>Services</div>
              <div className='links-p'>Help</div>
              <div className='links-p'>FAQs</div>
            </div>
          </div>


          <div className='flex flex-row gap-20'>
            <div className='policy'>
              <h4 className='policy-h4'>Privacy Policy</h4>
              <p className='policy-p'>Terms and Conditions</p>
              <p className='policy-p'>Refund Policy</p>
              <p className='policy-p'>Legal Information</p>
            </div>

            <div className='company'>
              <h4 className='company-p'>About Company</h4>
              <p className='company-p'>Our Approach</p>
              <p className='company-p'>Awards & Reviews</p>
              <p className='company-p'>About HostGator</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row gap-20'>
      <div className="social-media">
        <div className='s-h4'>Follow Us</div>
        <img src="/facebook 1.png" alt="Facebook" className="social-icon" />
        <img src="/twitter 1.png" alt="Twitter" className="social-icon" />
        <img src="/instagram-2 1.png" alt="Instagram" className="social-icon" />
        <img src="/linkedin-2 1.png" alt="LinkedIn" className="social-icon" />
        <img src="/email-2 1.png" alt="Gmail" className="social-icon" />
        <img src="/whatsapp.png" alt="Whatsapp" className="social-icon" />
      </div>

      <div className='footer-payment'>
        <img src={payment} alt="" />
      </div>
      </div>

      <div className="footer-bottom">
        <div className='bottom-language'>🌐 India | English</div>
        <div className='bottom-copy'>© Copyright 2025 EventsBridge. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;