import React from "react";
import "./ServiceDescription.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHeart } from "react-icons/fa6";

const ServiceDescription = ({ service, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const id = service._id || service.id;
  const title = service.serviceName || service.title || "Untitled Service";
  const vendorName = service.vendorName || "Unknown Vendor";

  const description = service.serviceDes || service.description || "";
const location = Array.isArray(service.locationOffered)
  ? service.locationOffered.join(", ")
  : service.locationOffered ||
    (service.address
      ? `${service.address.area}, ${service.address.city}, ${service.address.state} - ${service.address.pincode}`
      : "Location not provided");


  const rating = service.rating || "★";
  const reviews = service.reviews || 0;

 const price =
   service.minPrice && service.maxPrice
     ? `${service.minPrice} - ${service.maxPrice}`
     : "N/A";

  const originalPrice = service.originalPrice;
  const discountPercent = service.discountPercent;

  const handleClick = () => setIsWishlisted(!isWishlisted);

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/userdetails");
    } else {
      onSwitchToLogin(true);
    }
  };

  return (
    <section className="w-full text-black-900 p-4 ">
      <Link to={`/service/${id}`} className="block">
        <h3 className="text-xl font-bold mb-1">{title}</h3>

        <p className="inline-block  text-blue-700 text-sm font-medium  mb-2">
          {vendorName}
        </p>

        <p className="text-sm text-black mb-2">{location}</p>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {rating}
          </span>
          <span className="text-sm">{reviews} reviews</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-2 text-sm">
          <span className="text-xl font-bold text-black-900">₹{price}</span>
          {originalPrice && (
            <>
              <span className="line-through text-gray-500 font-medium">
                ₹{originalPrice}
              </span>
              <span className="text-green-600 font-bold text-base">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>

        <p className="text-sm text-black mb-4">{description}</p>
      </Link>

      <div className="flex flex-col sm:flex-row-reverse gap-4">
        <button
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-sm border transition-all duration-300 w-full sm:w-44 ${
            isWishlisted
              ? "border-red-500 bg-white text-black"
              : "border-gray-800 bg-white text-gray-800 hover:bg-red-600 hover:text-white hover:border-red-600"
          }`}
          onClick={handleClick}
        >
          {isWishlisted && <FaHeart className="text-red-500 text-lg" />}
          {isWishlisted ? (
            "Wishlisted"
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-lg leading-none">+</span> Wishlist
            </span>
          )}
        </button>

        <button
          className="px-4 py-2 rounded-full font-bold text-sm bg-green-700 text-white hover:bg-green-600 w-full sm:w-44"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>
    </section>
  );
};

export default ServiceDescription;
