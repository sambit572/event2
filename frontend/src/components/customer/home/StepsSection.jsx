import React, { useEffect, useRef, useState } from "react";

// Placeholder icon components (replace with your actual image imports)
const StepIcon = ({ label }) => (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-2xl">{label}</span>
  </div>
);

const steps = [
  {
    title: "Search Services",
    text: "Find event services easily by category and budget.",
    icon: "🔍",
    color: "#fef9e7",
    accent: "#f4c430",
  },
  {
    title: "Compare Options",
    text: "Check vendor profiles, pricing details, and reviews.",
    icon: "⚖️",
    color: "#fef9e7",
    accent: "#f4c430",
  },
  {
    title: "Live Negotiation",
    text: "Connect directly with vendors to finalize all details.",
    icon: "🤝",
    color: "#fef9e7",
    accent: "#f4c430",
  },
  {
    title: "Pay Now / Pay with EMI",
    text: "Choose flexible payment options and pay instantly or with easy EMIs.",
    icon: "💳",
    color: "#fef9e7",
    accent: "#f4c430",
  },
  {
    title: "Secure Booking",
    text: "Complete your booking safely with secure online payment.",
    icon: "🔒",
    color: "#fef9e7",
    accent: "#f4c430",
  },
  {
    title: "Enjoy Your Event",
    text: "Relax and celebrate while we handle all the hassle.",
    icon: "🎉",
    color: "#fef9e7",
    accent: "#f4c430",
  },
];

// Stagger offsets: alternating up-down pattern matching image 2
// Pattern: down, up, down, up, down, up (translateY values)
const staggerPattern = [
  "translateY(0px)",
  "translateY(32px)",
  "translateY(0px)",
  "translateY(32px)",
  "translateY(0px)",
  "translateY(32px)",
];

const StepsSection = () => {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => setIsHeadingVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (headingRef.current) headingObserver.observe(headingRef.current);
    return () => headingObserver.disconnect();
  }, []);

  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisibleCards((prev) =>
              prev.includes(idx) ? prev : [...prev, idx]
            );
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((ref) => ref && cardObserver.observe(ref));
    return () => cardObserver.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito:wght@400;600&display=swap');

        .steps-section {
          font-family: 'Nunito', sans-serif;
          padding: 60px 24px 80px;
          background: linear-gradient(160deg, #f8f5ee 0%, #fffdf5 60%, #f0ede4 100%);
          position: relative;
          overflow: hidden;
        }

        .steps-section::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,196,48,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .steps-section::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,31,63,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .steps-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #001f3f;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          position: relative;
        }

        .steps-heading .underline-bar {
          display: block;
          height: 4px;
          border-radius: 99px;
          background: linear-gradient(90deg, #001f3f 0%, #f4c430 50%, #001f3f 100%);
          margin: 10px auto 0;
          transition: width 1s cubic-bezier(.77,0,.175,1);
        }

        .steps-subtext {
          text-align: center;
          color: #3a5068;
          font-size: clamp(0.85rem, 2vw, 1.05rem);
          max-width: 680px;
          margin: 0 auto 56px;
          line-height: 1.7;
          font-weight: 400;
        }

        /* ── Staggered grid wrapper ── */
        .steps-grid {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          gap: 18px;
          padding-bottom: 40px; /* room for the downward-shifted cards */
        }

        /* Each card slot */
        .step-slot {
          flex: 1;
          min-width: 0;
          max-width: 190px;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);
        }

        /* Apply the stagger via inline style (set in JSX) */

        /* The card itself */
        .step-card {
          background: #fffef5;
          border: 1.5px solid rgba(180,160,80,0.22);
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0,31,63,0.07), 0 1px 4px rgba(0,0,0,0.04);
          padding: 28px 16px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: default;
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          height: 240px;
          justify-content: flex-start;

          /* entrance animation */
          opacity: 0;
          transform: translateY(24px) scale(0.96);
        }

        .step-card.visible {
          animation: cardReveal 0.55s cubic-bezier(.22,1,.36,1) forwards;
        }

        .step-card:hover {
          box-shadow: 0 12px 36px rgba(0,31,63,0.13), 0 2px 8px rgba(244,196,48,0.18);
          border-color: rgba(244,196,48,0.5);
          transform: translateY(-4px) scale(1.02);
        }

        @keyframes cardReveal {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Step number badge */
        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #001f3f;
          color: #f4c430;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        /* Icon circle */
        .step-icon-wrap {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8eff7 0%, #dde8f5 100%);
          box-shadow: 0 2px 8px rgba(0,31,63,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          flex-shrink: 0;
          font-size: 1.6rem;
          transition: transform 0.3s ease;
        }

        .step-card:hover .step-icon-wrap {
          transform: scale(1.1) rotate(-4deg);
        }

        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #001f3f;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .step-text {
          font-size: 0.78rem;
          color: #4a6580;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Connector dots between cards (desktop only) */
        .connector-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-bottom: 8px;
        }
        .connector-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(244,196,48,0.5);
          flex-shrink: 0;
        }
        .connector-line {
          flex: 1;
          max-width: 190px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent);
        }

        /* ── MOBILE: single column, no stagger ── */
        @media (max-width: 639px) {
          .steps-grid {
            flex-direction: column;
            align-items: center;
            padding-bottom: 0;
            gap: 14px;
          }

          .step-slot {
            max-width: 340px;
            width: 100%;
            transform: none !important; /* override stagger on mobile */
          }

          .step-card {
            height: auto;
            flex-direction: row;
            text-align: left;
            padding: 18px 20px;
            align-items: flex-start;
            gap: 14px;
          }

          .step-icon-wrap {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            font-size: 1.3rem;
            margin-bottom: 0;
          }

          .step-badge {
            display: none; /* hidden on mobile row layout */
          }

          .mobile-text {
            display: flex;
            flex-direction: column;
          }

          .connector-row {
            display: none;
          }
        }

        /* ── TABLET: 2 columns ── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .steps-grid {
            flex-wrap: wrap;
            padding-bottom: 0;
            gap: 16px;
          }

          .step-slot {
            flex: 0 0 calc(33.333% - 16px);
            max-width: calc(33.333% - 16px);
            transform: none !important;
          }

          .step-card {
            height: 230px;
          }

          .connector-row { display: none; }
        }
      `}</style>

      <div className="steps-section">
        {/* Heading */}
        <div ref={headingRef}>
          <h2 className="steps-heading">
            How EventsBridge Works
            <span
              className="underline-bar"
              style={{ width: isHeadingVisible ? "220px" : "0px" }}
            />
          </h2>
        </div>

        <p className="steps-subtext">
          From Search to Celebration – We've Got You Covered. Discover trusted
          vendors, compare options, negotiate directly, and book securely all in
          one place.
        </p>

        {/* Staggered Cards Grid */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-slot"
              style={{ transform: staggerPattern[index] }}
            >
              <div
                className={`step-card ${visibleCards.includes(index) ? "visible" : ""}`}
                data-index={index}
                ref={(el) => (cardRefs.current[index] = el)}
                style={{
                  animationDelay: visibleCards.includes(index)
                    ? `${index * 80}ms`
                    : "0ms",
                }}
              >
                <div className="step-badge">0{index + 1}</div>

                {/* Icon */}
                <div className="step-icon-wrap">
                  {/* Replace with your <img> tag using step.src / step.srcSet */}
                  <span>{step.icon}</span>
                </div>

                {/* Text (wrapped for mobile row layout) */}
                <div className="mobile-text">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-text">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StepsSection;
