import React from "react";
import "./CategoryCard.css";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      className="courseCard"
      onClick={() => {
        navigate(`/category/${category.id}`);
      }}
    >
      <span className="brandLabel">EventsBridge</span>

      <div className="imageWrapper">
        <img
          src={category.image}
          alt={category.title}
          className="courseImage"
        />

        {/* Dark Blur Overlay + Tagline */}
        {category.tagline && (
          <div className="taglineOverlay">
            <span className="taglineText">{category.tagline}</span>
          </div>
        )}
      </div>

      <div className="courseContent">
        <h3 className="courseTitle">
          {/* <span className="courseIcon">{category.icon}</span> */}
          <span className="courseText">{category.title}</span>
        </h3>

        {/* Tagline visible only in mobile/tablet */}
        {category.tagline && (
          <p className="courseTaglineResponsive">{category.tagline}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
