import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import "./Home.css";
import { Seo } from "../../seo/seo.js";

const AddsBanner = React.lazy(() =>
  import("./../../components/customer/home/AddsBanner")
);
const Features = React.lazy(() =>
  import("../../components/customer/home/Features")
);

const StepsSection = React.lazy(() =>
  import("../../components/customer/home/StepsSection.jsx")
);

import CategoryCard from "../../components/customer/home/CategoryCard.jsx";
// import ImageSlider from "../../components/customer/home/ImageSlider.jsx";

// import Milestones from "../../components/common/aboutus/Milestones";
// import AddsBanner from "../../components/customer/home/AddsBanner.jsx";
import categories from "../../utils/CatogoryData.jsx";
// import StepsSection from "../../components/customer/home/StepsSection.jsx";
// import CulturalDanceSlider from "../common/CulturalDanceSlider.jsx";
import HeroSection from "../../components/customer/home/HeroSection.jsx";
// import AddsBanner from "../../components/customer/home/AddsBanner.jsx";
// import Features from "./../../components/customer/home/Features";

// ✅ Lazy load heavy components below
const ReviewSlider = React.lazy(() =>
  import("../../components/customer/home/ReviewSlider.jsx")
);
const FaqSection = React.lazy(() =>
  import("../../components/customer/home/FaqSection.jsx")
);

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
    requestIdleCallback(() => {
      checkUser();
    });
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
    <>
      <Seo
        title="EventsBridge"
        description="Book and manage events effortlessly with Eventsbridge. Discover venues, plan online events and simplify bookings all in one place."
      />
      <div className="home">
        <HeroSection />
        <Suspense fallback={<div>Loading ...</div>}>
          <Features />
          {/* <AddsBanner /> */}
        </Suspense>
        <div id="categories" className="categories-head1">
          <h1 className="align_center categories-head mt-8">𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒</h1>
        </div>
        <p className="category-subheads text-center">
          Explore trusted professionals across categories and simplify your
          event planning.
        </p>
        {/* Category Grid */}
        <div className="align_center category_section">
          {visibleCategories.map((category, index) => (
            <div key={index}>
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
        {/* <Milestones /> */}
        <Suspense fallback={<div>Loading ...</div>}>
          <StepsSection />
          <ReviewSlider />
          <FaqSection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
