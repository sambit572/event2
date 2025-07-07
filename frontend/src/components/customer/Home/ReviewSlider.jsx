import React, { useState } from "react";

import "./ReviewSlider.css";
import user1 from "../../../assets/reviews/user1.jpg";
import user2 from "../../../assets/reviews/user2.jpg";
import user3 from "../../../assets/reviews/user3.jpg";
import { useRef } from "react";
import { useEffect } from "react";

const reviews = [
  {
    name: "Abhijit Pati",
    rating: 5,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user1,
  },
  {
    name: "Amrit Swain",
    rating: 4,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user2,
  },
  {
    name: "Vedant Vandra",
    rating: 5,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user3,
  },
  {
    name: "Rahul Yadav",
    rating: 4,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user1,
  },
  {
    name: "Hrishikesh Kundu",
    rating: 5,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user2,
  },
  {
    name: "Shreya Rout",
    rating: 5,
    text: "Absolutely loved it!Highly recommend , must try and best.",
    image: user3,
  },
];

const ReviewSlider = () => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef(null);
  const cardWidth = 310;

  useEffect(() => {
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
  }, []);

  const duplicatedReviews = [...reviews, ...reviews];
  return (
    <div className="review_section">
      <h1 className="heading_review">Our Reviews</h1>

      <h3 className="subheadings">Celebrated by Many, Loved by All.</h3>
      <div className="review_wrapper" ref={containerRef}>
        <div
          className="review_container"
          style={{
            transform: `translateX(-${offset}px)`,
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <div key={index} className="review_card">
              <img
                src={review.image}
                alt={review.name}
                className="review_avatar"
              />
              <h3>{review.name}</h3>
              <div className="review_rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={`filled-${i}`} className="star filled">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <span key={`empty-${i}`} className="star empty">
                    ☆
                  </span>
                ))}
              </div>

              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
