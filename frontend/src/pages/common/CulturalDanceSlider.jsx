import React, { useEffect, useState } from "react";
import "./CulturalDanceSlider.css"; // ✅ Import the CSS
import { motion } from "motion/react";

// 🖼️ Example placeholder images
import puri from "../../assets/famousCultural/konark-and-puri-jagannath-temple.jpg";
import odissi from "../../assets/famousCultural/odishi dance1.jpeg";

import tirupati from "../../assets/famousCultural/Tirupati-Balaji-temple.jpg";
import kuchipudi from "../../assets/famousCultural/kuchipudi.jpg";

import ponungDance from "../../assets/famousCultural/ponung.jpg";
import tawang from "../../assets/famousCultural/tawang-monastery.jpg";

import bihu from "../../assets/famousCultural/bihu dance.jpg";
import kaziranga from "../../assets/famousCultural/Kaziranga-National-Park.jpg";

import bodhGaya from "../../assets/famousCultural/Bodh-Gaya.jpg";
import jatJatin from "../../assets/famousCultural/jat-jatin.png";

import panthi from "../../assets/famousCultural/panthi-dance.jpg";
import chitrakote from "../../assets/famousCultural/CHITRAKOTE.jpg";

import bagaBeach from "../../assets/famousCultural/baga-sea-beach.jpg";
import fugdiDance from "../../assets/famousCultural/Fugdi_Dancer.jpg";

import garba from "../../assets/famousCultural/garba-dance-festival.jpg";
import somnath from "../../assets/famousCultural/Somnath_Temple.jpg";

import phagDanceImage from "../../assets/famousCultural/hariyana dance.webp";
import kurukshetraImage from "../../assets/famousCultural/kurukshetra-haryana.jpg";

import nati from "../../assets/famousCultural/Nati-Himachal-Pradesh.webp";
import spiti from "../../assets/famousCultural/spiti.jpg";

import chhau from "../../assets/famousCultural/chhau.jpg";
import pareshnath from "../../assets/famousCultural/pareshnath.png";

import yakshagana from "../../assets/famousCultural/Yaksha-Gana.jpg";
import mysorePalace from "../../assets/famousCultural/Mysore-Palace.jpg";

import kathakali from "../../assets/famousCultural/Kathakali-1.jpg";
import alleppeyImage from "../../assets/famousCultural/alleppey-kerala.jpg";

import matkiDance from "../../assets/famousCultural/Matki_dance_(Madhya_Pradesh.jpg";
import khajuraho from "../../assets/famousCultural/khajuraho.jpg";

import lavani from "../../assets/famousCultural/Lavani-dancer-5.png";
import gatewayIndia from "../../assets/famousCultural/gateway.jpg";

import loktakLake from "../../assets/famousCultural/manipur.webp";
import rasLila from "../../assets/famousCultural/manipur rasleela.png";

import livingRootBridge from "../../assets/famousCultural/meghalaya.webp";
import wangala from "../../assets/famousCultural/wangala.png";

import cheraw from "../../assets/famousCultural/bamboo.jpg";
import solomon from "../../assets/famousCultural/solomon misoram.webp";

import bharatanatyam from "../../assets/famousCultural/Bharatnatyam.jpg";
import meenakshi from "../../assets/famousCultural/meenakshi.jpeg";

import nagaWarDance from "../../assets/famousCultural/nagaland dance.jpg";
import dzukouValley from "../../assets/famousCultural/nagaland.webp";

import bhangra from "../../assets/famousCultural/bhangra.jpg";
import goldenTemple from "../../assets/famousCultural/Punjab Golden Temple (1).jpg";

import ghoomar from "../../assets/famousCultural/Ghoomar_dancers.jpg";
import hawaMahal from "../../assets/famousCultural/Hawa-Mahal.webp";

import pulak from "../../assets/famousCultural/pulak-bhagawati-sikim.jpg";
import chamDance from "../../assets/famousCultural/sikkim cham dance.png";

import tajMahal from "../../assets/famousCultural/tajmahal2.jpg";
import kathak from "../../assets/famousCultural/kathak dance1.png";
import kedarnath from "../../assets/famousCultural/kedarnath.jpg";
import pandavNritya from "../../assets/famousCultural/uk Pandav nritya .png";
import victoriaMemorial from "../../assets/famousCultural/westbengal victoria palace.jpg";
import puruliaChhau from "../../assets/famousCultural/chhau.jpeg";

import perini from "../../assets/famousCultural/telengana dance .jpg";
import charminar from "../../assets/famousCultural/charminar.jpg";
import hojagiri from "../../assets/famousCultural/hojagiri_dance.png";
import tripuraTemple from "../../assets/famousCultural/tripura.jpg";

// // 🌏 Full Indian States & UTs Data
const states = [
  {
    state: "Odisha",
    items: [{ image: puri }, { name: "Odissi", image: odissi }],
  },
  {
    state: "Andhra Pradesh",
    items: [
      {
        image: tirupati,
      },
      { name: "Kuchipudi Dance", image: kuchipudi },
    ],
  },
  {
    state: "Arunachal Pradesh",
    items: [
      { image: tawang },
      {
        name: "Ponung Dance",
        image: ponungDance,
      },
    ],
  },
  {
    state: "Assam",
    items: [
      {
        image: kaziranga,
      },
      { name: "Bihu", image: bihu },
    ],
  },
  {
    state: "Bihar",
    items: [
      {
        image: bodhGaya,
      },
      {
        name: "Jat-Jatin Dance",
        image: jatJatin,
      },
    ],
  },
  {
    state: "Chhattisgarh",
    items: [
      {
        image: chitrakote,
      },
      {
        name: "Panthi Dance",
        image: panthi,
      },
    ],
  },
  {
    state: "Goa",
    items: [
      {
        image: bagaBeach,
      },
      {
        name: "Fugdi Dance",
        image: fugdiDance,
      },
    ],
  },
  {
    state: "Gujarat",
    items: [
      {
        image: somnath,
      },
      {
        name: "Garba Dance",
        image: garba,
      },
    ],
  },
  {
    state: "Haryana",
    items: [
      {
        image: kurukshetraImage,
      },
      {
        name: "Phag Dance",
        image: phagDanceImage,
      },
    ],
  },
  {
    state: "Himachal Pradesh",
    items: [
      {
        image: spiti,
      },
      {
        name: "Nati Dance",
        image: nati,
      },
    ],
  },
  {
    state: "Jharkhand",
    items: [
      {
        image: pareshnath,
      },
      {
        name: "Chhau Dance",
        image: chhau,
      },
    ],
  },
  {
    state: "Karnataka",
    items: [
      {
        image: mysorePalace,
      },
      {
        name: "Yakshagana",
        image: yakshagana,
      },
    ],
  },
  {
    state: "Kerala",
    items: [
      {
        image: alleppeyImage,
      },
      {
        name: "Kathakali",
        image: kathakali,
      },
    ],
  },

  {
    state: "Madhya Pradesh",
    items: [
      {
        image: khajuraho,
      },
      {
        name: "Matki Dance",
        image: matkiDance,
      },
    ],
  },
  {
    state: "Maharashtra",
    items: [
      {
        image: gatewayIndia,
      },
      {
        name: "Lavani Dance",
        image: lavani,
      },
    ],
  },
  {
    state: "Manipur",
    items: [
      {
        image: loktakLake,
      },
      {
        name: "Ras Lila",
        image: rasLila,
      },
    ],
  },
  {
    state: "Meghalaya",
    items: [
      {
        image: livingRootBridge,
      },
      {
        name: "Wangala Dance",
        image: wangala,
      },
    ],
  },
  {
    state: "Mizoram",
    items: [
      {
        image: solomon,
      },
      {
        name: "Cheraw Dance (Bamboo Dance)",
        image: cheraw,
      },
    ],
  },
  {
    state: "Nagaland",
    items: [
      {
        image: dzukouValley,
      },
      {
        name: "Naga War Dance",
        image: nagaWarDance,
      },
    ],
  },
  {
    state: "Punjab",
    items: [
      {
        image: goldenTemple,
      },
      {
        name: "Bhangra Dance",
        image: bhangra,
      },
    ],
  },
  {
    state: "Rajasthan",
    items: [
      {
        image: hawaMahal,
      },
      {
        name: "Ghoomar Dance",
        image: ghoomar,
      },
    ],
  },
  {
    state: "Sikkim",
    items: [
      {
        image: pulak,
      },
      {
        name: "Cham Dance",
        image: chamDance,
      },
    ],
  },
  {
    state: "Tamil Nadu",
    items: [
      {
        image: meenakshi,
      },
      {
        name: "Bharatanatyam",
        image: bharatanatyam,
      },
    ],
  },
  {
    state: "Telangana",
    items: [
      {
        image: charminar,
      },
      {
        name: "Perini Sivatandavam",
        image: perini,
      },
    ],
  },

  {
    state: "Tripura",
    items: [
      {
        image: tripuraTemple,
      },
      {
        name: "Hojagiri Dance",
        image: hojagiri,
      },
    ],
  },
  {
    state: "Uttar Pradesh",
    items: [
      {
        image: tajMahal,
      },
      {
        name: "Kathak Dance",
        image: kathak,
      },
    ],
  },
  {
    state: "Uttarakhand",
    items: [
      {
        image: kedarnath,
      },
      {
        name: "Pandav Nritya",
        image: pandavNritya,
      },
    ],
  },
  {
    state: "West Bengal",
    items: [
      {
        image: victoriaMemorial,
      },
      {
        name: "Chhau Dance (Purulia)",
        image: puruliaChhau,
      },
    ],
  },
];

/// 🎞️ Individual Column Component
const StateColumn = ({ statesGroup }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [animation, setAnimation] = useState("zoom-in");

  const state = statesGroup[currentIndex];
  const currentItem = state.items[itemIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (itemIndex === 0) {
        setAnimation("zoom-out");
        setTimeout(() => {
          setItemIndex(1);
          setAnimation("zoom-in");
        }, 500);
      } else {
        setAnimation("slide-out");
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % statesGroup.length);
          setItemIndex(0);
          setAnimation("slide-in");
        }, 700);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [itemIndex, currentIndex, statesGroup]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-[0_8px_25px_rgba(0,0,0,0.2)] transform transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_35px_rgba(255,165,0,0.4)]"
      style={{ aspectRatio: "5/3" }}
    >
      <img
        src={currentItem.image}
        alt={currentItem.name || state.state}
        className={`w-full h-52 object-cover transition-all duration-700 ease-in-out ${animation}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white">
        {itemIndex === 0 && (
          <h3 className="text-lg sm:text-xl font-bold text-purple-400 drop-shadow-md">
            {state.state}
          </h3>
        )}
        <h4 className="text-base sm:text-lg font-semibold mt-1">
          {currentItem.name}
        </h4>
      </div>
    </div>
  );
};

/// 🌟 Main Slider
const FamousIndiaSlider = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width for mobile vs desktop
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Divide into 4 groups of 7 for desktop
  const groupedStates = [];
  const groupSize = 7;
  for (let i = 0; i < states.length; i += groupSize) {
    groupedStates.push(states.slice(i, i + groupSize));
  }

  // Mobile: show only one div that cycles through all 28
  const displayGroups = isMobile ? [states] : groupedStates;

  return (
    <div className="w-full pt-8">
      {/* className="align_center navbar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }} */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        // viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="text-center text-[#001f3f] text-4xl sm:text-4xl font-extrabold mb-2 tracking-wide"
      >
        India’s Timeless Traditions, Eternal Beauty
      </motion.h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Celebrate India’s vibrant soul, where temples and dances reveal each
        state’s legacy.
      </p>

      <div
        className={`
          grid
          ${
            isMobile
              ? "grid-cols-1"
              : "xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
          }
          gap-4
          px-4 sm:px-6 lg:px-12
          justify-center
        `}
      >
        {/* Only one StateColumn on mobile */}
        {displayGroups.map((group, index) =>
          isMobile && index > 0 ? null : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: index * 0.75, ease: "easeInOut" }}
            >
              <StateColumn key={index} statesGroup={group} />
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default FamousIndiaSlider;
