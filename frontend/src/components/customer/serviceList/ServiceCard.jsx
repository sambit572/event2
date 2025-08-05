import React, { useState } from "react";
import "./ServiceCard.css";
import { Link } from "react-router-dom";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ServiceDescription from "./ServiceDescription";

const ServiceCard = ({ service, onSwitchToLogin }) => {
 const img = service.serviceImage || [];


  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? img.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % img.length);
  };

  return (
    <div className="totalService">
      <div className="serviceCards">
        <div
          className="serviceCardImg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link to={`/service/${service.id}`} className="link">
            {Array.isArray(img) && img.length > 0 ? (
              <img src={img[currentIndex]} alt="Main preview" />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </Link>

          {hovered && (
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
          {Array.isArray(img) &&
            img.map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                alt={`thumb-${idx}`}
                className={idx === currentIndex ? "activeThumb" : ""}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
        </div>
      </div>
      <ServiceDescription service={service} onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};

export default ServiceCard;
