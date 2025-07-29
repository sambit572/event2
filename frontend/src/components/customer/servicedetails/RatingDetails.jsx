import React from "react";
import RatingBar from "./RatingBar"; // assuming RatingBar is in the same folder

const RatingDetails = () => {
  const ratingsData = {
    averageRating: 4.3,
    totalRatings: 150,
    totalReviews: 87,
    breakdown: [
      { label: "5★", count: 80, color: "#4caf50" },
      { label: "4★", count: 40, color: "#8bc34a" },
      { label: "3★", count: 15, color: "#cddc39" },
      { label: "2★", count: 10, color: "#ffc107" },
      { label: "1★", count: 5, color: "#f44336" },
    ],
  };

  const maxCount = Math.max(...ratingsData.breakdown.map((r) => r.count));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
      {/* Average Rating Section */}
      <div style={{ minWidth: "120px" }}>
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: "#007e33",
          }}
        >
          {ratingsData.averageRating.toFixed(1)}
          <span
            style={{
              fontSize: "24px",
              color: "green",
              marginLeft: "6px",
            }}
          >
            ★
          </span>
        </div>
        <p style={{ color: "gray", fontSize: "14px", marginTop: "10px" }}>
          {ratingsData.totalRatings} Ratings, {ratingsData.totalReviews} Reviews
        </p>
      </div>

      {/* Breakdown Bars */}
      <div style={{ flexGrow: 1, minWidth: "300px", maxWidth: "450px" }}>
        {ratingsData.breakdown.map((item, index) => (
          <RatingBar
            key={index}
            label={item.label}
            count={item.count}
            max={maxCount}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default RatingDetails;
