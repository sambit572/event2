import React from "react";
import PriceSection from "./PriceSection.jsx";
import RatingSection from "./RatingSection.jsx";
import ServiceDescription from "./ServiceDescription.jsx";
import ServiceDetailsSection from "./ServiceDetailsSection.jsx";
import "./ServiceCard.css"; // Make sure to import your CSS

const ServiceCard = () => {
  return (
    <div className="dj-service-card">
      <h2 className="dj-title">
        Wedding DJ Service – Premium Entertainment for Your Big Day
      </h2>
      <p className="serviceDetails-location">Patia, Bhubaneswar, Odisha, India</p>
      <PriceSection />
      <RatingSection />
      <ServiceDescription />
      <hr className="dj-divider" />
      <ServiceDetailsSection />
    </div>
  );
};

export default ServiceCard;
