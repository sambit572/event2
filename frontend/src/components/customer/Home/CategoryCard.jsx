import React from "react";
import "./CategoryCard.css";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  

  return (
    <div className="courseCard">
      <span className="brandLabel">EventsBridge</span>
      <Link to="/category">
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
      </Link>
    </div>
  );
};

export default CategoryCard;
