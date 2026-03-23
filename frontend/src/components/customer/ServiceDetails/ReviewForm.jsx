import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import "./ReviewForm.css";
import { BACKEND_URL } from "../../../utils/constant";

const ReviewForm = ({ serviceId, userName, userId, onNewReview, closePopup, allReviews }) => {
  const [formData, setFormData] = useState({ rating: 0, reviewMessage: "" });

  
  // ✅ Close popup if user already submitted a review
  useEffect(() => {
    const existingReview = allReviews?.find(
      (rev) => String(rev.userId) === String(userId)
    );
    if (existingReview) {
      toast.error("You have already submitted a review for this service.", { duration: 1500 });
      closePopup?.(); // automatically close the form
    }
  }, [allReviews, userId, closePopup]);

  const handleRating = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, reviewMessage: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double check: prevent submission if review already exists
    const existingReview = allReviews?.find(
      (rev) => String(rev.userId) === String(userId)
    );
    if (existingReview) {
      toast.error("You have already submitted a review for this service.", { duration: 1500 });
      closePopup?.();
      return;
    }

    // Require at least rating or review message
    if (!formData.rating && !formData.reviewMessage.trim()) {
      toast.error("Please provide a rating or a review message.", { duration: 1500 });
      return;
    }

    try {
      const payload = {
        serviceId,
        userId,
        rating: formData.rating || null,
        reviewMessage: formData.reviewMessage || "",
      };

      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${BACKEND_URL}/reviews/add`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        const fullName =
          localStorage.getItem("userFirstName") +
          " " +
          localStorage.getItem("userLastName");

        onNewReview?.({ ...data.review, userName: fullName });
        toast.success("Review submitted successfully!", { duration: 1500 });
        setFormData({ rating: 0, reviewMessage: "" });
        closePopup?.(); // close popup after successful submission
      } else {
        toast.error(data.message || "Failed to add review.", { duration: 1500 });
      }
    } catch (err) {
      console.error("Review submit failed:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Something went wrong while submitting your review.",
        { duration: 1500 }
      );
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
      />

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
