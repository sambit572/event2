import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stats = [
  { value: "99%",   label: "Customer Certification", yellow: true  },
  { value: "100+",  label: "Verified Vendors",        yellow: false },
  { value: "24 X 7",label: "Support",                 yellow: false },
  { value: "20+",   label: "Service Category",        yellow: true  },
];

export default function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      style={{ background: "#0E0E0E" }}
      className="w-full py-12 sm:py-16"
    >
      <style>{`
        .trust-wrapper {
          padding: 0 16px;
        }
        @media (min-width: 640px) {
          .trust-wrapper { padding: 0 32px; }
        }

        .trust-inner {
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .trust-inner {
            flex-direction: row;
            align-items: center;
            gap: 48px;
          }
        }

        .trust-heading {
          flex: 0 0 auto;
          width: 100%;
        }
        @media (min-width: 768px) {
          .trust-heading {
            width: 38%;
            max-width: 340px;
          }
        }

        .trust-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
          flex: 1;
        }
        @media (min-width: 480px) {
          .trust-cards-grid { gap: 14px; }
        }
        @media (min-width: 768px) {
          .trust-cards-grid { gap: 12px; }
        }
        @media (min-width: 1024px) {
          .trust-cards-grid { gap: 14px; }
        }

        .trust-card {
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 90px;
        }
        @media (min-width: 640px) {
          .trust-card { padding: 20px 22px; min-height: 110px; border-radius: 14px; }
        }
        @media (min-width: 1024px) {
          .trust-card { padding: 24px 26px; min-height: 120px; }
        }

        .trust-card-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          line-height: 1;
          font-size: clamp(22px, 5vw, 40px);
        }
        .trust-card-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(10px, 2vw, 13px);
          font-weight: 500;
          line-height: 1.3;
          margin-top: 4px;
        }
      `}</style>

      <div className="trust-wrapper w-full">
        <motion.div
          ref={ref}
          className="trust-inner"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >

          {/* ── Left: heading ── */}
          <motion.div className="trust-heading" variants={itemVariants}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 4.5vw, 40px)",
              lineHeight: 1.2,
              color: "#fff",
            }}>
              Trusted By Industry
              <br />
              <span style={{ color: "#F5C518" }}>Leaders &amp; Customers</span>
            </h2>
          </motion.div>

          {/* ── Right: 2×2 stat cards ── */}
          <motion.div className="trust-cards-grid" variants={containerVariants}>
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
                className="trust-card"
                style={{
                  background: stat.yellow ? "#F5C518" : "#1B1B3A",
                  cursor: "default",
                }}
              >
                <div
                  className="trust-card-value"
                  style={{ color: stat.yellow ? "#0E0E0E" : "#F5C518" }}
                >
                  {stat.value}
                </div>
                <div
                  className="trust-card-label"
                  style={{ color: stat.yellow ? "#1a1a1a" : "#ccc" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
