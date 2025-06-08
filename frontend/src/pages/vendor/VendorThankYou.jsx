import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorThankYou.css';

export default function VendorThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <div className="checkmark-wrapper">
          <svg className="animated-check" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="23" fill="none" />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h1>Thank you!</h1>
        <p>
          We've received your submission. You can find more information on our website or social pages.
        </p>

        <div className="thankyou-actions">
          <div className="thankyou-social">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <img src="/facebook 1.png" alt="Facebook" className="social-icon-img" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <img src="/linkedin-2 1.png" alt="LinkedIn" className="social-icon-img" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src="/instagram-2 1.png" alt="Instagram" className="social-icon-img" />
              </a>
              <a href="#" aria-label="Email">
                <img src="/email-2 1.png" alt="Email" className="social-icon-img" />
              </a>
            </div>
          </div>

          <div className="thankyou-visit">
            <h3>Visit Our Website</h3>
            <button onClick={() => navigate('/')}>Go to Homepage</button>
          </div>
        </div>
      </div>
    </div>
  );
}
