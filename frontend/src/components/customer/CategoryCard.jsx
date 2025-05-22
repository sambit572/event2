import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  return (
    <a href="/category" className="categoryCard">
      <img src={category.image} alt="" />
      <h2>{category.title}</h2>
    </a>
  );
};

export default CategoryCard;
