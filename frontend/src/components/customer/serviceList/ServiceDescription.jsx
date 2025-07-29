import React from "react";
import "./ServiceDescription.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHeart } from "react-icons/fa6";

const ServiceDescription = ({ service, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Dynamic fields from either mock or backend
  const id = service._id || service.id;
  const title = service.serviceName || service.title || "Untitled Service";
  const vendor = service.vandor || service.vendorId || "Unknown Vendor";
  const description = service.serviceDes || service.description || "";
  const location =
    service.locationOffered ||
    (service.address
      ? `${service.address.area}, ${service.address.city}, ${service.address.state} - ${service.address.pincode}`
      : "Location not provided");

  const rating = service.rating || "★";
  const reviews = service.reviews || 0;

  // Handle pricing logic
  const price = service.price || service.priceRange || "N/A";
  const originalPrice = service.originalPrice;
  const discountPercent = service.discountPercent;
  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/userdetails");
    } else {
      onSwitchToLogin(true); // ✅ this opens your login popup
    }
  };

  return (
    <section className="serviceDescription">
      <Link to={`/service/${id}`} className="link">
        <h3>{title}</h3>
           <p className="address">{location}</p>

        <div className="serviceRating">
          <span className="rate">{rating} ☆</span>
          <span className="review">{reviews} reviews</span>
        </div>
        <div className="servicePrice">
          <span className="price">₹{price}</span>
         {originalPrice && (
            <>
              <span className="originalPrice">₹{originalPrice}</span>
              <span className="discountPercent">{discountPercent}% off</span>
            </>
          )}
        </div>
        <p className="paragraph">{description}</p>
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

        <button className="bookBtn" onClick={handleBookNow}>
          <span>Book Now</span>
        </button>
      </div>
    </section>
  );
};

export default ServiceDescription;
