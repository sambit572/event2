import React, { useState, useRef, useEffect } from "react";
import "./ReviewSlider.css";
import user1 from "../../../assets/reviews/user1.jpg";
import user2 from "../../../assets/reviews/user2.jpg";
import user3 from "../../../assets/reviews/user3.jpg";
import axios from "axios";

const dummyImages = [user1, user2, user3];
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const staticReviews = [
  {
    name: "Abhijit Pati",
    rating: 5,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user1,
  },
  {
    name: "Amrit Swain",
    rating: 4,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user2,
  },
  {
    name: "Vedant Vandra",
    rating: 5,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user3,
  },
  {
    name: "Rahul Yadav",
    rating: 4,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user1,
  },
  {
    name: "Hrishikesh Kundu",
    rating: 5,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user2,
  },
  {
    name: "Shreya Rout",
    rating: 5,
    text: "Absolutely loved it! Highly recommend, must try and best.",
    image: user3,
  },
];

const ReviewSlider = () => {
  const [offset, setOffset] = useState(0);
  const [userReviews, setUserReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  const containerRef = useRef(null);

  // Auto-scroll effect
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

  // Fetch user-submitted reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/reviews/all`);

        // Assign consistent image based on index to avoid shifting
        const backendReviews = res.data.data.map((review, index) => ({
          ...review,
          image: dummyImages[index % dummyImages.length],
        }));

        setUserReviews(backendReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BACKEND_URL}/api/reviews/add`, {
        name: formData.name,
        rating: formData.rating,
        text: formData.text,
      });

      // Assign image based on new review position
      const newReview = {
        ...formData,
        image: dummyImages[(userReviews.length) % dummyImages.length],
      };

      setUserReviews((prev) => [...prev, newReview]);
      setFormData({ name: "", rating: 5, text: "" });
    } catch (err) {
      console.error("Failed to submit review:", err.message);
    }
  };

const allReviews = [...staticReviews, ...userReviews];
const filteredReviews = allReviews.filter((review) => review.rating >= 4);
const duplicatedReviews = [...filteredReviews, ...filteredReviews];


  return (
    <div className="review_section">
      <h1 className="heading_review">Our Reviews</h1>
      <h3 className="subheadings">Celebrated by Many, Loved by All.</h3>

      {/* Review Submission Form */}
     


      {/* Review Slider */}
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
                  <span key={`filled-${i}-${index}`} className="star filled">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <span key={`empty-${i}-${index}`} className="star empty">
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
