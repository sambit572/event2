import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./ReviewForm.css";

const ReviewForm = ({ onNewReview }) => {
  const [formData, setFormData] = useState({ rating: 0, text: "" });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleRating = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

       const payload = {
      ...formData,
      name: "Anonymous User", // 👈 Add dummy name here
    };

      await axios.post(`${BACKEND_URL}/api/reviews/add`, payload);
      onNewReview?.(payload);
      setFormData({ rating: 0, text: "" });
    } catch (err) {
      console.error("Review submit failed:", err.message);
    }
  };

  return (
    <form className="review_form" onSubmit={handleSubmit}>
      {/* ⭐ Star Rating UI */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) =>
          formData.rating >= star ? (
            <FaStar
              key={star}
              size={48}
              color= "rgb(0, 128, 0)" 
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FaRegStar
              key={star}
              size={48}
              color="#ccc"
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer" }}
            />
          )
        )}
      </div>

      {/* 📝 Review Description */}
      <textarea
        name="text"
        maxLength={500}
        placeholder="Write your honest review... (max 500 chars)"
        value={formData.text}
        onChange={handleChange}
        required
      />

      {/* 🚀 Submit Button */}
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
