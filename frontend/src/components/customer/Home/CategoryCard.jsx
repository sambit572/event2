import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  return (
    <a href="/category" className="categoryCard">
      <img src={category.image} alt="" />
      {/* <h3>Staring at &#8377;4999</h3> */}
      <h2>{category.title}</h2>
      <p>The tag line for the catagory</p>
    </a>
  );
};

export default CategoryCard;
