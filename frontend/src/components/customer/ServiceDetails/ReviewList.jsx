import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import similarimg2 from "../../../assets/service/similar-dj-img2.jfif";
import similarimg3 from "../../../assets/service/similar-dj-img3.jpg";
import similarimg4 from "../../../assets/service/similar-dj-img4.jpg";
import similarimg5 from "../../../assets/service/similar-dj-img5.jpg";

const dummyImages = [similarimg2, similarimg3, similarimg4, similarimg5];

const ReviewList = ({ newReview }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [showAll, setShowAll] = useState(false); // 🔁 for toggle
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/reviews/all`);
        const backendData = res.data.data;

        const filtered = backendData
          .filter((rev) => rev.rating >= 4)
          .map((rev, idx) => ({
            ...rev,
            label: rev.text,
            date: new Date().toISOString().split("T")[0],
            images: [dummyImages[idx % dummyImages.length]],
            helpful: Math.floor(Math.random() * 10),
          }));

        setAllReviews(filtered);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (newReview && newReview.rating >= 4) {
      const updated = {
        ...newReview,
        label: newReview.text,
        date: new Date().toISOString().split("T")[0],
        images: [
          dummyImages[Math.floor(Math.random() * dummyImages.length)],
        ],
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
