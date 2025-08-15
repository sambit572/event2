import React, { useState, useEffect } from "react";
import "./ServiceDescription.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegCalendarCheck } from "react-icons/fa6";
import { BACKEND_URL } from "../../../utils/constant";
import axios from "axios";

const ServiceDescription = ({ service, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const serviceId = service._id || service.id;

  const title = service.serviceName || service.title || "Untitled Service";
  const vendorName = service.vendorName || "Unknown Vendor";
  const description = service.serviceDes || service.description || "";
  const rawDuration = service.duration || 0;

  const formatDuration = (durationInMinutes) => {
    const totalMinutes = parseInt(durationInMinutes, 10) || 0;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    let result = "";
    if (days > 0) result += `${days}d`;
    if (hours > 0) result += (result ? " : " : "") + `${hours}h`;
    if (minutes > 0) result += (result ? " : " : "") + `${minutes}m`;

    return result || "0m";
  };

  const duration = formatDuration(rawDuration);

  const location = Array.isArray(service.locationOffered)
    ? service.locationOffered.join(", ")
    : service.locationOffered ||
      (service.address
        ? `${service.address.area}, ${service.address.city}, ${service.address.state} - ${service.address.pincode}`
        : "Location not provided");

  const rating = service.rating || "★";
  const reviews = service.reviews || 0;

  const price = service.minPrice
    ? service.maxPrice
      ? `${service.minPrice} - ${service.maxPrice}`
      : `${service.minPrice}`
    : "N/A";

  const originalPrice = service.originalPrice;
  const discountPercent = service.discountPercent;

  // Fetch wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/wishlist/getwishlist`, {
          withCredentials: true,
        });
        const found = res.data.some((item) => item.service._id === serviceId);
        setIsWishlisted(found);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlistStatus();

    // Event listener to update state when wishlist is changed elsewhere
    const handleWishlistUpdate = (e) => {
      if (e.detail?.serviceId === serviceId) {
        fetchWishlistStatus();
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [serviceId]);

  // Toggle wishlist state
  const handleToggle = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/wishlist/toggle/${serviceId}`,
        {},
        { withCredentials: true }
      );
      const newStatus = !isWishlisted;
      setIsWishlisted(newStatus);

      // Notify other components (like Wishlist.jsx)
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { serviceId },
        })
      );

      console.log("Wishlist toggled:", newStatus);
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate(`/userdetails/${serviceId}`);
    } else {
      onSwitchToLogin(true);
    }
  };

  return (
    <section className="w-full text-black-900 p-4">
      {/* Wishlist Heart */}
      <div className="flex justify-end h-0">
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer transition-all duration-300
            ${
              isWishlisted
                ? "text-red-600 ring-2 ring-red-300 shadow-red-200"
                : "text-gray-600 hover:text-red-500"
            }`}
          onClick={handleToggle}
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </div>
      </div>

      {/* Main Content */}
      <Link to={`/service/${serviceId}`} className="block">
        <h3 className="text-xl font-bold mb-1">{title}</h3>

        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-2">
          <span className="text-blue-800">{vendorName}</span>
          <span className="text-gray-400 text-xs">|</span>
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs shadow-sm">
            <FaRegCalendarCheck className="text-xs" />
            Event Hosted: 0
          </span>
        </div>

        <p className="text-sm text-black mb-2">{location}</p>

        {/* Rating and Reviews */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {rating}
          </span>
          <span className="text-sm">{reviews} reviews</span>
        </div>

        {/* Pricing */}
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

        <p className="text-sm text-black mb-4">
          <span className="font-bold">Prep Time: </span>
          {duration}
        </p>

        <p className="text-sm text-black mb-4">{description}</p>
      </Link>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row-reverse gap-4">
        <button className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition-all duration-300">
          Add to Cart
        </button>

        <button
          className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>
    </section>
  );
};

export default ServiceDescription;
