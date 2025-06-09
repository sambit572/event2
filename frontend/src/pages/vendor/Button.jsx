// <<<<<<< HEAD
// import React from 'react';
// import './Button.css';

// export default function PaymentFormButtons({ onBack, onNext }) {
//   return (
//     <div className="form-buttons">
//       <button type="button" className="back-btn" onClick={onBack}>
//         <img src="/back.png" alt="Back" className="payment-back-arrow-icon" />
//         Back
//       </button>

//       <button type="button" className="next-btn" onClick={onNext}>
//         Next
//         <img src="/next.png" alt="Next" className="payment-next-arrow-icon" />
//       </button>
//     </div>
//   );
// }
// =======
// import './Button.css';

import React from "react";

const Button = ({ handleBack, handleNext, currentStep, steps }) => {
  return (
    <div className="navigation-buttons">
      <button
        type="button"
        onClick={handleBack}
        disabled={currentStep === 0}
        className="back-button"
      >
        <span className="btn-content">
          <img
            src="/public/back.png"
            alt="Back"
            className="button-icon left-icon"
          />
          Back
        </span>
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentStep === steps.length - 1}
        className="submit-button"
      >
        <span className="btn-content">
          Next
          <img
            src="/public/next.png"
            alt="Next"
            className="button-icon right-icon"
          />
        </span>
      </button>
    </div>
  );
};

export default Button;
