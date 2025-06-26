import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./Home.css";
import image1 from "../../assets/home/dj.png";
import image2 from "../../assets/home/bass brand.png";
import image3 from "../../assets/home/tenthouse.png";
import image4 from "../../assets/home/wedding photographer.png";
import image5 from "../../assets/home/pandit.png";
import image6 from "../../assets/home/magician.png";
import image7 from "../../assets/home/orchestra.png";
import image8 from "../../assets/home/moulbi.png";
import image9 from "../../assets/home/father.png";
import image10 from "../../assets/home/catering.png";
import image11 from "../../assets/home/bride mehendi & makeup.png";
import image12 from "../../assets/home/flower decor.png";
import image13 from "../../assets/home/car & horsecart decor.png";
import image14 from "../../assets/home/fireworks.png";
import image15 from "../../assets/home/cardsinvite.jpg";

import shaadiMobile from "../../assets/home/shaadiMobile.png";
import shaadiTablet from "../../assets/home/shaadiTablet.png";
import shaadiDesktop from "../../assets/home/shaadiDesktop.png";
import christianMobile from "../../assets/home/christianMobile.png";
import christianTablet from "../../assets/home/christianTablet.png";
import christianDesktop from "../../assets/home/christianDesktop.png";
import cateringMobile from "../../assets/home/cateringMobile.png";
import cateringTablet from "../../assets/home/cateringTablet.png";
import cateringDesktop from "../../assets/home/cateringDesktop.png";

import CategoryCard from "../../components/customer/Home/CategoryCard";
import ReviewSlider from "../../components/customer/Home/ReviewSlider";
import FaqSection from "../../components/customer/Home/FaqSection";
import ImageSlider from "../../components/customer/Home/ImageSlider";

import Milestones from "../../components/common/aboutus/Milestones";
import AddsBanner from "../../components/customer/Home/AddsBanner";

const images = [
  {
    mobile: shaadiMobile,
    tablet: shaadiTablet,
    desktop: shaadiDesktop,
  },
  {
    mobile: christianMobile,

    desktop: christianDesktop,
  },
  {
    mobile: cateringMobile,
    tablet: cateringTablet,
    desktop: cateringDesktop,
  },
  // {
  //   mobile: image4Mobile,
  //   tablet: image4Tablet,
  //   desktop: image4Desktop,
  // },
  // {
  //   mobile: image6Mobile,
  //   tablet: image6Tablet,
  //   desktop: image6Desktop,
  // },
  // {
  //   mobile: image7Mobile,
  //   tablet: image7Tablet,
  //   desktop: image7Desktop,
  // },
  // {
  //   mobile: image10Mobile,
  //   tablet: image10Tablet,
  //   desktop: image10Desktop,
  // },
  // {
  //   mobile: image11Mobile,
  //   tablet: image11Tablet,
  //   desktop: image11Desktop,
  // },
  // {
  //   mobile: image12Mobile,
  //   tablet: image12Tablet,
  //   desktop: image12Desktop,
  // },
  // {
  //   mobile: image13Mobile,
  //   tablet: image13Tablet,
  //   desktop: image13Desktop,
  // },
  // {
  //   mobile: image14Mobile,
  //   tablet: image14Tablet,
  //   desktop: image14Desktop,
  // },
  // {
  //   mobile: image15Mobile,
  //   tablet: image15Tablet,
  //   desktop: image15Desktop,
  // },
];

const categories = [
  { title: "DJ", image: image1, tagline: "Beats That Breathe Fun", icon: "🎧" },
  {
    title: "Bands",
    image: image2,
    tagline: "Brass Beats the Best",
    icon: "🎺",
  },
  {
    title: "Tent & Decor",
    image: image3,
    tagline: "Dream Drapes, Divine Vibes",
    icon: "🎪",
  },
  {
    title: "Photographer",
    image: image4,
    tagline: "Freeze Time with Frames",
    icon: "📸",
  },
  {
    title: "Pandit",
    image: image5,
    tagline: "Mantras Meet Moments",
    icon: "🕉",
  },
  {
    title: "Magician",
    image: image6,
    tagline: "Illusions that Amaze All",
    icon: "🎩",
  },
  {
    title: "Orchestra (Dance & Singing)",
    image: image7,
    tagline: "Echoes of Celebration",
    icon: "🎤",
  },
  {
    title: "Maulbi",
    image: image8,
    tagline: "Prayers that Guide Hearts",
    icon: "🕌",
  },
  {
    title: "Father (Priest)",
    image: image9,
    tagline: "Grace in Every Verse",
    icon: "⛪",
  },
  {
    title: "Catering",
    image: image10,
    tagline: "Flavours that Speak Love",
    icon: "🍽",
  },
  {
    title: "Makeup & Mehendi Artist",
    image: image11,
    tagline: "Beauty in Every Brush",
    icon: "💄",
  },
  {
    title: "Flower Decoration/ Florist ",
    image: image12,
    tagline: "Blooms that Whisper Joy",
    icon: "💐",
  },
  {
    title: "Horse Cart & Grooming Car",
    image: image13,
    tagline: "Royal Rides Await You",
    icon: "🐎",
  },
  {
    title: "Fireworkers",
    image: image14,
    tagline: "Skies that Spark Magic",
    icon: "🎆",
  },
  {
    title: "Card Printers & Designers",
    image: image15,
    tagline: "Words That Welcome",
    icon: "💌",
  },
];

const Home = () => {
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/", {
          withCredentials: true,
        });
        console.log(response.data.message);

        console.log(response.data.data);
        const { user, accessToken } = response.data.data;
        if (user && accessToken) {
          localStorage.setItem("currentlyLoggedIn", true);
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
      <p className="category-subheads  text-center ">
        Explore trusted professionals across categories and simplify your event
        planning.
      </p>

      {!showAll && categories.length > 6 && (
        <div className="browse_all">
          <button
            className="browse-all-btn"
            onClick={() => setShowAll(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            View All <span className="arrow">{hovered ? "⇒" : "→"}</span>
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
      <Milestones />
      <ReviewSlider />
      <FaqSection />
    </div>
  );
};

export default Home;
