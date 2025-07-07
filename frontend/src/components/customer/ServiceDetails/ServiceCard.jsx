import React from "react";
import PriceSection from "./PriceSection.jsx";
import RatingSection from "./RatingSection.jsx";
import ServiceDescription from "./ServiceDescription.jsx";
import ServiceDetailsSection from "./ServiceDetailsSection.jsx";
import "./ServiceCard.css";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const {
    title,
    description,
    address,
    price,
    originalPrice,
    discountPercent,
    rating,
    reviews,
  } = service;

  return (
    <div className="dj-service-card">
      <h2 className="dj-title">{title}</h2>
      <p className="serviceDetails-location">
        {address.area}, {address.city}, {address.state}, {address.country}
      </p>

      <PriceSection
        price={service.price}
        originalPrice={service.originalPrice}
        discountPercent={service.discountPercent}
      />

      <RatingSection
        ratingValue={service.rating}
        totalRatings={service.reviews}
        totalReviews={Math.round(service.reviews * 0.8)} // or replace with actual
      />

      <ServiceDescription description={description} />

      <hr className="dj-divider" />

      <ServiceDetailsSection
        title={service.title}
        category={service.category}
        idealFor={service.idealFor}
        inclusions={service.inclusions}
      />
    </div>
  );
};

export default ServiceCard;
