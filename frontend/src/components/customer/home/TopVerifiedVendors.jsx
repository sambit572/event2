import { useState, useRef, useEffect, useCallback } from "react";
import "./TopVerifiedVendors.css";

const STATIC_VENDORS = [
  {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=400&h=600&fit=crop",
    ],
    serviceName: "Royal Wedding Decor",
    category: "Decoration",
    rating: 4.9,
    rank: 1,
  },
  {
    id: 2,
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop",
    ],
    serviceName: "Spice Garden Catering",
    category: "Catering",
    rating: 4.8,
    rank: 2,
  },
  {
    id: 3,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=600&fit=crop",
    ],
    serviceName: "Lens & Light Studio",
    category: "Photography",
    rating: 4.8,
    rank: 3,
  },
  {
    id: 4,
    images: [
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=600&fit=crop",
    ],
    serviceName: "BeatMaster DJ",
    category: "DJ & Music",
    rating: 4.7,
    rank: 4,
  },
  {
    id: 5,
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487530811015-780f4f8b41b1?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=600&fit=crop",
    ],
    serviceName: "Petal Bliss Flowers",
    category: "Florist",
    rating: 4.7,
    rank: 5,
  },
  {
    id: 6,
    images: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop",
    ],
    serviceName: "Grand Tent House",
    category: "Tent House",
    rating: 4.6,
    rank: 6,
  },
  {
    id: 7,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=600&fit=crop",
    ],
    serviceName: "Glamour Beauty Studio",
    category: "Makeup & Beauty",
    rating: 4.6,
    rank: 7,
  },
  {
    id: 8,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537365587684-f490102e1225?w=400&h=600&fit=crop",
    ],
    serviceName: "Elite Banquet Hall",
    category: "Banquet Hall",
    rating: 4.5,
    rank: 8,
  },
];

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="tvv-stars">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="tvv-star filled">★</span>
      ))}
      {half && <span className="tvv-star half">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="tvv-star empty">☆</span>
      ))}
      <span className="tvv-rating-num">{rating.toFixed(1)}</span>
    </span>
  );
};

const VendorCard = ({ vendor }) => {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const total = vendor.images.length;

  const prev = (e) => { e.stopPropagation(); setCurrent((i) => (i === 0 ? total - 1 : i - 1)); };
  const next = (e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % total); };

  return (
    <div
      className="tvv-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tvv-img-wrap">
        <div className="tvv-img-strip" style={{ transform: `translateX(-${current * 100}%)` }}>
          {vendor.images.map((src, i) => (
            <img key={i} src={src} alt={`${vendor.serviceName} ${i + 1}`} className="tvv-slide-img" loading="lazy" decoding="async" />
          ))}
        </div>
        <span className="tvv-brand-label">EVENTSBRIDGE</span>
        {vendor.rank <= 3 && (
          <div className="tvv-rank-badge">
            {vendor.rank === 1 ? "🥇" : vendor.rank === 2 ? "🥈" : "🥉"}
          </div>
        )}
        <div className="tvv-verified-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
          </svg>
          Verified
        </div>
        {hovered && total > 1 && <button className="tvv-arrow tvv-arrow-left" onClick={prev}>‹</button>}
        {hovered && total > 1 && <button className="tvv-arrow tvv-arrow-right" onClick={next}>›</button>}
        {total > 1 && (
          <div className="tvv-dots">
            {vendor.images.map((_, i) => (
              <button key={i} className={`tvv-dot ${i === current ? "tvv-dot-active" : ""}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }} />
            ))}
          </div>
        )}
      </div>
      <div className="tvv-card-info">
        <p className="tvv-service-name">{vendor.serviceName}</p>
        <p className="tvv-category">{vendor.category}</p>
        <StarRating rating={vendor.rating} />
      </div>
    </div>
  );
};

// Triple the vendors so we have enough buffer for seamless infinite loop
const LOOPED_VENDORS = [...STATIC_VENDORS, ...STATIC_VENDORS, ...STATIC_VENDORS];
const N = STATIC_VENDORS.length; // 8

export default function TopVerifiedVendors() {
  const trackRef = useRef(null);
  const isPausedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  // Start at index N so we have cards on both sides
  const indexRef = useRef(N);

  // Apply transform instantly (no animation)
  const jumpTo = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".tvv-card");
    if (!card) return;
    const gap = 18;
    const cardW = card.offsetWidth + gap;
    track.style.transition = "none";
    track.style.transform = `translateX(-${index * cardW}px)`;
    indexRef.current = index;
  }, []);

  // Animate to index
  const animateTo = useCallback((index, onDone) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".tvv-card");
    if (!card) return;
    const gap = 18;
    const cardW = card.offsetWidth + gap;
    track.style.transition = "transform 0.55s cubic-bezier(0.4,0,0.2,1)";
    track.style.transform = `translateX(-${index * cardW}px)`;
    indexRef.current = index;
    setTimeout(() => { onDone && onDone(); }, 560);
  }, []);

  // Set initial position (start at second set so going back also works)
  useEffect(() => {
    // Wait for layout
    const t = setTimeout(() => jumpTo(N), 50);
    return () => clearTimeout(t);
  }, [jumpTo]);

  const goNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const next = indexRef.current + 1;
    animateTo(next, () => {
      // If we've gone past the second set into the third, silently jump back to second set
      if (indexRef.current >= N * 2) {
        jumpTo(N);
      }
      isAnimatingRef.current = false;
    });
  }, [animateTo, jumpTo]);

  const goPrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const prev = indexRef.current - 1;
    animateTo(prev, () => {
      // If we've gone before the second set into the first, silently jump forward to second set
      if (indexRef.current < N) {
        jumpTo(N * 2 - (N - indexRef.current));
      }
      isAnimatingRef.current = false;
    });
  }, [animateTo, jumpTo]);

  // Auto-scroll: every 2.5s advance by 1 card
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) goNext();
    }, 2500);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="tvv-section">
      <div className="tvv-header">
        <p className="tvv-eyebrow">HANDPICKED FOR YOU</p>
        <h2 className="tvv-title">
          Top Verified <span className="tvv-title-accent">Vendors</span>
        </h2>
        <p className="tvv-subtitle">Premium partners ranked by performance & trust</p>
      </div>

      <div
        className="tvv-carousel-wrapper"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <button className="tvv-carousel-arrow tvv-carousel-arrow-left" onClick={goPrev} aria-label="Previous">‹</button>

        {/* overflow:hidden on the wrapper, not the track */}
        <div className="tvv-track-outer">
          <div className="tvv-track" ref={trackRef}>
            {LOOPED_VENDORS.map((vendor, idx) => (
              <VendorCard key={`${vendor.id}-${idx}`} vendor={vendor} />
            ))}
          </div>
        </div>

        <button className="tvv-carousel-arrow tvv-carousel-arrow-right" onClick={goNext} aria-label="Next">›</button>
      </div>
    </section>
  );
}
