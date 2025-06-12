import React from "react";
import "./Button.css";

export default function Button({ onBack, onNext }) {
  return (
    <div className="form-buttons">
      <button type="button" className="back-btn" onClick={onBack}>
        <img src="/back.png" alt="Back" className="payment-back-arrow-icon" />
        Back
      </button>
      <button type="button" className="next-btn" onClick={onNext}>
        Next
        <img src="/next.png" alt="Next" className="payment-next-arrow-icon" />
      </button>
    </div>
  );
}
