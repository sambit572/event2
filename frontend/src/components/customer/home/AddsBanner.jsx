import React, { useEffect, useState } from "react";
import newadd from "../../../assets/home/bannerImages/newadd.webp";
// import mediumbanner from "../../../assets/home/bannerImages/mediumbanner.webp";
// import xxmedium from "../../../assets/home/bannerImages/xxmedium.webp";
import newaddx from "../../../assets/home/bannerImages/newaddx.webp";
// import newComingSoon from "/coomingSoon/newComingSoon.webp";
// import emiBanner from "../../../assets/home/bannerImages/emi banner.webp";

const AddsBanner = () => {
  return (
    <div className="relative w-full mt-4 md:mt-8 overflow-hidden rounded-lg ">
      <div>
        <picture>
          {/* <source srcSet={comingSoon} media="(min-width: 1111px)" /> */}
          <source srcSet={newaddx} media="(min-width: 768px)" />
          <source srcSet={newadd} media="(min-width: 640px)" />
          {/* <source srcSet={smallbanner} media="(min-width: 500px)" /> */}
          <img
            decoding="async"
            loading="lazy"
            src={newaddx}
            alt="Coming Soon"
            className="w-full h-full object-fill rounded-lg"
          />
        </picture>
      </div>
    </div>
  );
};

export default AddsBanner;
