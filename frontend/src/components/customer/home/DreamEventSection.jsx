import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./DreamEventSection.css"; 

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function DreamEventSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 xl:px-20">
      <div className="w-full max-w-[1600px] mx-auto">

        {/* Header Row */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              THE DIFFERENCE
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything for your{" "}
              <span className="italic" style={{ color: "#E6A800" }}>
                Dream Event.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* ── MOBILE LAYOUT (< 768px): single column stack ── */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* Grand Venues — Flip Card */}
          <div className="dream-flip-card" style={{ minHeight: "280px" }}>
            <div className="dream-flip-inner">
              {/* Front */}
              <div
                className="dream-flip-front rounded-3xl overflow-hidden"
                style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: "url('/assets/home/bannerImages/mediumbanner.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span
                    className="inline-block text-xs font-black tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{ background: "#F5C518", color: "#111" }}
                  >
                    POPULAR
                  </span>
                  <h3 className="text-white text-2xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Grand Venues
                  </h3>
                  <p className="text-gray-300 text-sm">Stunning spaces for every scale</p>
                </div>
              </div>
              {/* Back */}
              <div
                className="dream-flip-back rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 p-6"
                style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
              >
                <p className="text-white text-center text-base font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Discover stunning banquet halls & outdoor venues for weddings, receptions, and corporate events.
                </p>
                <button
                  onClick={() => navigate("/category/banquet-hall")}
                  className="text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:opacity-80 transition-all duration-200"
                  style={{ background: "#F5C518" }}
                >
                  Explore Venues →
                </button>
              </div>
            </div>
          </div>

          {/* Artisan Catering — Flip Card */}
          <div className="dream-flip-card" style={{ minHeight: "200px" }}>
            <div className="dream-flip-inner">
              {/* Front */}
              <div
                className="dream-flip-front rounded-3xl overflow-hidden p-6 flex flex-col justify-between"
                style={{ background: "linear-gradient(135deg, #F5C518 0%, #FFD700 100%)" }}
              >
                <div className="text-4xl">🍽️</div>
                <div>
                  <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Artisan Catering
                  </h3>
                  <p className="text-gray-700 text-sm">Flavours that speak love</p>
                </div>
                <div className="absolute top-5 right-5 w-9 h-9 bg-black/10 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-bold">→</span>
                </div>
              </div>
              {/* Back */}
              <div
                className="dream-flip-back rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 p-6"
                style={{ background: "linear-gradient(135deg, #111 0%, #222 100%)" }}
              >
                <p className="text-white text-center text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Handcrafted menus tailored to your occasion — from intimate dinners to lavish buffets.
                </p>
                <button
                  onClick={() => navigate("/category/catering")}
                  className="text-gray-900 font-bold text-sm px-6 py-3 rounded-full hover:opacity-80 transition-all"
                  style={{ background: "#F5C518" }}
                >
                  View Caterers →
                </button>
              </div>
            </div>
          </div>

          {/* EMI Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-center"
            style={{ minHeight: "160px", background: "#f7f7f7" }}
          >
            <p className="text-gray-600 text-sm font-semibold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Up to</p>
            <p className="font-black leading-none mb-1" style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", color: "#111" }}>80%</p>
            <p className="text-sm font-bold" style={{ color: "#E6A800", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pay with Emi</p>
          </motion.div>

          {/* Join As a Vendor */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between"
            style={{ minHeight: "180px", background: "#F5C518" }}
          >
            <div>
              <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Join As a Vendor
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Scale your Business with Elite EventsBridge Network with <strong>Zero Cost</strong>
              </p>
            </div>
            <button
              onClick={() => navigate("/vendor/register")}
              className="self-start text-white font-bold text-sm px-6 py-3 rounded-full hover:opacity-80 transition-all duration-200"
              style={{ background: "#111" }}
            >
              Join Now
            </button>
          </motion.div>

          {/* Full Planning */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => navigate("/category/photographer")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-6 flex flex-col justify-between"
            style={{ minHeight: "200px", background: "linear-gradient(135deg, #f7f7f7 0%, #eeeeee 100%)" }}
          >
            <div className="text-4xl">📋</div>
            <div>
              <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Full Planning
              </h3>
              <p className="text-gray-500 text-sm">End-to-end event management</p>
            </div>
            <div className="absolute top-5 right-5 w-9 h-9 bg-black/5 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-bold">→</span>
            </div>
          </motion.div>

          {/* Inclusive & Mandap */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => navigate("/category/tenthouse")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-6 flex flex-col justify-between"
            style={{ minHeight: "200px", background: "linear-gradient(135deg, #111111 0%, #222222 100%)" }}
          >
            <div className="text-4xl">🕌</div>
            <div>
              <h3 className="text-white text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Inclusive & Mandap
              </h3>
              <p className="text-gray-400 text-sm">Sacred setups, every tradition</p>
              <button
                className="mt-4 text-gray-900 font-bold text-xs px-5 py-2.5 rounded-full hover:opacity-80 transition-all duration-200"
                style={{ background: "#F5C518" }}
              >
                Book Now
              </button>
            </div>
          </motion.div>

        </div>

        {/* ── DESKTOP LAYOUT (≥ 768px): bento grid matching design ── */}
        <motion.div
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gridTemplateRows: "300px 300px",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >

          {/* LARGE FLIP CARD — Grand Venues (spans 2 rows) */}
          <motion.div
            variants={cardVariants}
            style={{ gridColumn: "1", gridRow: "1 / span 2" }}
          >
            <div className="dream-flip-card" style={{ height: "100%" }}>
              <div className="dream-flip-inner" style={{ borderRadius: "1.5rem" }}>
                {/* Front */}
                <div
                  className="dream-flip-front rounded-3xl overflow-hidden"
                  style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: "url('/assets/home/bannerImages/mediumbanner.webp')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <span
                      className="inline-block text-xs font-black tracking-widest px-3 py-1 rounded-full mb-3"
                      style={{ background: "#F5C518", color: "#111" }}
                    >
                      POPULAR
                    </span>
                    <h3 className="text-white text-3xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Grand Venues
                    </h3>
                    <p className="text-gray-300 text-sm mb-5">Stunning spaces for every scale</p>
                    <p className="text-gray-400 text-xs">Hover to explore →</p>
                  </div>
                </div>
                {/* Back */}
                <div
                  className="dream-flip-back rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-5 p-8"
                  style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-2"
                    style={{ background: "#F5C518" }}
                  >
                    🏛️
                  </div>
                  <h3 className="text-white text-2xl font-black text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Grand Venues
                  </h3>
                  <p className="text-gray-300 text-center text-sm leading-relaxed">
                    Discover stunning banquet halls & outdoor venues for weddings, receptions, and corporate events — tailored to every scale.
                  </p>
                  <button
                    onClick={() => navigate("/category/banquet-hall")}
                    className="text-gray-900 font-bold text-sm px-7 py-3 rounded-full hover:opacity-80 transition-all duration-200 mt-2"
                    style={{ background: "#F5C518" }}
                  >
                    Explore Venues →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TOP-RIGHT ROW: Artisan Catering Flip + EMI Card */}

          {/* Artisan Catering — Flip Card */}
          <motion.div
            variants={cardVariants}
            style={{ gridColumn: "2", gridRow: "1" }}
          >
            <div className="dream-flip-card" style={{ height: "100%" }}>
              <div className="dream-flip-inner" style={{ borderRadius: "1.5rem" }}>
                {/* Front */}
                <div
                  className="dream-flip-front rounded-3xl overflow-hidden p-6 flex flex-col justify-between"
                  style={{ background: "linear-gradient(135deg, #F5C518 0%, #FFD700 100%)" }}
                >
                  <div className="text-4xl">🍽️</div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Artisan Catering
                    </h3>
                    <p className="text-gray-700 text-sm">Flavours that speak love</p>
                  </div>
                  <div className="absolute top-5 right-5 w-9 h-9 bg-black/10 rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold">→</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-2">Hover to explore →</p>
                </div>
                {/* Back */}
                <div
                  className="dream-flip-back rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 p-6"
                  style={{ background: "linear-gradient(135deg, #111 0%, #222 100%)" }}
                >
                  <div className="text-4xl">🍽️</div>
                  <p className="text-white text-center text-sm font-semibold leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Handcrafted menus tailored to your occasion — from intimate dinners to lavish buffets.
                  </p>
                  <button
                    onClick={() => navigate("/category/catering")}
                    className="text-gray-900 font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-80 transition-all"
                    style={{ background: "#F5C518" }}
                  >
                    View Caterers →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* EMI Card */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-center"
            style={{
              gridColumn: "3",
              gridRow: "1",
              background: "#f7f7f7",
            }}
          >
            <p
              className="text-gray-500 text-sm font-semibold mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Up to
            </p>
            <p
              className="font-black leading-none mb-2"
              style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              80%
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: "#E6A800", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Pay with Emi
            </p>
            {/* Decorative circle */}
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
              style={{ background: "#E6A800" }}
            />
          </motion.div>

          {/* BOTTOM-RIGHT WIDE: Join As a Vendor (spans 2 cols) */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-between"
            style={{
              gridColumn: "2 / span 2",
              gridRow: "2",
              background: "#F5C518",
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
              style={{ background: "#111" }}
            />
            <div
              className="absolute bottom-4 right-20 w-24 h-24 rounded-full opacity-10"
              style={{ background: "#111" }}
            />

            <div className="relative z-10">
              <h3
                className="text-gray-900 text-2xl font-black mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Join As a Vendor
              </h3>
              <p className="text-gray-700 text-sm max-w-xs">
                Scale your Business with Elite EventsBridge Network with{" "}
                <strong>Zero Cost</strong>
              </p>
            </div>
            <button
              onClick={() => navigate("/vendor/register")}
              className="relative z-10 self-start text-white font-bold text-sm px-7 py-3 rounded-full hover:opacity-80 transition-all duration-200 mt-4"
              style={{ background: "#111" }}
            >
              Join Now
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}