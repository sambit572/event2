import React from "react";

const steps = [
  {
    label: "Registration",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: "Service Detail",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
      </svg>
    ),
  },
  {
    label: "Bank Detail",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="20" height="13" rx="2"/>
        <path d="M2 10h20M6 14h.01M10 14h.01"/>
        <path d="M12 3l9 5H3l9-5z"/>
      </svg>
    ),
  },
  {
    label: "Legal Consents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
      </svg>
    ),
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function StepProgress({ currentStep = 0 }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .sp-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(105deg, #0f172a 0%, #1e293b 55%, #0f172a 100%);
          padding: 28px 40px 26px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .sp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 55%);
          pointer-events: none;
        }

        .sp-track {
          display: flex;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .sp-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        /* Connector line */
        .sp-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 24px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.08);
          z-index: 0;
        }

        .sp-step.completed:not(:last-child)::after {
          background: linear-gradient(90deg, #f59e0b, #6366f1);
        }

        .sp-step.active:not(:last-child)::after {
          background: linear-gradient(90deg, rgba(245,158,11,0.4), rgba(255,255,255,0.06));
        }

        /* Circle */
        .sp-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .sp-circle svg {
          width: 22px;
          height: 22px;
        }

        .sp-step.completed .sp-circle {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: #fff;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.2), 0 6px 20px rgba(245,158,11,0.35);
        }

        .sp-step.active .sp-circle {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.25), 0 8px 24px rgba(99,102,241,0.45);
          transform: scale(1.12);
        }

        .sp-step.pending .sp-circle {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          border: 1.5px solid rgba(255,255,255,0.1);
          box-shadow: none;
        }

        /* Labels */
        .sp-label {
          margin-top: 12px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .sp-step.completed .sp-label { color: #fbbf24; }
        .sp-step.active .sp-label { color: #e0e7ff; }
        .sp-step.pending .sp-label { color: rgba(255,255,255,0.3); }

        .sp-status {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sp-step.completed .sp-status { color: rgba(251,191,36,0.7); }
        .sp-step.active .sp-status {
          color: #818cf8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sp-step.active .sp-status::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .sp-step.pending .sp-status { color: rgba(255,255,255,0.2); }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-track">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            const cls = isCompleted ? "completed" : isActive ? "active" : "pending";
            const status = isCompleted ? "Completed" : isActive ? "In Progress" : "Pending";

            return (
              <div key={step.label} className={`sp-step ${cls}`}>
                <div className="sp-circle">
                  {isCompleted ? <CheckIcon /> : step.icon}
                </div>
                <div className="sp-label">{step.label}</div>
                <div className="sp-status">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
