import React, { useState } from "react";
import "../../customer/serviceList/ServiceCard.css";
import { Link } from "react-router-dom";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const ServiceCard = ({ service }) => {
  const {
    img,
    title,
    address,
    rating,
    reviews,
    price,
    originalPrice,
    discountPercent,
  } = service;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? img.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % img.length);
  };

  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };
  return (
    <div className="totalService">
      <div className="serviceCard">
        <div
          className="serviceCardImg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link to="/category/service" className="link">
            <img src={img[currentIndex]} alt="Main preview" />
          </Link>

          {hovered && (
            <>
              <button className="navArrow left" onClick={prevImage}>
                <FaChevronLeft />
              </button>
              <button className="navArrow right" onClick={nextImage}>
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
        {/* </Link> */}

        <div className="thumbnailColumn">
          {img.map((thumb, idx) => (
            <img
              key={idx}
              src={thumb}
              alt={`thumb-${idx}`}
              className={idx === currentIndex ? "activeThumb" : ""}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        <div className="serviceDescription">
          <Link to="/category/service" className="link">
            <h3>{title}</h3>
            <p className="address">
              {address.area}, {address.city}, {address.state} -{" "}
              {address.pincode}
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
                <FaHeart
                  className="wishIcon"
                  color={isWishlisted ? "red" : undefined}
                />
              </div>
              <div>{isWishlisted ? "Wishlisted" : "Add To Wishlist"}</div>
            </button>

            <button className="bookBtn">
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
