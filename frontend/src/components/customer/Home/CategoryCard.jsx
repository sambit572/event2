import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  return (
    <a href="/category">
      <div className="courseCard">
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

          {/* {category.badge && (
          <span className={`courseTag ${category.badge.toLowerCase()}`}>
            {category.badge}
          </span>
        )} */}
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;
