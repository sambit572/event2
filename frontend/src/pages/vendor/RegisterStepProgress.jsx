import React from "react";
import "./RegisterStepProgress.css";

export default function ProgressBar({ currentStepIndex }) {
  const progressSteps = [
    { label: 'Registration', icon: '/register.png', step: 'Step 1' },
    { label: 'Service Details', icon: '/service.png', step: 'Step 2' },
    { label: 'Payment Details', icon: '/income 2.png', step: 'Step 3' },
    { label: 'Legal Consents', icon: '/legal.png', step: 'Step 4' }
  ].map((step, index) => ({ ...step, active: index === currentStepIndex }));

  return (
    <div className="register-progress-bar">
      {progressSteps.map((item, index, arr) => (
        <div className="register-progress-wrapper" key={index}>
          <div className="register-progress-step">
            <div className="register-progress-label">{item.label}</div>
            <div className={`register-circle-icon ${item.active ? 'active' : ''}`}>
              <img src={item.icon} alt={item.label} width="30" height="30" />
            </div>
            <div className="register-progress-step-label">{item.step}</div>
          </div>
          {index < arr.length - 1 && <div className="register-line" />}
        </div>
      ))}
    </div>
  );
}
