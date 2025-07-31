import React, { useState } from "react";
import "./ServiceCard.css";
import { Link } from "react-router-dom";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ServiceDescription from "./ServiceDescription";

const ServiceCard = ({ service, onSwitchToLogin }) => {
  // In old mock data the image array was `img`; in new data it's `serviceImage`.
  const images = service.serviceImage || service.img || [];

  // Unique id for the detail page route.
  const id = service._id || service.id;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="totalService">
      <div className="serviceCards">
        <div
          className="serviceCardImg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link to={`/service/${id}`} className="link">
            <img
              src={images[currentIndex]}
              alt={service.serviceName || service.title || "Service preview"}
            />
          </Link>

          {hovered && images.length > 1 && (
            <>
              <button className="navArrow left" onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className="navArrow right" onClick={nextImage}>
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
        {/* </Link> */}

        <div className="thumbnailColumn">
          {images.length > 1 && (
            <div className="thumbnailColumn">
              {images.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`thumb-${idx}`}
                  className={idx === currentIndex ? "activeThumb" : ""}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ServiceDescription service={service} onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};

export default ServiceCard;
