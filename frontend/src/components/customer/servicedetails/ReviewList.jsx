import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ serviceId, newReview }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/reviews/getReview/${serviceId}`
        );
        const backendData = res.data.reviews;
        // ✅ map with pipeline response (userDetails contains fullName & _id)
        const formatted = backendData.map((rev, idx) => ({
          ...rev,
          userName: rev.userDetails?.fullName || "Anonymous",
          date: new Date(rev.createdAt).toISOString().split("T")[0],
          reviewMessage: rev.reviewMessage || "No review message provided",
          // images: [dummyImages[idx % dummyImages.length]],
          helpful: Math.floor(Math.random() * 10),
        }));

        setAllReviews(formatted);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, [serviceId]);

  // ✅ handle new review append
  useEffect(() => {
    if (newReview) {
      console.log("New review received:", newReview);
      const updated = {
        ...newReview,
    
        date: new Date().toISOString().split("T")[0],
        // images: [dummyImages[Math.floor(Math.random() * dummyImages.length)]],
        helpful: 0,
      };
      setAllReviews((prev) => [...prev, updated]);
    }
  }, [newReview]);

  const visibleReviews = showAll ? allReviews : allReviews.slice(0, 5);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", color: "#001f3f" }}>
      {visibleReviews.map((rev, i) => (
        <ReviewCard key={i} review={rev} />
      ))}

      {allReviews.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#f3c12d",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less ↑" : "Show All ↓"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
