import { useState, useRef, useEffect } from "react";
import "./ReviewSlider.css";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReviewSlider = () => {
  const [offset, setOffset] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Auto-scroll effect - only start when we have reviews
  useEffect(() => {
    if (reviews.length === 0) return;

    const scrollSpeed = 0.5;
    const interval = setInterval(() => {
      setOffset((prev) => {
        if (!containerRef.current) return prev;
        const container = containerRef.current;
        const scrollWidth = container.scrollWidth / 2;
        const newOffset = prev + scrollSpeed;
        return newOffset >= scrollWidth ? 0 : newOffset;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [reviews]);

  // Fetch user-submitted reviews from backend
  // Define fetchReviews function
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/reviews/all?page=1&limit=50`);
      const fetched = res.data.reviews || [];

      const formatted = fetched
        .filter((r) => r.rating >= 3) // Show 3+ star reviews
        .map((r) => {
          const name = r.userName || r.userEmail?.split("@")[0] || "Anonymous";
          const initials =
            r.initials ||
            name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
          return {
            userName: name,
            rating: r.rating,
            reviewMessage: r.reviewMessage,
            profileImage: r.profileImage || null,
            initials,
            reviewType: r.reviewType,
          };
        });

      setReviews(formatted);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch reviews: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver to fetch only when slider is visible
  useEffect(() => {
    const slider = document.getElementById("review-slider");
    if (!slider) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchReviews(); // fetch reviews when slider scrolls into view
          observer.disconnect(); // stop observing after first fetch
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(slider);
    return () => observer.disconnect();
  }, []);

  const duplicatedReviews = reviews.length > 0 ? [...reviews] : [];
  if (!loading && (!reviews || reviews.length === 0)) {
    return null;
  }
  return (
    <div className="review_section">
      {/* <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="heading_review"
      >
        𝐎𝐔𝐑 𝐑𝐄𝐕𝐈𝐄𝐖𝐒
      </motion.h1> */}
      <h1 className="heading_review">𝐎𝐔𝐑 𝐑𝐄𝐕𝐈𝐄𝐖𝐒</h1>
      <h3 className="subheadings">Celebrated by Many, Loved by All.</h3>

      {/* Debug info */}
      {/*  <div className="text-center mb-4 p-4 bg-gray-100 rounded">
        <strong>Debug Info:</strong><br/>
        Total Reviews: {reviews.length}<br/>
        Loading: {loading ? "Yes" : "No"}<br/>
        {error && <span className="text-red-500">Error: {error}</span>}
      </div> */}

      {/* Review Slider */}
      <div id="review-slider" className="review_wrapper" ref={containerRef}>
        {loading ? (
          <div className="text-center py-8">
            <p className="decoration-sky-950">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : duplicatedReviews.length > 0 ? (
          <div
            className="review_container"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.userName}-${review.reviewMessage?.slice(
                  0,
                  10
                )}-${index}`}
                className="review_card"
              >
                {review.profileImage ? (
                  <img
                    decoding="async"
                    loading="lazy"
                    src={review.profileImage}
                    alt={review.userName}
                    className="review_avatar"
                  />
                ) : (
                  <div className="initials_avatar">{review.initials}</div>
                )}
                <h3>{review.userName}</h3>
                <div className="review_rating">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <span key={`filled-${i}-${index}`} className="star filled">
                      ★
                    </span>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, i) => (
                    <span key={`empty-${i}-${index}`} className="star empty">
                      ☆
                    </span>
                  ))}
                </div>
                <p>{review.reviewMessage}</p>
                <small className="text-gray-500">
                  Type: {review.reviewType}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No reviews available yet. Be the first to leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSlider;
