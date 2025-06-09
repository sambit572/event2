import React from 'react';

export default function StepProgress({ currentStepIndex }) {
  const progressSteps = [
    { label: 'Registration', icon: '/register.png', step: 'Step 1' },
    { label: 'Service Details', icon: '/service.png', step: 'Step 2' },
    { label: 'Payment Details', icon: '/income 2.png', step: 'Step 3' },
    { label: 'Legal Consents', icon: '/legal.png', step: 'Step 4' }
  ];

  return (
    <div className="progress-container">
      {progressSteps.map((step, index) => (
        <div className="step-wrapper" key={index}>
          <div className="step-label">{step.label}</div>
          <div className={`step-circle ${currentStepIndex === index ? 'active' : ''}`}>
            <img src={step.icon} alt={step.label} />
          </div>
          <div className="step-sub-label">{step.step}</div>
          {index !== progressSteps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
}
