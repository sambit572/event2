import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./DreamEventSection.css";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ── 12 flip images from /public/ ──
const venuePhotos = [
  { src: "/flipimg1.webp",  label: "Grand Venue" },
  { src: "/flipimg2.webp",  label: "Grand Venue" },
  { src: "/flipimg3.webp",  label: "Grand Venue" },
  { src: "/flipimg4.webp",  label: "Grand Venue" },
  { src: "/flipimg5.webp",  label: "Grand Venue" },
  { src: "/flipimg6.webp",  label: "Grand Venue" },
  { src: "/flipimg7.webp",  label: "Grand Venue" },
  { src: "/flipimg8.webp",  label: "Grand Venue" },
  { src: "/flipimg9.webp",  label: "Grand Venue" },
  { src: "/flipimg10.webp", label: "Grand Venue" },
  { src: "/flipimg11.webp", label: "Grand Venue" },
  { src: "/flipimg12.webp", label: "Grand Venue" },
];

// ── Event Types for Artisan Catering Card ──
const eventTypes = [
  { emoji: "💍", label: "Weddings & Receptions" },
  { emoji: "🎂", label: "Birthday Celebrations" },
  { emoji: "🏢", label: "Corporate Events" },
  { emoji: "💑", label: "Engagement Ceremonies" },
  { emoji: "❤️", label: "Anniversary Parties" },
  { emoji: "👶", label: "Baby Shower Events" },
  { emoji: "🎵", label: "Concerts & Live Shows" },
  // { emoji: "🎓", label: "College & Farewell Events" },
  // { emoji: "🪔", label: "Religious & Cultural Functions" },
  // { emoji: "🎉", label: "Private Parties & Gatherings" },
];

// ── Artisan Catering Card with animated event scroller ──
function ArtisanCateringCard({ className, style, isMobile }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prev) => (prev + 1) % eventTypes.length);
      }
    }, 1400);
    return () => clearInterval(intervalRef.current);
  }, [isHovered]);

  return (
    <div
      className={`artisan-catering-card ${className || ""}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate("/category/catering")}
    >
      {/* Animated background glow blobs */}
      <div className="catering-blob catering-blob-1" />
      <div className="catering-blob catering-blob-2" />
      <div className="catering-blob catering-blob-3" />

      {/* Header */}
      <div className="catering-header">
        <div className="catering-icon-wrap">
          <span className="catering-icon-emoji">🍽️</span>
        </div>
        <div className="catering-arrow">→</div>
      </div>

      {/* Title */}
      <div className="catering-title-block">
        <h3 className="catering-title">Artisan Catering</h3>
        <p className="catering-subtitle">Flavours that speak love</p>
      </div>

      {/* Event Types Scroll List */}
      <div className="catering-events-list">
        {eventTypes.map((evt, i) => (
          <div
            key={i}
            className={`catering-event-item ${i === activeIndex ? "active" : ""} ${
              i === (activeIndex - 1 + eventTypes.length) % eventTypes.length ? "prev" : ""
            }`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <span className="catering-event-emoji">{evt.emoji}</span>
            <span className="catering-event-label">{evt.label}</span>
            <span className="catering-event-dot" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="catering-cta"
        onClick={(e) => { e.stopPropagation(); navigate("/category/catering"); }}
      >
        View Caterers →
      </button>
    </div>
  );
}

// ── Grand Venues Flip Card (cycling photos on each hover) ──
function GrandVenuesCard({ className, style, minHeight }) {
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isHovering = useRef(false);

  // Desktop: each new hover-in advances to next photo
  const handleMouseEnter = () => {
    if (!isHovering.current) {
      isHovering.current = true;
      setPhotoIndex((prev) => (prev + 1) % venuePhotos.length);
    }
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  // Mobile: tap toggles flip and cycles to next photo
  const handleTap = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % venuePhotos.length);
    setIsFlipped((prev) => !prev);
  };

  const current = venuePhotos[photoIndex];
  const next = venuePhotos[(photoIndex + 1) % venuePhotos.length];

  return (
    <div
      className={`dream-flip-card ${isFlipped ? "flipped" : ""} ${className || ""}`}
      style={{ ...style, minHeight }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
    >
      <div className="dream-flip-inner" style={{ borderRadius: "1.5rem" }}>

        {/* ── FRONT ── */}
        <div
          className="dream-flip-front rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)" }}
        >
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              backgroundImage: `url('${current.src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.45,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* photo counter badge */}
          <div
            className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          >
            {photoIndex + 1} / {venuePhotos.length}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
            <span
              className="inline-block text-xs font-black tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#F5C518", color: "#111" }}
            >
              POPULAR
            </span>
            <h3
              className="text-white text-3xl font-black mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Grand Venues
            </h3>
            <p className="text-gray-300 text-sm mb-5">Stunning spaces for every scale</p>
            {/* <p className="text-gray-400 text-xs">Hover to explore →</p> */}
          </div>
        </div>

        {/* ── BACK (full photo) ── */}
        <div className="dream-flip-back rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              backgroundImage: `url('${current.src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="dream-back-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          {/* photo counter */}
          <div
            className="dream-back-overlay absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          >
            {photoIndex + 1} / {venuePhotos.length}
          </div>

          {/* bottom content */}
          <div className="dream-back-overlay absolute bottom-0 left-0 right-0 p-7 z-10 flex flex-col gap-3">
            <div>
              <p
                className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {current.label}
              </p>
              <h3
                className="text-white text-2xl font-black"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Grand Venues
              </h3>
              <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                Discover stunning banquet halls &amp; outdoor venues for weddings,
                receptions, and corporate events — tailored to every scale.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/category/banquet-hall"); }}
                className="text-gray-900 font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-80 transition-all duration-200"
                style={{ background: "#F5C518" }}
              >
                Explore Venues →
              </button>
              {/* dot indicator strip */}
              <div className="flex gap-1.5 ml-auto">
                {venuePhotos.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === photoIndex ? "20px" : "6px",
                      height: "6px",
                      background: i === photoIndex ? "#F5C518" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Preload next image silently */}
      <img src={next.src} alt="" style={{ display: "none" }} aria-hidden="true" />
    </div>
  );
}

// ── Main Section ──
export default function DreamEventSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="w-full max-w-[1680px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
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
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything for your{" "}
              <span className="italic" style={{ color: "#E6A800" }}>
                Dream Event.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* ── MOBILE LAYOUT (< 768px) ── */}
        <div className="dream-mobile-layout md:hidden">

          {/* Grand Venues cycling flip */}
          <GrandVenuesCard className="dream-mobile-grand" minHeight="240px" />

          {/* Artisan Catering */}
          <ArtisanCateringCard className="dream-mobile-catering" style={{ minHeight: "220px" }} isMobile={true} />

          {/* EMI Card */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="dream-mobile-emi relative overflow-hidden rounded-2xl p-5 flex flex-col justify-center"
            style={{ minHeight: "130px", background: "#f7f7f7" }}
          >
            <p className="font-semibold mb-1" style={{ fontSize: "14px", color: "#555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Up to</p>
            <p className="font-black leading-none mb-1" style={{ fontSize: "clamp(3rem, 14vw, 4.5rem)", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>80%</p>
            <p className="font-bold" style={{ fontSize: "15px", color: "#E6A800", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pay with Emi</p>
          </motion.div>

          {/* Join As a Vendor */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="dream-mobile-vendor relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between"
            style={{ minHeight: "130px", background: "#F5C518" }}
          >
            <div>
              <h3 className="text-gray-900 text-base font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join As a Vendor</h3>
              <p className="text-gray-700 text-xs mb-3">Scale your Business with <strong>Zero Cost</strong></p>
            </div>
            <button
              className="self-start text-white font-bold text-xs px-4 py-2 rounded-full hover:opacity-80 transition-all duration-200"
              style={{ background: "#111" }}
            >
              Join Now
            </button>
          </motion.div>

          {/* Full Planning */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            onClick={() => navigate("/category/photographer")}
            className="dream-mobile-planning relative overflow-hidden rounded-2xl cursor-pointer p-5 flex flex-col justify-between"
            style={{ minHeight: "130px", background: "linear-gradient(135deg, #f7f7f7 0%, #eeeeee 100%)" }}
          >
            <div className="text-3xl">📋</div>
            <div>
              <h3 className="text-gray-900 text-base font-black mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Full Planning</h3>
              <p className="text-gray-500 text-xs">End-to-end event management</p>
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-bold text-sm">→</span>
            </div>
          </motion.div>

          {/* Inclusive & Mandap */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            onClick={() => navigate("/category/tenthouse")}
            className="dream-mobile-mandap relative overflow-hidden rounded-2xl cursor-pointer p-5 flex flex-col justify-between"
            style={{ minHeight: "130px", background: "linear-gradient(135deg, #111111 0%, #222222 100%)" }}
          >
            <div className="text-3xl">🕌</div>
            <div>
              <h3 className="text-white text-base font-black mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inclusive &amp; Mandap</h3>
              <p className="text-gray-400 text-xs">Sacred setups, every tradition</p>
              <button className="mt-3 text-gray-900 font-bold text-xs px-4 py-2 rounded-full hover:opacity-80 transition-all duration-200" style={{ background: "#F5C518" }}>
                Book Now
              </button>
            </div>
          </motion.div>

        </div>

        {/* ── DESKTOP LAYOUT (≥ 768px): bento grid ── */}
        <motion.div
          className="hidden md:grid gap-4"
          style={{ gridTemplateColumns: "55% 1fr 1fr", gridTemplateRows: "300px 300px" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >

          {/* Grand Venues — cycling flip (spans 2 rows) */}
          <motion.div variants={cardVariants} style={{ gridColumn: "1", gridRow: "1 / span 2" }}>
            <GrandVenuesCard style={{ height: "100%" }} />
          </motion.div>

          {/* Artisan Catering */}
          <motion.div variants={cardVariants} style={{ gridColumn: "2", gridRow: "1" }}>
            <ArtisanCateringCard style={{ height: "100%" }} />
          </motion.div>

          {/* EMI Card */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-center"
            style={{ gridColumn: "3", gridRow: "1", background: "#f7f7f7" }}
          >
            <p className="font-semibold mb-1" style={{ fontSize: "16px", color: "#555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Up to</p>
            <p className="font-black leading-none mb-2" style={{ fontSize: "clamp(4rem, 7vw, 6rem)", color: "#111", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>80%</p>
            <p className="font-bold" style={{ fontSize: "20px", color: "#E6A800", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pay with Emi</p>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: "#E6A800" }} />
          </motion.div>

          {/* Join As a Vendor (spans 2 cols) */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-between"
            style={{ gridColumn: "2 / span 2", gridRow: "2", background: "#F5C518" }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: "#111" }} />
            <div className="absolute bottom-4 right-20 w-24 h-24 rounded-full opacity-10" style={{ background: "#111" }} />
            <div className="relative z-10">
              <h3 className="text-gray-900 text-2xl font-black mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join As a Vendor</h3>
              <p className="text-gray-700 text-sm max-w-xs">
                Scale your Business with Elite EventsBridge Network with <strong>Zero Cost</strong>
              </p>
            </div>
            <button
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
