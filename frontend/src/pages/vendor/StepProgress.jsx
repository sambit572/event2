import React from "react";

function StepProgress({ currentStep }) {
  const steps = [
    { label: "Registration", icon: "/verify.webp" },
    { label: "Service Detail", icon: "/service.webp" },
    { label: "Bank Detail", icon: "/payment.webp" },
    { label: "Legal Consents", icon: "/legal.webp" },
  ];

  // SVG Checkmark component
  const Checkmark = () => (
    <svg
      className="w-full h-full text-white p-1 sm:p-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
  );

  return (
    // UPDATED: Added margin-top for space from the navbar
    <div className="w-full max-w-4xl mx-auto mt-[8px] sm:mt-[12px] rounded-2xl p-3 sm:p-4 font-sans" style={{ background: "linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = !isCompleted && !isActive;

          const statusText = isCompleted
            ? "Completed"
            : isActive
            ? "In Progress"
            : "Pending";

          return (
            <div
              className="relative flex-1 flex flex-col items-center text-center"
              key={step.label}
            >
              {/* --- Connecting Line --- */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute left-1/2 w-full h-1 transition-colors duration-500
                    ${isCompleted ? "bg-teal-500" : "bg-white/15"}
                    top-[18px] sm:top-[26px]
                  `}
                />
              )}

              {/* --- Step Circle --- */}
              <div
                className={`
                  relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isCompleted ? "bg-teal-500 border-teal-500" : ""}
                  ${isActive ? "bg-white border-teal-500 scale-110" : ""}
                  ${isPending ? "bg-white/10 border-white/20" : ""}
                  w-10 h-10 sm:w-14 sm:h-14
                `}
              >
                {isCompleted ? (
                  <Checkmark />
                ) : (
                  <img
                    decoding="async"
                    loading="lazy"
                    src={step.icon}
                    alt={statusText}
                    className="
                      w-5 h-5 sm:w-7 sm:h-7
                    "
                  />
                )}
              </div>

              {/* --- Top Label (e.g., "Registration") --- */}
              <div
                className={`
                  mt-3 font-semibold whitespace-nowrap
                  ${isActive ? "text-teal-400" : "text-white/80"}
                  ${isPending ? "text-white/40" : ""}
                  text-[11px] sm:text-base
                `}
              >
                {step.label}
              </div>

              {/* --- Bottom Status Label (e.g., "Completed") --- */}
              <div
                className={`
                  mt-1.5 font-medium
                  ${isCompleted || isActive ? "text-teal-400" : "text-white/40"}
                  text-[10px] sm:text-sm
                `}
              >
                {statusText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgress;