import React from "react";
import comingSoon from "../../../assets/home/bannerImages/coming_soon.png";
import mediumbanner from "../../../assets/home/bannerImages/mediumbanner.png";
import xxmedium from "../../../assets/home/bannerImages/xxmedium.png";
import smallbanner from "../../../assets/home/bannerImages/smallbanner.png";
import newComingSoon from "../../../../public/coomingSoon/newComingSoon.webp";

const AddsBanner = () => {
  return (
    <div className="w-full mt-[40px] h-60 sm:h-70 md:h-80 lg:h-90 xl:h-full">
      <picture>
        {/* Large screens (1024px and up) */}
        <source srcSet={comingSoon} media="(min-width: 1111px)" />

        {/* Medium screens (768px to 1023px) */}
        <source srcSet={mediumbanner} media="(min-width: 768px)" />

        {/* Small screens (640px to 767px) */}
        <source srcSet={xxmedium} media="(min-width: 640px)" />

        {/* Small screens (640px to 767px) */}
        <source srcSet={smallbanner} media="(min-width: 500px)" />

        {/* Mobile (less than 640px) */}
        <img
          src={newComingSoon}
          alt="Responsive"
          loading="lazy"          // ✅ Lazy load
          decoding="async"       // ✅ Asynchronous decoding
          className="w-full h-full object-fill rounded-lg"
        />
      </picture>
    </div>
  );
};

export default AddsBanner;
