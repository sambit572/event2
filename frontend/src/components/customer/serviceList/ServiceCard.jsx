import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// ✅ NEW: Import FaYoutube for the UI
import { FaChevronLeft, FaChevronRight, FaYoutube } from "react-icons/fa";
import ServiceDescription from "./ServiceDescription";

// ✅ NEW: Helper function to identify YouTube links and get the video ID
const getYouTubeID = (url) => {
  if (typeof url !== "string") return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const ServiceCard = ({ service, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  if (!service) return null;

  // ✅ MODIFIED: Use a generic name `media` for the array of URLs
  const media = service.serviceImage || [];
  const serviceId = service._id || service.id;
  const isVendorAvailable = service.available !== false;

  const handleCardClick = () => {
    navigate(`/service/${categoryId}/${serviceId}`);
  };

  const nextMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const currentMediaUrl = media[currentIndex];
  const isVideo = getYouTubeID(currentMediaUrl);

  return (
    <div
      className=" flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white transition-shadow duration-300 ease-in-out md:flex-row"
      onClick={handleCardClick}
    >
      <div
        className="relative overflow-hidden rounded-lg 
             w-full md:w-[400px] lg:w-[480px] 
             h-[200px] lg:h-[290px] 
             bg-gray-100 flex-shrink-0 md:sticky"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!touchStart) return;
          const touchEnd = e.changedTouches[0].clientX;
          const diff = touchStart - touchEnd;
          if (diff > 50) nextImage(e); // swipe left
          if (diff < -50) prevImage(e); // swipe right
          setTouchStart(null);
        }}
      >
        <span className="absolute top-[10px] left-[10px] z-[3] bg-white/30 backdrop-blur-[30px] text-white text-[11px] font-bold uppercase tracking-[0.8px] px-[7px] py-[3px] rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.3)] border border-white/30 [text-shadow:1px_1px_2px_rgba(0,0,0,0.6),-1px_-1px_1px_rgba(255,255,255,0.4)]">
          EventsBridge
        </span>

        <div className="relative w-full h-full">
          {Array.isArray(media) && media.length > 0 ? (
            <>
              {/* ✅ MODIFIED: Conditional rendering for video or image */}
              {isVideo ? (
                <iframe
                  key={currentIndex} // Add key to force re-render on change
                  src={`https://www.youtube.com/embed/${isVideo}?autoplay=1&mute=1&loop=1&playlist=${isVideo}&rel=0`}
                  className={`absolute top-0 left-0 w-full h-full object-cover object-center ${
                    !isVendorAvailable ? "grayscale brightness-50" : ""
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  key={currentIndex}
                  src={currentMediaUrl}
                  alt={`slide-${currentIndex}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                    !isVendorAvailable ? "grayscale brightness-50" : ""
                  }`}
                />
              )}

              {/* Overlay if vendor not available */}
              {!isVendorAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="rounded-lg bg-red-600 px-4 py-5 text-center shadow-lg">
                    <p className="text-sm font-bold text-white">
                      OUT OF SERVICE
                    </p>
                    <p className="text-xs text-red-100">
                      Oops! We’re on a quick break, back soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Left Arrow */}
              {hovered && media.length > 1 && (
                <button
                  onClick={prevMedia}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <FaChevronLeft />
                </button>
              )}

              {/* Right Arrow */}
              {hovered && media.length > 1 && (
                <button
                  onClick={nextMedia}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <FaChevronRight />
                </button>
              )}

              {/* ✅ MODIFIED: Dots now show YouTube icon for videos */}
              {media.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {media.map((mediaUrl, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-3 w-3 rounded-full cursor-pointer flex items-center justify-center ${
                        idx === currentIndex ? "bg-white" : "bg-gray-400"
                      }`}
                    >
                      {getYouTubeID(mediaUrl) && (
                        <FaYoutube className="text-red-500 text-xs" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
              {!isVendorAvailable ? (
                <div className="text-center">
                  <p className="text-sm font-bold text-red-600">
                    OUT OF SERVICE
                  </p>
                  <p className="text-xs text-gray-600">No Image Available</p>
                </div>
              ) : (
                "No Image Available"
              )}
            </div>
          )}
        </div>

        {/* ✅ MODIFIED: Side thumbnail strip now handles videos */}
        {Array.isArray(media) && media.length > 1 && (
          <div className="flex flex-col gap-0.5 bg-gray-200 p-1.5">
            {media.map((thumbUrl, idx) => (
              <div
                key={idx}
                className={`relative h-[50px] w-[85px] cursor-pointer rounded border-2 object-cover transition-all duration-300 ${
                  idx === currentIndex
                    ? "border-orange-500"
                    : "border-transparent"
                } ${!isVendorAvailable ? "grayscale brightness-75" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              >
                {getYouTubeID(thumbUrl) ? (
                  <div className="w-full h-full bg-black flex items-center justify-center rounded">
                    <FaYoutube className="text-red-500 text-3xl" />
                  </div>
                ) : (
                  <img
                    src={thumbUrl}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-grow">
        <ServiceDescription
          service={{ ...service, categoryId: categoryId }}
          onSwitchToLogin={onSwitchToLogin}
        />
      </div>
    </div>
  );
};

export default ServiceCard;
