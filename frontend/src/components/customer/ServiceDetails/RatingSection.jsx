import React from "react";
import { IoIosStar } from "react-icons/io";
import "./RatingSection.css";

const RatingSection = ({ ratingValue, totalRatings, totalReviews }) => {
  return (
    <div className="rating-section">
      <div className="rating-box">
        <span className="rating-value">{ratingValue}</span>
        <IoIosStar className="star-icon" />
      </div>
      <span className="rating-text">
        {totalRatings} ratings, {totalReviews} reviews
      </span>
    </div>
  );
};

export default RatingSection;
