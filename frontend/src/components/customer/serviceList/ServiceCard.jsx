import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceDescription from "./ServiceDescription";

const ServiceCard = ({ service, onSwitchToLogin }) => {
  const navigate = useNavigate();
  if (!service) return null;
  const isAvailable = service.available;
  const { categoryId } = useParams();
  const images = service.serviceImage || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const serviceId = service._id || service.id;

  // Check if vendor is available - based on your dashboard structure
  const isVendorAvailable = service.available !== false;

  // This function will handle the navigation when the card is clicked
  const handleCardClick = () => {
    navigate(`/service/${categoryId}/${serviceId}`);
  };

  return (
    // Added onClick handler and cursor-pointer here
    <div
      className="mt-5 flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 ease-in-out hover:shadow-lg md:flex-row"
      onClick={handleCardClick}
    >
      <div className="flex w-full flex-shrink-0 bg-gray-200 md:w-[45%]">
        {/* Main image (on the left) */}
        <div className="relative h-64 w-full">
          {Array.isArray(images) && images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt="Service preview"
                className={`h-full w-full object-cover transition-all duration-300 ${
                  !isVendorAvailable ? "grayscale brightness-50" : ""
                }`}
              />
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

        {/* Thumbnails (on the right) */}
        {Array.isArray(images) && images.length > 1 && (
          <div className="flex flex-col gap-0.5 bg-gray-200 p-1.5">
            {images.map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                alt={`thumb-${idx}`}
                className={`h-[50px] w-[85px] cursor-pointer rounded border-2 object-cover transition-all duration-300 ${
                  idx === currentIndex
                    ? "border-orange-500"
                    : "border-transparent"
                } ${!isVendorAvailable ? "grayscale brightness-75" : ""}`}
                // Stop propagation so clicking a thumbnail doesn't navigate
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Service Description */}
      <div className="flex-grow">
        <ServiceDescription
          service={service}
          onSwitchToLogin={onSwitchToLogin}
        />
      </div>
    </div>
  );
  // return (
  //   <div className={`totalService ${!isAvailable ? "out-of-service" : ""}`}>
  //     {!isAvailable && (
  //       <div className="out-of-service-label">Out of Service</div>
  //     )}

  //     <div className="serviceCards">
  //       <div
  //         className="serviceCardImg"
  //         onMouseEnter={() => setHovered(true)}
  //         onMouseLeave={() => setHovered(false)}
  //       >
  //         <Link to={`/service/${categoryId}/${service._id}`} className="link">
  //           {Array.isArray(img) && img.length > 0 ? (
  //             <img src={img[currentIndex]} alt="Main preview" />
  //           ) : (
  //             <div className="no-image">No image available</div>
  //           )}
  //         </Link>

  //         {hovered && (
  //           <>
  //             <button className="navArrow left" onClick={prevImage}>
  //               <FaChevronLeft />
  //             </button>
  //             <button className="navArrow right" onClick={nextImage}>
  //               <FaChevronRight />
  //             </button>
  //           </>
  //         )}
  //       </div>
  //       {/* </Link> */}

  //       <div className="thumbnailColumn">
  //         {Array.isArray(img) &&
  //           img.map((thumb, idx) => (
  //             <img
  //               key={idx}
  //               src={thumb}
  //               alt={`thumb-${idx}`}
  //               className={idx === currentIndex ? "activeThumb" : ""}
  //               onClick={() => setCurrentIndex(idx)}
  //             />
  //           ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ServiceCard;
