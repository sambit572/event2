import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";

import shaadiMobile from "../../assets/home/sliderImages/shaadiMobile.png";
import shaadiTablet from "../../assets/home/sliderImages/shaadiTablet.png";
import shaadiDesktop from "../../assets/home/sliderImages/shaadiDesktop.png";
import christianMobile from "../../assets/home/sliderImages/christianMobile.png";
import christianTablet from "../../assets/home/sliderImages/christianTablet.png";
import christianDesktop from "../../assets/home/sliderImages/christianDesktop.png";
import cateringMobile from "../../assets/home/sliderImages/cateringMobile.png";
import cateringTablet from "../../assets/home/sliderImages/cateringTablet.png";
import cateringDesktop from "../../assets/home/sliderImages/cateringDesktop.png";

import CategoryCard from "../../components/customer/Home/CategoryCard";
import ReviewSlider from "../../components/customer/Home/ReviewSlider";
import FaqSection from "../../components/customer/Home/FaqSection";
import ImageSlider from "../../components/customer/Home/ImageSlider";

import Milestones from "../../components/common/aboutus/Milestones";
import AddsBanner from "../../components/customer/Home/AddsBanner";
import categories from "../../utils/CatogoryData.jsx";

const images = [
  {
    mobile: shaadiMobile,
    tablet: shaadiTablet,
    desktop: shaadiDesktop,
  },
  {
    mobile: christianMobile,
    tablet: christianTablet,
    desktop: christianDesktop,
  },
  {
    mobile: cateringMobile,
    tablet: cateringTablet,
    desktop: cateringDesktop,
  },
];
const Home = () => {
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.message);

        console.log(response.data.data);
        const { user, accessToken } = response.data.data;
        if (user && accessToken) {
          localStorage.setItem("currentlyLoggedIn", "true");
          localStorage.setItem("userFirstName", user.fullName.split(" ")[0]);
        }
      } catch (error) {
        console.log(
          "error in noLogin :",
          error.data?.data?.message || error.message
        );
      }
    };

    checkUser();
  }, []);

  return (
    <div className="home">
      <ImageSlider images={images} />
      <AddsBanner />
      {/* <img className="addbanner" src={banner} alt="" /> */}
      <div className="categories-head1 mb-[-15px]">
        <h1 className="align_center categories-head">Categories</h1>
      </div>
      <p className="category-subheads text-center">
        Explore trusted professionals across categories and simplify your event
        planning.
      </p>

      {/* View All Button */}
      <div className="flex justify-end w-full items-center mb-4">
        {!showAll && categories.length > 6 && (
          <button
            className="browse-all-btn "
            onClick={() => setShowAll(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            View All <span className="arrow">{hovered ? "⇒" : "→"}</span>
          </button>
        )}
      </div>

      {/* Category Grid */}
      <div className="align_center category_section">
        {visibleCategories.map((category, index) => (
          <div key={index}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

      <Milestones />
      <ReviewSlider />
      <FaqSection />
    </div>
  );
};

export default Home;
