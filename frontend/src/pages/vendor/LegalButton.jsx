import React from 'react';
import { useNavigate } from 'react-router-dom';  
import './LegalButton.css';

export default function LegalButton() {
  const navigate = useNavigate();

  return (
    <div className="form-buttons">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate('/vendor/payment-info')}
      >
        <img src="/back.png" alt="Back" className="back-arrow-icon" />
        Back
      </button>
      <button type="submit" className="submits-btn">Submit</button>
    </div>
  );
}
