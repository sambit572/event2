import React from "react";
import "./ServiceDescription.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHeart } from "react-icons/fa6";

const ServiceDescription = ({ service }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    title,
    address,
    rating,
    reviews,
    price,
    originalPrice,
    discountPercent,
  } = service;
  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };
  return (
    <section className="serviceDescription">
      <Link to="/category/service" className="link">
        <h3>{title}</h3>
        <p className="address">
          {address.area}, {address.city}, {address.state} - {address.pincode}
        </p>
        <div className="serviceRating">
          <span className="rate">{rating} ☆</span>
          <span className="review">{reviews} reviews</span>
        </div>
        <div className="servicePrice">
          <span className="price">₹{price}</span>
          <span className="originalPrice">₹{originalPrice}</span>
          <span className="discountPercent">{discountPercent}% off</span>
        </div>
        <p className="paragraph">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          blanditiis enim quaerat eaque cum.
        </p>
      </Link>
      <div className="actionButtons">
        <button
          className={`viewBtn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleClick}
        >
          <div>
            {isWishlisted && <FaHeart className="wishIcon" color="red" />}
          </div>
          <div>
            {isWishlisted ? (
              "Wishlisted"
            ) : (
              <span className="wishlist-text">
                <span className="plusSign">+</span> Wishlist
              </span>
            )}
          </div>
        </button>

        <button className="bookBtn">
          <span>Book Now</span>
        </button>
      </div>
    </section>
  );
};

export default ServiceDescription;
