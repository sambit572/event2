import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function HeroSection() {
  const scrollY = useMotionValue(0);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <motion.section
      style={{
        opacity,
        background:
          "radial-gradient(ellipse at 60% 50%, #F5C518 0%, #FAD961 25%, #FDE99A 55%, #FEF6D0 80%, #FFFBEE 100%)",
        paddingTop: "94px",
      }}
      className="relative w-full min-h-screen overflow-hidden flex items-center"
    >
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 py-16">

        {/* ===== LEFT CONTENT ===== */}
        <motion.div
          className="flex-1 w-full max-w-full lg:max-w-[52%]"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/80 border border-yellow-300 rounded-full px-4 py-2 mb-8 shadow-sm"
          >
            <span className="text-sm">🏅</span>
            <span
              className="text-xs font-bold tracking-widest text-gray-800"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              100+ VERIFIED VENDORS
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-black leading-none mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="block text-6xl sm:text-7xl lg:text-7xl xl:text-8xl text-gray-900 tracking-tight">
              Celebrate
            </span>
            <span
              className="block text-6xl sm:text-7xl lg:text-7xl xl:text-8xl tracking-tight"
              style={{ color: "#E6A800", fontStyle: "italic" }}
            >
              Without
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-7xl xl:text-8xl text-gray-900 tracking-tight">
              Limits
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 max-w-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            The Digital Concierge for modern celebrations. Book luxury venues,
            artisan catering, and master planners in one click.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex gap-4 flex-wrap items-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {/* ✅ FIX: was missing the opening `<a` — only `href=` was present */}
            <a
              href="#categories"
              className="flex items-center gap-3 text-white font-bold text-base px-7 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{
                backgroundColor: "#111111",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Book Now <span className="text-lg">→</span>
            </a>
            <button
              className="flex items-center gap-2 border-2 border-gray-900 text-gray-900 font-bold text-base px-7 py-4 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Pay With EMI
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex -space-x-3">
              {["#4A90D9", "#E67E22", "#27AE60"].map((color, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: color, zIndex: 3 - i }}
                >
                  {["A", "B", "C"][i]}
                </div>
              ))}
            </div>
            <p
              className="text-sm text-gray-600 font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Joined by{" "}
              <span className="font-bold text-gray-900">2.4k+</span> happy
              hosts this month
            </p>
          </motion.div>
        </motion.div>

        {/* ===== RIGHT — PHONE MOCKUP ===== */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end items-center relative w-full"
          style={{ minHeight: "520px" }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        >
          {/* TOP RATED floating card */}
          <motion.div
            className="absolute left-0 sm:left-4 lg:-left-4 xl:left-0 top-1/4 z-20 bg-white rounded-2xl p-3 w-44"
            style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span
                className="text-xs font-black text-gray-800 tracking-wider"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                TOP RATED
              </span>
            </div>
            <p
              className="text-gray-500 text-xs leading-snug"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Artisan Floral &amp; Decor services for premium destination
              weddings.
            </p>
          </motion.div>

          {/* PHONE FRAME */}
          <div
            className="relative z-10"
            style={{
              width: "260px",
              height: "520px",
              background: "#111111",
              borderRadius: "40px",
              padding: "12px",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
              style={{ width: "90px", height: "24px" }}
            />

            {/* Screen */}
            <div
              className="w-full h-full rounded-3xl overflow-hidden bg-white"
              style={{ paddingTop: "28px" }}
            >
              {/* Yellow hero banner inside app */}
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: "180px",
                  background:
                    "linear-gradient(135deg, #F5C518 0%, #FFD700 100%)",
                }}
              >
                <span style={{ fontSize: "48px" }}>🎉</span>
              </div>

              {/* Skeleton UI */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex-1 h-16 bg-gray-100 rounded-xl" />
                  <div className="flex-1 h-16 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div
                  className="h-10 rounded-xl mt-2"
                  style={{ background: "#111111" }}
                />
              </div>
            </div>
          </div>

          {/* BOOKING CONFIRMED floating card */}
          <motion.div
            className="absolute bottom-16 right-0 sm:right-4 lg:-right-2 xl:right-0 z-20 rounded-2xl px-4 py-3 flex items-center gap-2.5"
            style={{
              background: "rgba(17,17,17,0.88)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              minWidth: "170px",
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#22C55E" }}
            />
            <div>
              <p
                className="text-white text-xs font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Booking Confirmed
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Live vendor tracking
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
