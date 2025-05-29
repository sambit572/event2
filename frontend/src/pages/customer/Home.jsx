import React, { useState, useEffect, useRef } from "react";

import "./Home.css";
import image1 from "../../assets/home/dj.jpg";
import image2 from "../../assets/home/band.jpg";
import image3 from "../../assets/home/tentdecorators.jpeg";
import image4 from "../../assets/home/photography.jpg";
import image5 from "../../assets/home/pandit.webp";
import image6 from "../../assets/home/magiciation.jpg";
import image7 from "../../assets/home/Orchestra.jpg";
import image8 from "../../assets/home/maulbi.jpeg";
import image9 from "../../assets/home/father.webp";
import image10 from "../../assets/home/caterring.jpg";
import image11 from "../../assets/home/mehndi.jpg";
import image12 from "../../assets/home/decoration.jpg";
import image13 from "../../assets/home/horsecart.jpg";
import image14 from "../../assets/home/cracker.jpg";
import image15 from "../../assets/home/cardsinvite.jpg";

import user1 from "../../assets/reviews/user1.jpg";
import user2 from "../../assets/reviews/user2.jpg";
import user3 from "../../assets/reviews/user3.jpg";


import ImageSlider from "../../components/customer/ImageSlider";
import CategoryCard from "../../components/customer/CategoryCard";

const images = [
  image1, image2, image4, image6, image7,
  image10, image11, image12, image13, image14, image15
];

const categories = [
  { title: "Dj", image: image1 },
  { title: "Brass band & Other regional band", image: image2 },
  { title: "Tenthouse & Decor", image: image3 },
  { title: "Photographer & Videographer", image: image4 },
  { title: "Pandit", image: image5 },
  { title: "Magician", image: image6 },
  { title: "Orchestra (dance and singing)", image: image7 },
  { title: "Moulbi", image: image8 },
  { title: "Father", image: image9 },
  { title: "Catering", image: image10 },
  { title: "Makeup & Mehendi Artist", image: image11 },
  { title: "Flower Decoration / Florist", image: image12 },
  { title: "Horse Cart & Grooming Car", image: image13 },
  { title: "Fireworkers", image: image14 },
  { title: "Card Designers & Printers", image: image15 },
];

const reviews = [
  { name: "Abhijit Pati", rating: 5, text: "Absolutely loved it!Highly recommend , must try and best.", image: user1 },
  { name: "Amrit Swain", rating: 4, text: "Absolutely loved it!Highly recommend , must try and best.",image: user2 },
  { name: "Vedant Vandra", rating: 5, text: "Absolutely loved it!Highly recommend , must try and best.",image: user3 },
  { name: "Rahul Yadav", rating: 4, text: "Absolutely loved it!Highly recommend , must try and best.",image: user1  },
  { name: "Hrishikesh Kundu", rating: 5, text: "Absolutely loved it!Highly recommend , must try and best.",image: user2  },
  { name: "Shreya Rout", rating: 5, text: "Absolutely loved it!Highly recommend , must try and best.",image: user3  },
];

const Home = () => {
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
    <div>
      <ImageSlider images={images} />

      <h1 className="align_center heading">Categories</h1>
      <div className="category_section">
        {categories.map((category, index) => (
          <div key={index}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      <div className="review_section">
        <h1 className="align_center heading">Reviews</h1>
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
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
