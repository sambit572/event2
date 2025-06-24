import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  return (
    <a href={`/category/${category.id}`} className="categoryCard">
      <div className="card-image">
        <img src={category.image} alt={category.title} />
      </div>
      <div className="card-content">
        <h2>{category.title}</h2>
        <p>{category.description}</p>
      </div>
    </a>
  );
};

export default CategoryCard;