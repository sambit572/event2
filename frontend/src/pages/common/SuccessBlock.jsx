import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

/* ─── Confetti particle generator ─── */
function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.6 + Math.random() * 1.4,
    size: 5 + Math.random() * 7,
    color: [
      "#FBBF24", "#FB923C", "#3B82F6", "#7C3AED",
      "#34D399", "#F472B6", "#60A5FA", "#A78BFA",
    ][Math.floor(Math.random() * 8)],
    shape: Math.random() > 0.5 ? "circle" : "rect",
    rotate: Math.random() * 360,
  }));
}

const PARTICLES = generateParticles(36);

const SuccessBlock = ({ onClose, autoCloseTime = 5000 }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [checkAnim, setCheckAnim] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 30);
    const t2 = setTimeout(() => setCheckAnim(true), 300);
    const t3 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, autoCloseTime);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onClose, autoCloseTime]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  const handleExplore = () => {
    handleClose();
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .eb-success-overlay { font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif; }

        @keyframes eb-fadeOverlay { from{opacity:0}to{opacity:1} }
        @keyframes eb-slideUp {
          from{opacity:0;transform:translateY(40px) scale(0.95)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes eb-slideDown {
          from{opacity:1;transform:translateY(0) scale(1)}
          to{opacity:0;transform:translateY(30px) scale(0.96)}
        }
        @keyframes eb-popIn {
          0%{transform:scale(0);opacity:0}
          60%{transform:scale(1.15);opacity:1}
          80%{transform:scale(0.92)}
          100%{transform:scale(1);opacity:1}
        }
        @keyframes eb-drawCircle {
          from{stroke-dashoffset:314}
          to{stroke-dashoffset:0}
        }
        @keyframes eb-drawCheck {
          from{stroke-dashoffset:80}
          to{stroke-dashoffset:0}
        }
        @keyframes eb-confettiFall {
          0%{transform:translateY(-20px) rotate(0deg);opacity:1}
          100%{transform:translateY(130px) rotate(var(--r,180deg));opacity:0}
        }
        @keyframes eb-sparkle {
          0%,100%{transform:scale(0.8);opacity:0.5}
          50%{transform:scale(1.3);opacity:1}
        }
        @keyframes eb-float {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-7px)}
        }
        @keyframes eb-shimmer {
          from{background-position:-200% center}
          to{background-position:200% center}
        }

        .eb-overlay-anim { animation: eb-fadeOverlay .3s ease forwards; }
        .eb-modal-enter  { animation: eb-slideUp  .45s cubic-bezier(.22,.68,0,1.4) forwards; }
        .eb-modal-leave  { animation: eb-slideDown .35s ease forwards; }
        .eb-sparkle-dot  { animation: eb-sparkle 1.8s infinite; }
        .eb-float-icon   { animation: eb-float 3s ease-in-out infinite; }
        .eb-btn-shimmer  {
          background: linear-gradient(90deg,#3B82F6 0%,#6366F1 40%,#818CF8 55%,#6366F1 70%,#3B82F6 100%);
          background-size: 200% auto;
          animation: eb-shimmer 2.4s linear infinite;
        }
      `}</style>

      <div
        className="eb-success-overlay login-wrapper flex justify-center items-center z-[10000] p-4 eb-overlay-anim"
        style={{ background: "rgba(15,10,40,0.65)", backdropFilter: "blur(10px)" }}
        onClick={handleClose}
      >
        <div
          className={visible ? "eb-modal-enter" : "eb-modal-leave"}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 460,
            borderRadius: 24,
            background: "#ffffff",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(79,70,229,.22), 0 8px 32px rgba(0,0,0,.12)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient header strip */}
          <div style={{
            height: 8,
            background: "linear-gradient(90deg, #FBBF24, #FB923C 30%, #7C3AED 60%, #3B82F6)",
            borderRadius: "24px 24px 0 0",
          }} />

          {/* Confetti */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: 160,
            overflow: "hidden", pointerEvents: "none", zIndex: 0,
          }}>
            {PARTICLES.map((p) => (
              <div key={p.id} style={{
                position: "absolute",
                left: `${p.x}%`,
                top: -12,
                width: p.size,
                height: p.shape === "rect" ? p.size * 0.5 : p.size,
                borderRadius: p.shape === "circle" ? "50%" : 2,
                background: p.color,
                "--r": `${p.rotate}deg`,
                animation: `eb-confettiFall ${p.duration}s ${p.delay}s ease-in both`,
                opacity: 0,
              }} />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute", top: 18, right: 18, zIndex: 20,
              width: 32, height: 32, borderRadius: "50%",
              background: "#F3F4F6", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "#6B7280",
              transition: "background .2s, color .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background="#EF4444"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="#F3F4F6"; e.currentTarget.style.color="#6B7280"; }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Body */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "36px 40px 40px",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
          }}>

            {/* Animated success icon */}
            <div className="eb-float-icon" style={{ position: "relative", width: 110, height: 110, marginBottom: 24 }}>
              {/* Glow aura */}
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(52,211,153,.25) 0%, transparent 70%)",
              }} />

              {/* Animated ring */}
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                  <linearGradient id="eb-ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#FBBF24" />
                    <stop offset="50%"  stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                {checkAnim && (
                  <circle cx="55" cy="55" r="50" fill="none"
                    stroke="url(#eb-ringGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 314,
                      strokeDashoffset: 314,
                      animation: "eb-drawCircle 0.8s ease forwards",
                    }}
                  />
                )}
              </svg>

              {/* Green circle + checkmark */}
              {checkAnim && (
                <div style={{
                  position: "absolute", top: 10, left: 10, width: 90, height: 90,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "eb-popIn .6s ease forwards",
                }}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path
                      d="M10 22L18 30L34 14"
                      stroke="#059669"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 80,
                        strokeDashoffset: 80,
                        animation: "eb-drawCheck 0.5s .55s ease forwards",
                      }}
                    />
                  </svg>
                </div>
              )}

              {/* Sparkle dots */}
              {[
                { top: -2, left: 48, delay: ".2s", color: "#FBBF24" },
                { top: 18, left: -4, delay: ".5s", color: "#7C3AED" },
                { top: -2, left: 62, delay: ".8s", color: "#3B82F6" },
                { top: 80, left: -4, delay: ".4s", color: "#34D399" },
                { top: 88, left: 70, delay: ".7s", color: "#FB923C" },
              ].map((s, i) => (
                <div key={i} className="eb-sparkle-dot" style={{
                  position: "absolute", top: s.top, left: s.left,
                  width: 8, height: 8, borderRadius: "50%",
                  background: s.color, animationDelay: s.delay,
                }} />
              ))}
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #FB923C 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 8, lineHeight: 1.25,
            }}>
              Welcome to EventsBridge! 🎉
            </h2>

            {/* Sub-heading badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
              borderRadius: 100, padding: "5px 14px", marginBottom: 16,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#065F46", letterSpacing: ".2px" }}>
                ✓ You are now successfully logged in
              </span>
            </div>

            {/* Body text */}
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, maxWidth: 340, marginBottom: 28 }}>
              Thank you for joining us! Ready to{" "}
              <span style={{ color: "#4F46E5", fontWeight: 600 }}>discover</span>,{" "}
              <span style={{ color: "#7C3AED", fontWeight: 600 }}>compare</span>, and{" "}
              <span style={{ color: "#FB923C", fontWeight: 600 }}>book</span>{" "}
              top event vendors without budget pressure?
            </p>

            {/* Event icons row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28, fontSize: 22 }}>
              {["🌸", "✨", "🎊", "💐", "🎶"].map((icon, i) => (
                <span key={i} className="eb-sparkle-dot" style={{ animationDelay: `${i * 0.15}s` }}>{icon}</span>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={handleExplore}
              className="eb-btn-shimmer"
              style={{
                width: "100%", border: "none", borderRadius: 14,
                padding: "14px 0", color: "#fff", fontSize: 15,
                fontWeight: 700, letterSpacing: "0.3px", cursor: "pointer",
                boxShadow: "0 6px 24px rgba(59,130,246,.35)",
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(59,130,246,.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(59,130,246,.35)";
              }}
            >
              Start Exploring Events →
            </button>

            <p style={{ marginTop: 14, fontSize: 12, color: "#9CA3AF" }}>
              Auto-closing in a few seconds…
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

SuccessBlock.propTypes = {
  onClose: PropTypes.func.isRequired,
  autoCloseTime: PropTypes.number,
};

export default SuccessBlock;
