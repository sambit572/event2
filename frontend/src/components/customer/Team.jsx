import React, { useState } from "react";

import "./Team.css";
import user1 from "../../assets/reviews/user1.jpg";
import user2 from "../../assets/reviews/user2.jpg";
import user3 from "../../assets/reviews/user3.jpg";
import { useRef } from "react";
import { useEffect } from "react";

const reviews = [
  {
    name: "Abhijit Pati",
    rating: 5,
    text: "Co-Founder.",
    image: user1,
  },
  {
    name: "Amrit Swain",
    rating: 4,
    text: "Founder.",
    image: user2,
  },
  {
    name: "Vedant Vandra",
    rating: 5,
    text: "Developer",
    image: user3,
  },
  {
    name: "Rahul Yadav",
    rating: 4,
    text: "Developer",
    image: user1,
  },
  {
    name: "Hrishikesh Kundu",
    rating: 5,
    text: "Designer",
    image: user2,
  },
  {
    name: "Shreya Rout",
    rating: 5,
    text: "Designer",
    image: user3,
  },
  {
    name: "Rohit Agarwal",
    rating: 5,
    text: "Developer",
    image: user1,
  },
  {
    name: "Rudraksh Dash",
    rating: 5,
    text: "Developer",
    image: user2,
  },
  {
    name: "Jyoti Prakash",
    rating: 5,
    text: "Designer",
    image: user3,
  },
  {
    name: "Sarita Khatua",
    rating: 5,
    text: "Developer",
    image: user2,
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
    <div className="review_section_2">
      <h1 className="align_center heading">Our Team</h1>
      <div className="review_wrapper_2" ref={containerRef}>
        <div
          className="review_container_2"
          style={{
            transform: `translateX(-${offset}px)`,
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <div key={index} className="review_card_2">
              <img
                src={review.image}
                alt={review.name}
                className="review_avatar_2"
              />
              <h3>{review.name}</h3>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
