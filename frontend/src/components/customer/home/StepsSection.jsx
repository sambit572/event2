import React, { useEffect, useRef, useState } from "react";
import searchImg from "/category/search.png";
import compareImg from "/category/price-comparison.png";
import negotiateImg from "/category/negotiation.png";
import bookingImg from "/category/booking.png";
import enjoyImg from "/category/family.png";

const steps = [
  {
    title: "Search Services",
    text: "Browse event services by category & budget.",
    image: searchImg,
  },
  {
    title: "Compare Options",
    text: "View vendor profiles, pricing & reviews.",
    image: compareImg,
  },
  {
    title: "Live Negotiate",
    text: "Call & finalize details directly with vendors.",
    image: negotiateImg,
  },
  {
    title: "Secure Booking",
    text: "Confirm with safe online payment.",
    image: bookingImg,
  },
  {
    title: "Enjoy Your Event",
    text: "Enjoy the moment, leave the hassle to us.",
    image: enjoyImg,
  },
];

const StepsSection = () => {
  const headingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // We only observe one element, so we can grab the first entry.
        const entry = entries[0];
        // Set visibility based on whether the element is intersecting or not.
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const currentHeadingRef = headingRef.current;

    if (currentHeadingRef) {
      observer.observe(currentHeadingRef);
    }

    // Cleanup function to unobserve when the component unmounts.
    return () => {
      if (currentHeadingRef) {
        observer.unobserve(currentHeadingRef);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <div className="mt-3 py-10 px-4 rounded-md ml-5 mr-5 sm:px-6 lg:px-12 mb-5 sm:mb-12 md:mb-10 lg:mb-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          ref={headingRef}
          className={`relative inline-block text-xl mb-10 sm:text-2xl md:text-5xl font-semibold text-[#001f3f]
          after:content-[''] after:block after:w-0 after:h-[4px]
          after:bg-gradient-to-r after:from-[#001f3f] after:via-yellow-500 after:to-[#001f3f] 
          after:rounded-full
          after:transition-all after:duration-[1000ms] after:ease-in-out after:mt-2 after:mx-auto
          ${
            isVisible ? "after:w-3/4" : "after:w-0"
          }`} /* This line is the key change */
        >
          How EventsBridge Works
        </h2>
        <p className="mt-1 sm:text-base md:text-md font-normal text-[#001f3f] max-w-4xl lg:max-w-6xl mx-auto px-2">
          From Search to Celebration – We’ve Got You Covered. Discover trusted
          vendors, compare options, negotiate directly, and book securely all in
          one place, so you can enjoy your event stress-free.
        </p>
      </div>

      {/* Steps Grid */}
      <div
        className="
          grid 
          grid-cols-2 gap-y-10 gap-x-6 justify-items-center
          [@media(min-width:855px)]:grid-cols-5 [@media(min-width:855px)]:gap-x-12 [@media(min-width:855px)]:gap-y-0
        "
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={`
              flex flex-col items-center text-center border border-gray-900
              w-40 sm:w-48 md:w-52 lg:w-56 px-4 py-6
              bg-yellow-50 rounded-2xl shadow-md 
              hover:shadow-2xl transition-shadow duration-300
              ${
                index === 4
                  ? "col-span-2 justify-self-center [@media(min-width:855px)]:col-span-1"
                  : ""
              }
            `}
          >
            {/* Image instead of icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full 
                            bg-[#e8eff7] shadow-md mb-4 overflow-hidden"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-[#001f3f] font-semibold text-sm sm:text-base md:text-lg mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-[#001f3f] text-sm sm:text-base leading-relaxed max-w-[240px]">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsSection;
