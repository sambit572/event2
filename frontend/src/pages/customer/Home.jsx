import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

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
import banner from "../../assets/home/banner.jpg";
import CategoryCard from "../../components/customer/Home/CategoryCard";
import ReviewSlider from "../../components/customer/Home/ReviewSlider";
import FaqSection from "../../components/customer/Home/FaqSection";
import ImageSlider from "../../components/customer/Home/ImageSlider";

import Milestones from "../../components/common/aboutus/Milestones";
import AddsBanner from "../../components/customer/Home/AddsBanner";

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
   {
    title: "DJ",
    description: "Groove to the beats with professional DJ setups for every vibe.",
    image: image1
  },
  {
    title: "Brass band & Other regional band",
    description: "Traditional and cultural rhythms to elevate every procession.",
    image: image2
  },
  {
    title: "Tenthouse & Decor",
    description: "Stylish, comfortable, and theme-ready tent & decor services.",
    image: image3
  },
  {
    title: "Photographer & Videographer",
    description: "Capture timeless memories with skilled photo & video professionals.",
    image: image4
  },
  {
    title: "Pandit",
    description: "Experienced Pandits for all religious ceremonies and rituals.",
    image: image5
  },
  {
    title: "Magician",
    description: "Add wonder and laughter to your event with live magic shows.",
    image: image6
  },
  {
    title: "Orchestra (dance and singing)",
    description: "Live performances of music and dance for energetic celebrations.",
    image: image7
  },
  {
    title: "Moulbi",
    description: "Qualified Moulbis for authentic and respectful Islamic rituals.",
    image: image8
  },
  {
    title: "Father",
    description: "Experienced priests to bless and officiate Christian weddings and events.",
    image: image9
  },
  {
    title: "Catering",
    description: "Delicious multi-cuisine catering for all tastes and themes.",
    image: image10
  },
  {
    title: "Makeup & Mehendi Artist",
    description: "Bridal and guest glam with expert mehendi and makeup artists.",
    image: image11
  },
  {
    title: "Flower Decoration / Florist",
    description: "Fresh floral arrangements for a blooming and fragrant venue.",
    image: image12
  },
  {
    title: "Horse Cart & Grooming Car",
    description: "Royal baraat entry with well-groomed horses and decorated cars.",
    image: image13
  },
  {
    title: "Fireworkers",
    description: "Dazzling fireworks to light up your special moments.",
    image: image14
  },
  {
    title: "Card Designers & Printers",
    description: "Elegant and custom invitation card designing and printing.",
    image: image15
  }
];

const Home = () => {
  const [showAll, setShowAll] = useState(false);
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
      <Milestones />
      <ReviewSlider />
      <FaqSection />
    </div>
  );
};

export default Home;
