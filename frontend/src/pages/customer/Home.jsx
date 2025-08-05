import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";

import shaadiMobile from "../../assets/home/sliderImages/shaadi-mobile.png";
import shaadiTablet from "../../assets/home/sliderImages/shaadi-tablet.png";
import shaadiDesktop from "../../assets/home/sliderImages/shaadi-desktop.png";
import christianMobile from "../../assets/home/sliderImages/christian-mobile.png";
import christianTablet from "../../assets/home/sliderImages/christian-tablet.png";
import christianDesktop from "../../assets/home/sliderImages/christian-desktop.png";
import cateringMobile from "../../assets/home/sliderImages/catering-mobile.png";
import cateringTablet from "../../assets/home/sliderImages/catering-tablet.png";
import cateringDesktop from "../../assets/home/sliderImages/catering-desktop.png";

import CategoryCard from "../../components/customer/home/CategoryCard.jsx";
import ReviewSlider from "../../components/customer/home/ReviewSlider.jsx";
import FaqSection from "../../components/customer/home/FaqSection.jsx";
import ImageSlider from "../../components/customer/home/ImageSlider.jsx";

import Milestones from "../../components/common/aboutus/Milestones";
import AddsBanner from "../../components/customer/home/AddsBanner.jsx";
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
  {
    mobile: christianMobile,
    tablet: christianTablet,
    desktop: christianDesktop,
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
          `${import.meta.env.VITE_BACKEND_URL}/user/no-need-to-login`,
          { withCredentials: true }
        );

        console.log(response.data.message);
        console.log(response.data.data);

        const data = response.data.data;

        if (data?.user) {
          localStorage.setItem("currentlyLoggedIn", "true");
          localStorage.setItem(
            "userFirstName",
            data.user.fullName.split(" ")[0]
          );
        }

        // ✅ Optional: Store access token if backend sends it
        if (data?.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
      } catch (error) {
        console.log(
          "error in noLogin :",
          error.response?.data?.message || error.message
        );

        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("currentlyLoggedIn");
          localStorage.removeItem("userFirstName");
          localStorage.removeItem("accessToken");
        }
      }
    };

    checkUser();
  }, []);

  return (
    <div className="home">
      <ImageSlider images={images} />
      <AddsBanner />
      {/* <img className="addbanner" src={banner} alt="" /> */}
      <div id="categories" className="categories-head1 mb-[-15px]">
        <h1 className="align_center categories-head">Categories</h1>
      </div>
      <p className="category-subheads text-base mr-4 text-center">
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
