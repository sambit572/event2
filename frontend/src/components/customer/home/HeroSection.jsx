import { useEffect } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoStarHalfOutline } from "react-icons/io5";

import { VscStarFull } from "react-icons/vsc";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function HeroSection() {
  const scrollY = useMotionValue(0);

  // Scale effect: shrink slightly as user scrolls down
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);

  // Optional: tilt effect for more 3D feel
  const rotateX = useTransform(scrollY, [0, 500], [0, 5]);
  const rotateY = useTransform(scrollY, [0, 500], [0, 0]); // slight Y tilt if desired

  // Optional: move upward slightly for more depth
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return (
    <div className="perspective-1000">
      <motion.div
        style={{ scale, rotateX, rotateY, y }}
        className="w-full flex flex-col items-center px-2 pt-2 bg-white overflow-hidden"
      >
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-snug sm:leading-tight max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto pt-10">
          Celebrate Without Limits
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-center text-base sm:text-lg md:text-xl mt-1 sm:mt-2 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto px-4">
          Lets book top event vendors without budget pressure — discover,
          compare, negotiate, and pay later with EMIs.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-4 flex-wrap justify-center px-4">
          <a
            href="#categories"
            className="bg-black hover:border-black hover:border-2 hover:bg-zinc-200 hover:text-black transition-all duration-300 ease-in-out font-semibold text-white px-5 sm:px-6 py-1.5 sm:py-3 rounded-3xl text-xs sm:text-base md:text-lg"
          >
            Book Now
          </a>
          <button className="border-2 border-black px-5 font-semibold sm:px-6 py-1.5 sm:py-3 rounded-3xl text-xs sm:text-base md:text-lg">
            Pay With EMI
          </button>
        </div>

        <div className="relative w-full mt-8 flex justify-center items-center  overflow-hidden bg-white">
          {/* ===== Background Circle Layers ===== */}
          <div className="absolute flex  justify-center items-center">
            {/* Large Circle */}
            <div className="absolute w-[1000px] top-[-140px] h-[1000px] rounded-full   bg-gradient-to-b border-2 border-lime-200 to-transparent opacity-60"></div>
            {/* Medium Circle */}
            <div className="absolute w-[800px]  top-[-70px] h-[800px] rounded-full   border-[#86fde8] bg-gradient-to-b border-2 to-transparent opacity-60"></div>

            {/* Small Circle */}
            <div
              className="absolute w-[600px] top-[-10px] h-[600px] rounded-full bg-gradient-to-b from-voilet32 to-transparent
 opacity-60"
            ></div>
          </div>
          {/* ===== Phone Frame ===== */}
          <div className="relative inline-block">
            {/* LEFT SIDE BUTTONS (RESPONSIVE) */}
            {/* Extra button */}
            <div
              className="
      absolute left-[-2px] top-[20%]
      w-1 h-4                      /* mobile */
      sm:w-2 sm:h-6                 /* tablet */
      md:w-2 md:h-8                 /* medium */
      lg:w-2 lg:h-10                 /* desktop */
      bg-[#5D465B]  shadow-md
    "
            ></div>
            {/* Volume Up */}
            <div
              className="
      absolute left-[-2px] top-[30%]
      w-1 h-6                      /* mobile */
      sm:w-2 sm:h-8                 /* tablet */
      md:w-2 md:h-10                 /* medium */
      lg:w-2 lg:h-12                 /* desktop */
      bg-[#5D465B]  shadow-md
    "
            ></div>

            {/* Volume Down */}
            <div
              className="
      absolute left-[-2px] top-[40%]
      w-1 h-6
      sm:w-2 sm:h-8
      md:w-2 md:h-10
      lg:w-2 lg:h-12
      bg-[#5D465B]  shadow-md
    "
            ></div>

            {/* RIGHT SIDE POWER BUTTON (RESPONSIVE) */}
            <div
              className="
      absolute right-[-2px] top-[30%]
      w-1 h-10                      /* mobile */
      sm:w-2 sm:h-16                  /* small */
      md:w-2 md:h-20                  /* medium */
      lg:w-2 lg:h-24                /* desktop */
      bg-[#5D465B]   shadow-md
    "
            ></div>

            {/* PHONE FRAME (UNCHANGED, RESPONSIVE ALREADY) */}
            <div
              className="
      relative z-20 border-[2px] 
      w-36 h-65 rounded-t-[20px]
      sm:w-64 sm:h-[500px] sm:rounded-t-[20px] sm:border-[3px] sm:border-b-0
      md:w-80 md:h-[600px] md:rounded-t-[20px] md:border-[4px] md:border-b-0
      lg:w-[320px] lg:h-[600px] lg:rounded-t-[25px] lg:border-[5px] lg:border-b-0
      overflow-hidden
       border-b-0 border-[#5D465B] 
      shadow-xl bg-gray-[#5D465B] 
    "
            >
              {/* NOTCH */}
              {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black rounded-b-2xl z-30"></div>
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full z-30"></div> */}
              {/* <div className="absolute top-1 left-[60%] w-2 h-2 bg-gray-700 rounded-full z-30"></div> */}

              {/* IMAGE */}
              <div
                className="border-[4px] 
    rounded-t-[15px] border-b-0 border-black
      shadow-xl bg-black
        sm:rounded-t-[15px] sm:border-[5px] sm:border-b-0
      md:rounded-t-[20spx] md:border-[6px] md:border-b-0
      lg:rounded-t-[20px] lg:border-[8px] lg:border-b-0"
              >
                <style>
                  {`
          .lcp-wrapper {
            width: 100%;
            aspect-ratio: 9 / 20;
          }

          .lcp-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            animation: fadeIn 0.6s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
                </style>

                <picture className="lcp-wrapper">
                  {/* 📱 Mobile */}
                  <source
                    media="(max-width: 640px)"
                    srcSet="
            /assets/home/herosection/heroimage4-480-240.webp 240w,
            /assets/home/herosection/heroimage4-480-320.webp 320w
          "
                    sizes="100vw"
                  />

                  {/* 💻 Tablet / Desktop */}
                  <source
                    media="(min-width: 641px)"
                    srcSet="
            /assets/home/herosection/heroimage4-480-360.webp 360w,
            /assets/home/herosection/heroimage4-480.webp 480w
          "
                    sizes="100vw"
                  />

                  <img
                    src="/assets/home/herosection/heroimage4-360.webp"
                    alt="Preview"
                    width="360"
                    height="800"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    className="lcp-img"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* ===== Floating Cards (Outside Circle) ===== */}

          {/* Top Left Card */}
          <motion.div
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? -20
                  : -100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="
    absolute z-10 border-2 border-blue-700 shadow-2xl rounded-2xl p-1
    w-[90px] top-8 left-0              /* MOBILE DEFAULT */
sm-mid:left-8 sm-mid:w-30
    sm:w-40 sm:top-12 sm:left-2 sm:border-[3px]     /* SMALL SCREENS (480px–640px) */
    md:w-48 md:top-16 md:left-4     /* MID SCREENS (768px–1024px) */

    lg:w-52 lg:top-20 lg:left-18  /* DESKTOP (YOUR ORIGINAL VALUES) */
  "
          >
            {/* <img
              decoding="async"
              loading="lazy" // ✅ critical for FCP
              src="/assets/home/herosection/teamwork.webp"
              srcSet="
    /assets/home/herosection/teamwork.webp 40w,
    /assets/home/herosection/teamwork.webp 80w,
    /assets/home/herosection/teamwork.webp 160w,
    /assets/home/herosection/teamwork.webp 320w
  "
              sizes="
    (max-width: 640px) 40px,
    (max-width: 1024px) 144px,
    176px
  "
              width="176"
              height="176"
              alt="Preview"
              className="w-full  h-20 sm:h-36 md:h-40 lg:h-44 rounded-xl"
            /> */}

            {/* CENTERED TEXT */}
            <div className="flex shadow-5xl shadow-black/40 flex-col px-2">
              <p
                className="font-extrabold  sm:font-extrabold text-2xl sm:text-5xl drop-shadow-lg"
                style={{
                  WebkitTextStroke: "2px white",
                  color: "black",
                }}
              >
                100+
              </p>

              <p
                className="text-[7px] sm:text-end sm:text-sm sm:font-semibold drop-shadow shadow-black/40"
                style={{
                  // WebkitTextStroke: "1px white",
                  color: "black",
                }}
              >
                Verified Vendors
              </p>
            </div>

            {/* BOTTOM LABEL */}
            <div className=" bg-yellow-300 p-0.5 sm:m-1 sm:p-1 md-p-2 rounded-lg text-center sm:text-sm">
              <p className="text-[6px] sm:text-xs md:text-xs">
                Find the best vendor at the lowest price
              </p>
            </div>
          </motion.div>

          {/* Middle Left Card */}
          <motion.div
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? -20
                  : -100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="
    absolute z-50 flex space-x-1 bg-stone-800 text-green92 shadow-xl
    rounded-2xl py-0 px-2

    text-sm bottom-36 left-5           /* MOBILE: 360px–480px */
sm-mid:left-8 
    sm:text-2xl sm:left-6 sm:bottom-60 /* SMALL SCREENS: 480–640px */

    md:text-3xl md:left-12 md:bottom-72 /* MEDIUM: 768–1024px */

    lg:text-3xl lg:left-44 lg:bottom-76 /* DESKTOP: YOUR ORIGINAL VALUES */

    w-20 sm:w-36 md:w-40 lg:w-40
  "
          >
            <VscStarFull />
            <VscStarFull />
            <VscStarFull />
            <VscStarFull />

            <IoStarHalfOutline />
          </motion.div>

          {/*bottom Left Card */}
          <motion.div
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? -20
                  : -100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="
    absolute z-30 bg-purple32 shadow-xl rounded-2xl py-1 px-2
    w-[90px] left-0 bottom-4            /* MOBILE (360px–480px) */
sm-mid:w-28 sm-mid:h-25 sm-mid:left-8
    sm:w-40 sm:bottom-16   /* SMALL SCREENS */

    md:w-48 md:left-4 md:bottom-16 /* MEDIUM (768px–1024px) */

    lg:w-[250px] lg:left-8 lg:bottom-16 /* DESKTOP (your original) */
  "
          >
            <div className="font-bold text-xl sm:text-3xl">
              <p className="text-gray-700 text-sm font-semibold sm:text-xl">
                Up to
              </p>
              80%
            </div>

            <p className="text-gray-700 text-sm font-semibold sm:text-xl">
              Pay With EMI
            </p>
          </motion.div>

          {/* Top Right Card */}
          <motion.div
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 20
                  : 100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="
    absolute z-10 bg-aceeff shadow-xl rounded-2xl px-2 py-1
    w-[90px]  h-204 top-8 right-0                        /* MOBILE (360px–480px) */
sm-mid:right-4 sm-mid:w-28
    sm:w-40 sm:h-36 sm:top-16  sm:py-2 sm:right-4               /* SMALL SCREENS (480–640px) */

    md:w-52 md:top-16 md:right-2             /* MEDIUM (768–1024px) */

    lg:w-[320px] lg:p-4 lg:top-12 lg:right-2 lg:h-40 lg:pr-0  /* DESKTOP (your original position & size) */
  "
          >
            <h2 className="font-bold text-xl sm:text-6xl">Join</h2>
            <p className="text-gray-800 text-sm font-semibold sm:text-xl">
              As A Vendor
            </p>
            <p className="text-gray-800 font-semibold text-[8px] sm:text-sm">
              With zero cost
            </p>

            <FaArrowTrendUp
              className="
    absolute text-stone-800 opacity-20
    w-8 h-10 scale-[2]
    lg:w-32 lg:h-20
    lg:scale-[1.6]       /* <-- Increase this value */
    right-8 bottom-6
    z-20 pointer-events-none
  "
            />
          </motion.div>

          {/* Bottom Right Card */}
          <motion.div
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 20
                  : 100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="
    absolute z-10 bg-yellow-50 shadow-xl rounded-2xl border-[1px] border-amber-400 p-0
    w-[90px]  bottom-4 right-0              /* MOBILE (360–480px) */
sm-mid:right-2 sm-mid:w-28
    sm:w-40 sm:bottom-16 sm:right-0      /* SMALL SCREENS (480–640px) */

    md:w-44 md:bottom-16 md:right-4 md:h-40   /* MEDIUM/TABLET (768–1024px) */

    lg:w-[240px] lg:h-48 lg:bottom-20 lg:right-6    /* DESKTOP — YOUR ORIGINAL VALUES */
  "
          >
            <div className="flex mt-1 py-1 items-center m-1 rounded-xl sm:font-bold justify-center flex-wrap bg-[#FFAA00]">
              <h1 className="text-[6px] text-black font-bold text-center sm:text-xs lg:text-lg">
                Live-Price Negotiation
              </h1>
              {/* <span className="bg-red-600 text-white text-xs sm:text-sm px-2 py-[2px] rounded-lg">
                1.5k
              </span>
              <span>❤️</span>

              <span className=" text-xs">Book Now</span> */}
            </div>
            <img
              decoding="async"
              loading="lazy" // ✅ very important
              src="/assets/home/herosection/negotiation.webp"
              srcSet="
    /assets/home/herosection/negotiation.webp 360w,
    /assets/home/herosection/negotiation.webp 480w,
    /assets/home/herosection/negotiation.webp 180w,
  "
              sizes="
    (max-width: 640px) 90vw,
    (max-width: 1024px) 60vw,
    662px
  "
              width="662"
              height="364"
              alt="Preview"
              className="w-full object-contain h-16 sm:h-32 md:h-30 lg:h-36 rounded-xl"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}