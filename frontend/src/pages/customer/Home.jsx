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
import categories from "../../utils/CatogoryData.jsx";
import HeroSection from "../../components/customer/home/HeroSection.jsx";
import DreamEventSection from "../../components/customer/home/DreamEventSection.jsx";
import TrustSection from "../../components/customer/home/TrustSection.jsx";

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
        const data = response.data.data;
        if (data?.user) {
          localStorage.setItem("currentlyLoggedIn", "true");
          localStorage.setItem(
            "userFirstName",
            data.user.fullName.split(" ")[0]
          );
        }
        if (data?.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
      } catch (error) {
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

        {/* Section 2 — Hero */}
        <HeroSection />

        {/* Section 3 — Everything for your Dream Event */}
        <DreamEventSection />

        {/* Scrolling features ticker */}
        <Suspense fallback={<div>Loading...</div>}>
          <Features />
        </Suspense>

        {/* Categories */}
        <div id="categories" className="categories-head1">
          <h1 className="align_center categories-head mt-8">𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒</h1>
        </div>
        <p className="category-subheads text-center">
          Explore trusted professionals across categories and simplify your
          event planning.
        </p>
        <div className="align_center category_section">
          {visibleCategories.map((category, index) => (
            <div key={index}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full items-center mb-4">
          {!showAll && categories.length > 6 && (
            <button
              className="browse-all-btn"
              onClick={handleShowAll}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              View All <span className="arrow">{hovered ? "⇓" : "↓"}</span>
            </button>
          )}
        </div>

        {/* Section 4 — 3-Step Success + Reviews + FAQ */}
        
        <Suspense fallback={<div>Loading...</div>}>
          <StepsSection />
          <TrustSection />
          <ReviewSlider />
          <FaqSection />
        </Suspense>

      </div>
    </>
  );
};

export default Home;
