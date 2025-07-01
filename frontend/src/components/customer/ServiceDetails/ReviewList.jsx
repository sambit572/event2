import React from "react";
import similarimg2 from "../../../assets/service/similar-dj-img2.jfif";
import similarimg3 from "../../../assets/service/similar-dj-img3.jpg";
import similarimg4 from "../../../assets/service/similar-dj-img4.jpg";
import similarimg5 from "../../../assets/service/similar-dj-img5.jpg";
import ReviewCard from "./ReviewCard";
// Sample review data
const reviews = [
  {
    name: "John Doe",
    rating: 4.5,
    label: "Excellent product",
    date: "2025-05-01",
    text: "Loved the product, very comfortable and durable.",
    images: [similarimg2, similarimg3],
    helpful: 10,
  },
  {
    name: "Jane Smith",
    rating: 4.0,
    label: "Good value",
    date: "2025-05-10",
    text: "Worth the price, would recommend to others.",
    images: [similarimg4],
    helpful: 3,
  },
  {
    name: "Jane Smith",
    rating: 4.0,
    label: "Good value",
    date: "2025-05-10",
    text: "Worth the price, would recommend to others.",
    images: [similarimg5, similarimg4],
    helpful: 3,
  },
];

const ReviewList = () => {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        color: "#001f3f",
      }}
    >
      {reviews.map((rev, i) => (
        <ReviewCard key={i} review={rev} />
      ))}
    </div>
  );
};

export default ReviewList;
