import React, { useEffect, useRef, useState } from "react";
import "./ImageSlider.css";
import { motion } from "motion/react";

export default function ImageSlider({ images }) {
  const [selectedImage, setSelectedImage] = React.useState(images[0]?.desktop);
  const containerRef = useRef(null);

  React.useEffect(() => {
    const container = document.querySelector(".scroll-container");

    let scrollInterval = setInterval(() => {
      if (container) {
        container.scrollLeft += 1;

        // Reset scroll to left for infinite scroll effect
        if (
          container.scrollLeft + container.offsetWidth >=
          container.scrollWidth - 1
        ) {
          container.scrollLeft = 0;
        }
      }
    }, 30); // Adjust speed if needed

    return () => clearInterval(scrollInterval);
  }, []);
  return (
    <div
      className="relative  h-[450px] sm:h-[500px] md:h-[600px] lg:h-[600px] max-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `url(${selectedImage})`,
      }}
    >
      <div className="backdrop-blur-sm  bg-black/30  h-full  flex items-center justify-center">
        <div className="pl-10 pr-0 py-10  max-w-7xl w-full">
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              // viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-6xl font-extrabold mb-6 text-white drop-shadow-lg tracking-wide">
                EventsBridge
              </h1>
              <p className="text-sm max-w-xl font-bold text-white-900 drop-shadow-md leading-relaxed">
                Connecting Event Seekers with the Best Vendors. Plan, Book, and
                Celebrate — All in One Place.
              </p>

              <a
                href="#categories"
                className="inline-block mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all"
              >
                Explore Now
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              // viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              ref={containerRef}
              className="scroll-container flex items-center space-x-5 overflow-x-auto no-scrollbar"
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="rounded-2xl min-w-[300px] h-[200px] sm:min-w-[330px] sm:h-[230px] md:min-w-[400px] md:h-[280px] overflow-hidden shadow-xl hover:scale-105 transition-transform bg-white"
                >
                  <img
                    src={img.desktop}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(img.desktop)}
                  />
                </div>
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
