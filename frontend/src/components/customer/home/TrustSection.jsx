import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function IconBox({ emoji, dark = false }) {
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}

export default function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20" style={{ background: "#0E0E0E" }}>

      {/* ── Scoped responsive styles ── */}
      <style>{`
        .trust-bento {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .trust-left-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .trust-right-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        /* ── tablet+ : classic 2-col bento ── */
        @media (min-width: 768px) {
          .trust-bento {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .trust-left-col {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .trust-right-col {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
        }
        /* tall cards — shorter on mobile, taller on desktop */
        .trust-card-tall {
          min-height: 180px;
        }
        @media (min-width: 768px) {
          .trust-card-tall { min-height: 260px; }
        }
        /* short cards — equal height in mobile 2-col grid */
        .trust-card-short {
          min-height: 150px;
        }
        @media (min-width: 768px) {
          .trust-card-short { min-height: unset; flex: 1; }
        }
      `}</style>

      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24">

        {/* ── Top label ── */}
        <motion.p
          className="text-xs font-bold tracking-widest uppercase mb-10 sm:mb-14 text-center"
          style={{ color: "#F5C518", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          TRUSTED BY INDUSTRY LEADERS &amp; HOSTS
        </motion.p>

        {/* ══ BENTO GRID ══ */}
        <motion.div
          ref={ref}
          className="trust-bento"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >

          {/* ══ LEFT COLUMN — 2 tall cards ══ */}
          <div className="trust-left-col">

            {/* Card 1 : 98% — YELLOW */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="trust-card-tall"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(135deg, #F5C518 0%, #FFD84D 60%, #FFE97A 100%)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                boxShadow: "0 8px 40px rgba(245,197,24,0.28)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* decorative circle */}
              <div style={{
                position: "absolute", top: "-24px", right: "-24px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "rgba(255,255,255,0.22)", pointerEvents: "none",
              }} />

              <IconBox emoji="🏆" dark={false} />

              <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                <div style={{
                  fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900,
                  lineHeight: 1, letterSpacing: "-2px", color: "#111",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "8px",
                }}>
                  98%
                </div>
                <p style={{ fontWeight: 700, fontSize: "clamp(12px, 2vw, 15px)", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Satisfaction Rate
                </p>
                <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", marginTop: "2px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  From verified bookings
                </p>
              </div>
            </motion.div>

            {/* Card 2 : 15k+ — DARK */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="trust-card-tall"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(140deg, #181818 0%, #1E1E1E 100%)",
                border: "1.5px solid #272727",
                boxShadow: "0 4px 28px rgba(0,0,0,0.5)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{
                position: "absolute", bottom: "-24px", right: "-24px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(245,197,24,0.07), transparent)",
                pointerEvents: "none",
              }} />

              <IconBox emoji="🎉" dark={true} />

              <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                <div style={{
                  fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900,
                  lineHeight: 1, letterSpacing: "-2px", color: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "8px",
                }}>
                  15k+
                </div>
                <p style={{ fontWeight: 700, fontSize: "clamp(12px, 2vw, 15px)", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Events Celebrated
                </p>
                <p style={{ fontSize: "11px", color: "#555", marginTop: "2px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Across India
                </p>
              </div>
            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN — 3 shorter cards ══ */}
          <div className="trust-right-col">

            {/* Card 3 : 24/7 — DARK */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="trust-card-short"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(140deg, #181818 0%, #1F1F1F 100%)",
                border: "1.5px solid #272727",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconBox emoji="🎧" dark={true} />
              </div>
              <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                <div style={{
                  fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900,
                  lineHeight: 1, letterSpacing: "-1.5px", color: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "6px",
                }}>
                  24/7
                </div>
                <p style={{ fontWeight: 700, fontSize: "clamp(11px, 1.8vw, 14px)", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Support Available
                </p>
                <p style={{ fontSize: "11px", color: "#555", marginTop: "2px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Always here for you
                </p>
              </div>
            </motion.div>

            {/* Card 4 : 100% — DARK + yellow number */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="trust-card-short"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(140deg, #1A1A1A 0%, #212121 100%)",
                border: "1.5px solid #272727",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconBox emoji="🔒" dark={true} />
              </div>
              <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                <div style={{
                  fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900,
                  lineHeight: 1, letterSpacing: "-1.5px", color: "#F5C518",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "6px",
                }}>
                  100%
                </div>
                <p style={{ fontWeight: 700, fontSize: "clamp(11px, 1.8vw, 14px)", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Secure Payments
                </p>
                <p style={{ fontSize: "11px", color: "#555", marginTop: "2px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Encrypted &amp; safe
                </p>
              </div>
            </motion.div>

            {/* Card 5 : Testimonial — YELLOW — spans full width on mobile */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="trust-card-short"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                gridColumn: "1 / -1",   /* full width in 2-col mobile grid */
                background: "linear-gradient(135deg, #F5C518 0%, #FFD84D 100%)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 32px rgba(245,197,24,0.22)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "140px",
              }}
            >
              <div style={{
                fontSize: "44px", fontWeight: 900, lineHeight: 1,
                color: "rgba(0,0,0,0.15)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginBottom: "4px",
              }}>
                "
              </div>
              <p style={{
                fontSize: "13px", fontWeight: 600, lineHeight: "1.5",
                color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif",
                flex: 1, marginBottom: "14px",
              }}>
                Brilliant platform — saved us hours on every corporate event!
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  background: "#111", color: "#F5C518",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "13px", fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  R
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Rohit Sharma
                  </p>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: "#111", fontSize: "11px" }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* ── Footer strip ── */}
        <motion.div
          className="mt-10 sm:mt-14 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
          style={{ borderTop: "1px solid #1F1F1F" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            © 2025 EventsBridge. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#F5C518" }} />
            <span className="text-white font-black text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              EventsBridge
            </span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map((link) => (
              <span key={link}
                className="text-gray-600 text-xs sm:text-sm cursor-pointer hover:text-white transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {link}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
