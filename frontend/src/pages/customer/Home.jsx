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
import ImageSlider from "../../components/customer/ImageSlider";
import CategoryCard from "../../components/customer/CategoryCard";
import ReviewSlider from "../../components/customer/ReviewSlider";
import FaqSection from "../../components/customer/FaqSection";

const images = [
  image1,
  image2,
  image4,
  image6,
  image7,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
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

const Home = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <div className="home">
      <ImageSlider images={images} />
      <h1 className="align_center heading">Categories</h1>
      {!showAll && categories.length > 6 && (
        <div className="browse_all">
          <button className="browse-all-btn" onClick={() => setShowAll(true)}>
            Browse All &#x2192;
          </button>
        </div>
      )}
      <div className="align_center category_section">
        {visibleCategories.map((category, index) => (
          <div key={index}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      <ReviewSlider />
      <FaqSection />
    </div>
  );
};

export default Home;
