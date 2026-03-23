import React, { useEffect, useState } from "react";
import RatingBar from "./RatingBar";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant"; // your base URL

const RatingDetails = ({ serviceId }) => {
  const [ratingsData, setRatingsData] = useState(null);

  
  useEffect(() => {
    const fetchRatingSummary = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/reviews/rating/${serviceId}`);
        if (res.data.success) {
          const data = res.data.data;

          // convert breakdown to array format for RatingBar
          const breakdownArray = [
            { label: "5★", count: data.breakdown[5], color: "#4caf50" },
            { label: "4★", count: data.breakdown[4], color: "#8bc34a" },
            { label: "3★", count: data.breakdown[3], color: "#cddc39" },
            { label: "2★", count: data.breakdown[2], color: "#ffc107" },
            { label: "1★", count: data.breakdown[1], color: "#f44336" },
          ];

          setRatingsData({
            averageRating: data.averageRating,
            totalRatings: data.totalRatings,
            totalReviews: data.totalReviews,
            breakdown: breakdownArray,
          });
        }
      } catch (err) {
        console.error("Error fetching rating summary:", err);
      }
    };

    fetchRatingSummary();
  }, [serviceId]);

  if (!ratingsData) return <p>Loading ratings...</p>;

  const maxCount = Math.max(...ratingsData.breakdown.map((r) => r.count));

  return (
    <div style={{ display: "flex", flexWrap: "wrap",gap:"1rem" }}>
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
