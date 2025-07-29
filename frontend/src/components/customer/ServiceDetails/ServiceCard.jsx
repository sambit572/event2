import React from "react";
import PriceSection from "./PriceSection.jsx";
import RatingSection from "./RatingSection.jsx";
import ServiceDescription from "./ServiceDescription.jsx";
import ServiceDetailsSection from "./ServiceDetailsSection.jsx";
import "./ServiceCard.css";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const {
    serviceName,
    serviceDes,
    locationOffered,
    priceRange,
    duration,
    serviceCategory,
  } = service;
 console.log("Fetched Service:", service);
  return (
    <div className="dj-service-card">
        <h2 className="dj-title">{serviceName || "DJ Test Title"}</h2>

      <p className="serviceDetails-location ">
        <strong>Location:</strong> {locationOffered}
      </p>
     <p className="serviceDetails-category">
        <strong>Category:</strong> {serviceCategory}
      </p>

      <p className="serviceDetails-price text-black">
        <strong className="text-black ">Price Range:</strong> 
        
        ₹{priceRange}
      </p>

         <div className="service-description">
        <strong>Description:</strong>
        <p className="text-black" >{serviceDes}</p>
      </div>

      {/* <ServiceDetailsSection
        title={service.title}
        category={service.category}
        idealFor={service.idealFor}
        inclusions={service.inclusions}
      /> */}
    </div>
  );
};

export default ServiceCard;
