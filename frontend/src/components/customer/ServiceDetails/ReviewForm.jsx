import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./ReviewForm.css";
import { BACKEND_URL } from "../../../utils/constant";

const ReviewForm = ({  serviceId, userName, userId, onNewReview,closePopup  }) => {
  const [formData, setFormData] = useState({ rating: 0, reviewMessage: "" });


  const handleRating = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, reviewMessage: e.target.value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      serviceId,          // ✅ use props
      userId,
      rating: formData.rating,
      reviewMessage: formData.reviewMessage,
    };
    console.log("Submitting review:", payload);

    const token= localStorage.getItem("token");
    const { data } = await axios.post(
      `${BACKEND_URL}/reviews/add`,
      payload,{
        withCredentials: true, // ✅ include credentials for auth
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.success) {
      console.log("New review added:", data.review);
      const userName = localStorage.getItem("userFirstName")+ " " + localStorage.getItem("userLastName");

      onNewReview?.({ ...data.review, userName });
      setFormData({ rating: 0, reviewMessage: "" });
        closePopup?.();
    }
    console.log("review user", data);

  } catch (err) {
    console.error("Review submit failed:", err.response?.data || err.message);
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
              size={32}
              color="rgb(0, 128, 0)"
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FaRegStar
              key={star}
              size={32}
              color="#ccc"
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer" }}
            />
          )
        )}
      </div>

      {/* 📝 Review Description */}
      <textarea
        name="reviewMessage"
        maxLength={500}
        placeholder="Write your honest review... (max 500 chars)"
        value={formData.reviewMessage}
        onChange={handleChange}
        // required
      />

      <button type="submit" >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
