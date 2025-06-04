import React from "react";

import "./FilterSection.css";
import { useState } from "react";

const FilterSection = () => {
  const [price, setPrice] = useState(50);

  // const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="filter_section ">
      <h2>Filters</h2>
      <div className="filter_location">
        <h3>Location</h3>
        <select name="" id="">
          <option value="default">State</option>
          <option value="city_1">City1</option>
          <option value="city_2">City2</option>
        </select>
        <select name="" id="">
          <option value="default">City</option>
          <option value="city_1">City1</option>
          <option value="city_2">City2</option>
        </select>
        <select name="" id="">
          <option value="default">Pincode</option>
          <option value="city_1">City1</option>
          <option value="city_2">City2</option>
        </select>
        <select name="" id="">
          <option value="default">Date</option>
          <option value="city_1">City1</option>
          <option value="city_2">City2</option>
        </select>
      </div>

      <div className="filter_price">
        <h3>Price</h3>
        <input
          type="range"
          min="500"
          max="10000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          // style={{ width: "100%" }}
        />
        <p>
          <b>Selected Price:</b> &#8377;{price}
        </p>
      </div>
      <div className="">
        <h3>Ratings</h3>
        <div className="filter_rating">
          {[5, 4, 3, 2].map((rating) => (
            <label key={rating}>
              <input type="checkbox" />
              {rating} &#9733; & above
            </label>
          ))}
        </div>
      </div>
      <div className="filter_button">
        <button>Apply</button>
        <button>Cancel</button>
      </div>
    </section>
  );
};

export default FilterSection;
