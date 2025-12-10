import React, { useEffect, useState } from "react";
import comingSoon from "../../../assets/home/bannerImages/coming_soon.webp";
import mediumbanner from "../../../assets/home/bannerImages/mediumbanner.webp";
import xxmedium from "../../../assets/home/bannerImages/xxmedium.webp";
import smallbanner from "../../../assets/home/bannerImages/smallbanner.webp";
import newComingSoon from "../../../../public/coomingSoon/newComingSoon.webp";
import emiBanner from "../../../assets/home/bannerImages/emi banner.webp";

const AddsBanner = () => {
  const [showEmi, setShowEmi] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowEmi((prev) => !prev);
    }, 6000); // every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mt-[40px] h-60 sm:h-64 md:h-72 lg:h-80 xl:h-94 overflow-hidden rounded-lg bg-black">
      <style>
        {`
          /* Both animations overlap slightly to remove white gap */
          @keyframes zoomFadeOut {
            0% { transform: scale(1); opacity: 1; }
            40% { transform: scale(1.08); opacity: 1; }
            60% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0; }
          }

          @keyframes zoomFadeIn {
            0% { transform: scale(1.05); opacity: 0; }
            20% { transform: scale(1.06); opacity: 0.7; }
            40% { transform: scale(1.08); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          .animate-comingSoon {
            animation: zoomFadeOut 6s ease-in-out infinite;
          }

          .animate-emi {
            animation: zoomFadeIn 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* ===================== Coming Soon Banner ===================== */}
      <div
        className={`absolute inset-0 ${
          showEmi ? "opacity-0" : "opacity-100 animate-comingSoon"
        } transition-opacity duration-700`}
      >
        <picture>
          <source srcSet={comingSoon} media="(min-width: 1111px)" />
          <source srcSet={mediumbanner} media="(min-width: 768px)" />
          <source srcSet={xxmedium} media="(min-width: 640px)" />
          <source srcSet={smallbanner} media="(min-width: 500px)" />
          <img
            decoding="async"
            src={newComingSoon}
            alt="Coming Soon"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-fill rounded-lg"
          />
        </picture>
      </div>

      {/* ===================== EMI Banner ===================== */}
      <div
        className={`absolute inset-0 ${
          showEmi ? "opacity-100 animate-emi" : "opacity-0"
        } transition-opacity duration-700`}
      >
        <img
          decoding="async"
          src={emiBanner}
          alt="EMI Banner"
          className="w-full h-full object-fill rounded-lg"
        />
      </div>
    </div>
  );
};

export default AddsBanner;
