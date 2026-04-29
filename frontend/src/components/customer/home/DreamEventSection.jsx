import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

          <motion.button
            onClick={() => navigate("/#categories")}
            className="flex items-center gap-2 text-sm font-bold text-gray-800 border border-gray-200 rounded-full px-5 py-2.5 hover:bg-gray-50 transition-all duration-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            View All Categories →
          </motion.button>
        </div>

        {/* ── MOBILE LAYOUT (< 768px): single column stack ── */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* Grand Venues */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => navigate("/category/banquet-hall")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group"
            style={{ minHeight: "280px", background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity duration-500"
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
              <p className="text-gray-300 text-sm mb-4">Stunning spaces for every scale</p>
              <button className="text-white border border-white/40 rounded-full px-5 py-2 text-sm font-semibold hover:bg-white hover:text-black transition-all duration-200">
                Explore →
              </button>
            </div>
          </motion.div>

          {/* Artisan Catering */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => navigate("/category/catering")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-6 flex flex-col justify-between"
            style={{ minHeight: "200px", background: "linear-gradient(135deg, #F5C518 0%, #FFD700 100%)" }}
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
            <div className="absolute top-5 right-5 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">→</span>
            </div>
          </motion.div>

        </div>

        {/* ── DESKTOP LAYOUT (≥ 768px): bento grid ── */}
        <motion.div
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "300px 300px",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* LARGE CARD — Grand Venues */}
          <motion.div
            variants={cardVariants}
            onClick={() => navigate("/category/banquet-hall")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group"
            style={{
              gridColumn: "1",
              gridRow: "1 / span 2",
              background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.25 } }}
          >
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity duration-500"
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
              <button className="text-white border border-white/40 rounded-full px-5 py-2 text-sm font-semibold hover:bg-white hover:text-black transition-all duration-200">
                Explore →
              </button>
            </div>
          </motion.div>

          {/* SMALL CARD 1 — Artisan Catering */}
          <motion.div
            variants={cardVariants}
            onClick={() => navigate("/category/catering")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-6 flex flex-col justify-between"
            style={{
              gridColumn: "2",
              gridRow: "1",
              background: "linear-gradient(135deg, #F5C518 0%, #FFD700 100%)",
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl">🍽️</div>
            <div>
              <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Artisan Catering
              </h3>
              <p className="text-gray-700 text-sm">Flavours that speak love</p>
            </div>
            <div className="absolute top-5 right-5 w-9 h-9 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-all">
              <span className="text-gray-800 font-bold">→</span>
            </div>
          </motion.div>

          {/* SMALL CARD 2 — Full Planning */}
          <motion.div
            variants={cardVariants}
            onClick={() => navigate("/category/photographer")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-6 flex flex-col justify-between"
            style={{
              gridColumn: "3",
              gridRow: "1",
              background: "linear-gradient(135deg, #f7f7f7 0%, #eeeeee 100%)",
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl">📋</div>
            <div>
              <h3 className="text-gray-900 text-xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Full Planning
              </h3>
              <p className="text-gray-500 text-sm">End-to-end event management</p>
            </div>
            <div className="absolute top-5 right-5 w-9 h-9 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black/10 transition-all">
              <span className="text-gray-700 font-bold">→</span>
            </div>
          </motion.div>

          {/* WIDE CARD — Inclusive & Mandap */}
          <motion.div
            variants={cardVariants}
            onClick={() => navigate("/category/tenthouse")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group p-7 flex flex-col justify-between"
            style={{
              gridColumn: "2 / span 2",
              gridRow: "2",
              background: "linear-gradient(135deg, #111111 0%, #222222 100%)",
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl">🕌</div>
            <div>
              <h3 className="text-white text-2xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
            <div className="absolute top-5 right-5 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
              <span className="text-white font-bold">→</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}