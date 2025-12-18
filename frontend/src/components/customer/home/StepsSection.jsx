import React, { useEffect, useRef, useState } from "react";
import search40 from "/category/search-40.webp";
import search70 from "/category/search-64.webp";

import compare40 from "/category/price-comparison-40.webp";
import compare70 from "/category/price-comparison-64.webp";

import negotiate40 from "/category/negotiation-40.webp";
import negotiate70 from "/category/negotiation-64.webp";

import booking40 from "/category/booking-40.webp";
import booking70 from "/category/booking-64.webp";

import pay40 from "/category/pay_now-removebg-preview-40.webp";
import pay70 from "/category/pay_now-removebg-preview-64.webp";

import enjoy40 from "/category/family-40.webp";
import enjoy70 from "/category/family-64.webp";

const steps = [
  {
    title: "Search Services",
    text: "Find event services easily by category and budget.",
    src: search40,
    srcSet: `${search70} 70w, ${search40} 40w`,
  },
  {
    title: "Compare Options",
    text: "Check vendor profiles, pricing details, and reviews.",
    src: compare40,
    srcSet: `${compare70} 70w, ${compare40} 40w`,
  },
  {
    title: "Live Negotiation",
    text: "Connect directly with vendors to finalize all details.",
    src: negotiate40,
    srcSet: `${negotiate70} 70w, ${negotiate40} 40w`,
  },
  {
    title: "Pay Now / Pay with EMI",
    text: "Choose flexible payment options and pay instantly or with easy EMIs.",
    src: pay40,
    srcSet: `${pay70} 70w, ${pay40} 40w`,
  },
  {
    title: "Secure Booking",
    text: "Complete your booking safely with secure online payment.",
    src: booking40,
    srcSet: `${booking70} 70w, ${booking40} 40w`,
  },
  {
    title: "Enjoy Your Event",
    text: "Relax and celebrate while we handle all the hassle.",
    src: enjoy40,
    srcSet: `${enjoy70} 70w, ${enjoy40} 40w`,
  },
];

const StepsSection = () => {
  const headingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const currentHeadingRef = headingRef.current;
    if (currentHeadingRef) observer.observe(currentHeadingRef);

    return () => {
      if (currentHeadingRef) observer.unobserve(currentHeadingRef);
    };
  }, []);

  return (
    <div className="mt-3 py-5 px-4 rounded-md ml-5 mr-5 sm:px-6 lg:px-2 mb-5 sm:mb-12 md:mb-10 lg:mb-1">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          ref={headingRef}
          className={`relative inline-block text-xl mb-4 sm:text-2xl md:text-5xl font-semibold text-[#001f3f]
            after:content-[''] after:block after:w-0 after:h-[4px]
            after:bg-gradient-to-r after:from-[#001f3f] after:via-yellow-500 after:to-[#001f3f] 
            after:rounded-full
            after:transition-all after:duration-[1000ms] after:ease-in-out after:mt-2 after:mx-auto
            ${isVisible ? "after:w-3/4" : "after:w-0"}`}
        >
          𝐇𝐨𝐰 𝐄𝐯𝐞𝐧𝐭𝐬𝐁𝐫𝐢𝐝𝐠𝐞 𝐖𝐨𝐫𝐤𝐬
        </h2>
        <p className="sm:text-base md:text-md font-normal text-[#001f3f] max-w-4xl lg:max-w-6xl mx-auto px-2">
          From Search to Celebration – We’ve Got You Covered. Discover trusted
          vendors, compare options, negotiate directly, and book securely all in
          one place, so you can enjoy your event stress-free.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start text-center border border-gray-400
        bg-yellow-50 rounded-2xl shadow-md 
        hover:shadow-2xl transition-shadow duration-300
        sm:w-[210px] sm:h-[220px] md:w-[210px] md:h-[270px] lg:w-[200px] lg:h-[270px]
        p-4"
          >
            {/* Image */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full 
                    bg-[#e8eff7] shadow-md mb-4 overflow-hidden"
            >
              <img
                src={step.src}
                srcSet={step.srcSet}
                sizes="(max-width: 768px) 70px, 40px"
                alt={step.title}
                className="w-10 h-10 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Title */}
            <h3 className="text-[#001f3f] font-semibold text-sm sm:text-base md:text-lg mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-[#001f3f] text-xs sm:text-sm md:text-base leading-relaxed px-2">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsSection;
