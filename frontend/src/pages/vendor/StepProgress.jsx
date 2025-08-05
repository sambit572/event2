import React from "react";
import "./StepProgress.css";

function StepProgress({ currentStep }) {
  const steps = [
    { label: "Registration", subLabel: "Step 1", icon: "/verify.png" },
    { label: "Service Details", subLabel: "Step 2", icon: "/service.png" },
    { label: "Payment", subLabel: "Step 3", icon: "/payment.png" },
    { label: "Legal Consents", subLabel: "Step 4", icon: "/legal.png" },
  ];

  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div className="step-wrapper" key={index}>
          <div className="step-label">{step.label}</div>
          <div
            className={`step-circle ${currentStep === index ? "active" : ""}`}
          >
            <img src={step.icon} alt={step.label} />
          </div>
          <div className="step-sub-label">{step.subLabel}</div>
          {index !== steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
}
export default StepProgress;
