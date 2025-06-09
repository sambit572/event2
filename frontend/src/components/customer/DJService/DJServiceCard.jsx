import React from "react";
import PriceSection from "../../customer/DJService/PriceSection.jsx";
import RatingSection from "../DJService/RatingSection.jsx";
import DescriptionSection from "../DJService/DescriptionSection.jsx";
import DJDetailsSection from "../DJService/DJDetailsSection.jsx";
import "../../customer/DJService/DJServiceCard.css"; // Make sure to import your CSS

const DJServiceCard = () => {
  return (
    <div className="dj-service-card">
      <h2 className="dj-title">
        Wedding DJ Service – Premium Entertainment for Your Big Day
      </h2>

      <PriceSection />
      <RatingSection />
      <DescriptionSection />
      <hr className="dj-divider" />
      <DJDetailsSection />
    </div>
  );
};

export default DJServiceCard;
