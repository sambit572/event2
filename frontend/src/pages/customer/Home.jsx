import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import "./Home.css";
import { motion } from "motion/react";

import slider_1 from "../../assets/home/sliderImages/slider_1.jpg";
import slider_2 from "../../assets/home/sliderImages/slider_2.jpeg";
import slider_3 from "../../assets/home/sliderImages/slider_3.jpeg";
import slider_4 from "../../assets/home/sliderImages/slider_4.jpeg";
import slider_5 from "../../assets/home/sliderImages/slider_5.jpeg";
import slider_6 from "../../assets/home/sliderImages/slider_6.jpeg";
import slider_7 from "../../assets/home/sliderImages/slider_7.jpeg";
import slider_8 from "../../assets/home/sliderImages/slider_8.jpeg";
import slider_9 from "../../assets/home/sliderImages/slider_9.jpeg";
import slider_10 from "../../assets/home/sliderImages/slider_10.jpeg";
import slider_11 from "../../assets/home/sliderImages/slider_11.jpeg";

import CategoryCard from "../../components/customer/home/CategoryCard.jsx";
import ImageSlider from "../../components/customer/home/ImageSlider.jsx";

// import Milestones from "../../components/common/aboutus/Milestones";
import AddsBanner from "../../components/customer/home/AddsBanner.jsx";
import categories from "../../utils/CatogoryData.jsx";
import StepsSection from "../../components/customer/home/StepsSection.jsx";
import CulturalDanceSlider from "../common/CulturalDanceSlider.jsx";
import HeroSection from "../../components/customer/home/HeroSection.jsx";
import Features from "./../../components/customer/home/Features";

// ✅ Lazy load heavy components below
const ReviewSlider = React.lazy(() =>
  import("../../components/customer/home/ReviewSlider.jsx")
);
const FaqSection = React.lazy(() =>
  import("../../components/customer/home/FaqSection.jsx")
);

const images = [
  {
    desktop: slider_9,
  },
  {
    // mobile: christianMobile,
    // tablet: christianTablet,
    desktop: slider_2,
  },
  {
    desktop: slider_3,
  },
  {
    desktop: slider_4,
  },
  {
    desktop: slider_5,
  },
  {
    desktop: slider_6,
  },
  {
    desktop: slider_7,
  },
  {
    desktop: slider_8,
  },
  {
    // mobile: shaadiMobile,
    // tablet: shaadiTablet,
    desktop: slider_1,
  },
  {
    desktop: slider_10,
  },
  {
    desktop: slider_11,
  },
];
const Home = () => {
  const [showAll, setShowAll] = useState(
    () => sessionStorage.getItem("showAll") === "true"
  );
  const [hovered, setHovered] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  const handleShowAll = () => {
    sessionStorage.setItem("showAll", "true");
    setShowAll(true);
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/no-need-to-login`,
          { withCredentials: true }
        );

        // console.log(response.data.message);
        // console.log(response.data.data);

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
  useEffect(() => {
    if (location.hash === "#categories") {
      const el = document.getElementById("categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div className="home">
      {/* <ImageSlider images={images} /> */}
      <HeroSection />
      <Features />
      {/* <AddsBanner /> */}
      <CulturalDanceSlider />
      {/* <img className="addbanner" src={banner} alt="" /> */}
      <div id="categories" className="categories-head1 mb-[-15px]">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="align_center categories-head mt-8"
        >
          𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒
        </motion.h1>
      </div>
      <p className="category-subheads text-center">
        Explore trusted professionals across categories and simplify your event
        planning.
      </p>
      {/* Category Grid */}
      <div className="align_center category_section">
        {visibleCategories.map((category, index) => (
          // <motion.div
          //   key={index}
          //   initial={{ opacity: 0, y: 50 }}
          //   whileInView={{ opacity: 1, y: 0 }}
          //   viewport={{ once: true, amount: 0.3 }}
          //   transition={{ duration: index * 0.2, ease: "easeInOut" }}
          // >
          //   {" "}
          //   <CategoryCard category={category} />
          // </motion.div>
          <div>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="flex justify-center w-full items-center mb-4">
        {!showAll && categories.length > 6 && (
          <button
            className="browse-all-btn "
            onClick={handleShowAll}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            View All <span className="arrow">{hovered ? "⇓" : "↓"}</span>
          </button>
        )}
      </div>
      <StepsSection />
      {/* <Milestones /> */}
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ReviewSlider />
      </Suspense>
      <Suspense fallback={<div>Loading FAQs...</div>}>
        <FaqSection />
      </Suspense>
    </div>
  );
};

export default Home;
