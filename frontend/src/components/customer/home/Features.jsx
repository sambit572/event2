import React from "react";

const PriceTagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M9 11L4 16a1.5 1.5 0 0 0 2.121 2.121L11 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M15 13l5-5a1.5 1.5 0 0 0-2.121-2.121L13 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 11l2-2 4 4-2 2-4-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 7l2-2M7 13l-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const EMIIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="7" cy="15" r="1" fill="currentColor"/>
    <circle cx="11" cy="15" r="1" fill="currentColor"/>
    <circle cx="15" cy="15" r="1" fill="currentColor"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M12 2l2.4 3.2 3.8-.8.4 3.8 3.4 1.8-1.8 3.4 1.8 3.4-3.4 1.8-.4 3.8-3.8-.8L12 22l-2.4-2.6-3.8.8-.4-3.8L2 14.6l1.8-3.4L2 7.8l3.4-1.8.4-3.8 3.8.8L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M8.5 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M12 2L3 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VendorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17 15c2.21 0 4 1.567 4 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const features = [
  { text: "Transparent Pricing", icon: <PriceTagIcon />, accent: "#FF6B6B" },
  { text: "Live Negotiation",    icon: <HandshakeIcon />, accent: "#FFD93D" },
  { text: "EMI for All",         icon: <EMIIcon />,       accent: "#6BCB77" },
  { text: "Verified Vendors",    icon: <VerifiedIcon />,  accent: "#4ECDC4" },
  { text: "Secure Payments",     icon: <ShieldIcon />,    accent: "#C77DFF" },
  { text: "Multiple Vendors",    icon: <VendorsIcon />,   accent: "#FF9A3C" },
];

const FeatureChip = ({ text, icon, accent }) => (
  <div
    className="eb-chip-outer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "0 32px",
      whiteSpace: "nowrap",
      position: "relative",
      cursor: "default",
    }}
  >
    {/* Diamond separator */}
    <span
      style={{
        width: "5px",
        height: "5px",
        background: "rgba(255,255,255,0.2)",
        transform: "rotate(45deg)",
        borderRadius: "1px",
        marginRight: "8px",
        flexShrink: 0,
      }}
    />

    {/* Icon bubble */}
    <span
      className="eb-icon-bubble"
      data-accent={accent}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: accent + "20",
        border: "1.5px solid " + accent + "55",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accent,
        flexShrink: 0,
        /* subtle default glow */
        boxShadow: "0 0 14px " + accent + "70, 0 0 30px " + accent + "35",
        filter: "drop-shadow(0 0 5px " + accent + "80)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
      }}
    >
      {icon}
    </span>

    {/* Label */}
    <span
      className="eb-chip-label"
      style={{
        fontFamily: "'Syne', 'Montserrat', sans-serif",
        fontSize: "13.5px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#f0f0ff",
        textTransform: "uppercase",
        /* subtle text glow */
        textShadow: "0 0 12px rgba(220,220,255,0.55), 0 0 28px rgba(200,200,255,0.25)",
        transition: "text-shadow 0.25s ease, color 0.25s ease",
      }}
    >
      {text}
    </span>
  </div>
);

const Features = () => {
  const items = [...features, ...features, ...features];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes eventsMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .eb-features-track {
          animation: eventsMarquee 30s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
        }
        .eb-features-track:hover {
          animation-play-state: paused;
        }

        /* Hover: icon glows much brighter */
        .eb-chip-outer:hover .eb-icon-bubble {
          transform: scale(1.15) rotate(-6deg);
          box-shadow: 0 0 22px var(--chip-accent, #fff) , 0 0 50px var(--chip-accent, #fff), 0 0 80px var(--chip-accent, #fff) !important;
          filter: drop-shadow(0 0 10px var(--chip-accent, #fff)) !important;
        }

        /* Hover: text glows brighter */
        .eb-chip-outer:hover .eb-chip-label {
          color: #ffffff;
          text-shadow: 0 0 14px rgba(255,255,255,0.85), 0 0 30px rgba(200,200,255,0.5) !important;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          background: "linear-gradient(105deg, #0b0b1f 0%, #0f1535 40%, #0d1a30 70%, #0b0b1f 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "15px 0",
          position: "relative",
          marginTop: "8px",
        }}
      >
        {/* Left edge fade */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "80px",
          background: "linear-gradient(to right, #0b0b1f, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        {/* Right edge fade */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
          background: "linear-gradient(to left, #0b0b1f, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        <div className="eb-features-track">
          {items.map((f, i) => (
            <FeatureChip key={i} {...f} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;
