import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { BACKEND_URL } from "../../../utils/constant";
import { useParams } from "react-router-dom"; // 1. IMPORT useParams
import { getServicePriceDisplay } from "../../../utils/pricingHelpers";

const ServiceDetailCard = ({ service }) => {
  const { categoryId } = useParams(); // 2. GET categoryId FROM URL
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareContainerRef = useRef(null);
  const [ratingData, setRatingData] = useState(null);

  if (!service) return null;

  const {
    _id,
    serviceName,
    serviceDes,
    locationOffered,
    minPrice,
    maxPrice,
    duration,
    vendorName,
    rating,
    reviews,
    originalPrice,
    discountPercent,
    address,
    available,
  } = service;

  const totalReviews = reviews?.length || reviews || 0;
  const averageRating = rating || 0;
  const serviceId = _id || service.id;
  const title = serviceName || "Untitled Service";
  const isVendorAvailable = service.available !== false;

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

  const formattedDuration = formatDuration(duration);
  const stateLocation = Array.isArray(service.stateLocationOffered)
    ? service.stateLocationOffered.join(", ")
    : service.stateLocationOffered ||
      (service.address
        ? `${service.address.area}, ${service.address.city}, ${service.address.state} - ${service.address.pincode}`
        : "Location not provided");
  const location = Array.isArray(locationOffered)
    ? locationOffered.join(", ")
    : locationOffered ||
      (address
        ? `${address.area}, ${address.city}, ${address.state} - ${address.pincode}`
        : "Location not provided");

  // const price = minPrice
  //   ? maxPrice
  //     ? minPrice === maxPrice
  //       ? `₹${minPrice}`
  //       : `₹${minPrice} - ₹${maxPrice}`
  //     : `₹${minPrice}`
  //   : "N/A";
  const price = getServicePriceDisplay(service);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareContainerRef.current &&
        !shareContainerRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchRatingSummary = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/reviews/rating/${serviceId}`
        );
        if (res.data.success) {
          setRatingData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching rating summary:", err);
      }
    };

    if (serviceId) fetchRatingSummary();
  }, [serviceId]);

  const handleToggleWishlist = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/wishlist/toggle/${serviceId}`,
        {},
        { withCredentials: true }
      );
      const newStatus = !isWishlisted;
      setIsWishlisted(newStatus);
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: { serviceId } })
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const shareService = (platform) => {
    // 3. USE categoryId TO BUILD THE CORRECT URL
    const serviceUrl = `${window.location.origin}/service/${categoryId}/${serviceId}`;
    const shareText = `Check out this service: ${title} by ${vendorName}`;
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          serviceUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(serviceUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + serviceUrl
        )}`;
        break;
      case "instagram":
        navigator.clipboard
          .writeText(serviceUrl)
          .then(() => {
            toast.success("Link copied! You can now share it on Instagram.", {
              duration: 1500,
            });
            setShowShareMenu(false);
          })
          .catch(() => {
            toast.error("Failed to copy link", { duration: 1500 });
          });
        return;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          serviceUrl
        )}&text=${encodeURIComponent(shareText)}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(serviceUrl)
          .then(() => {
            toast.success("Link copied to clipboard!", { duration: 1500 });
            setShowShareMenu(false);
          })
          .catch(() => {
            toast.error("Failed to copy link", { duration: 1500 });
          });
        return;
      default:
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  return (
    <div className="relative w-full rounded-lg border border-gray-200 bg-red p-4 mt-5">
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-3">
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 shadow-md cursor-pointer transition-all duration-300 ${
            isWishlisted
              ? "text-red-600 ring-2 ring-red-300 shadow-red-200"
              : "text-gray-600 hover:text-red-500"
          }`}
          onClick={handleToggleWishlist}
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </div>

        <div className="relative" ref={shareContainerRef}>
          <div
            className="h-10 w-10 cursor-pointer overflow-hidden rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
            onClick={handleShare}
          >
            <img
              decoding="async"
              loading="lazy"
              src="/send.webp"
              alt="Share"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div
            className={`absolute top-full right-0 mt-2 min-w-[160px] origin-top-right rounded-xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 ease-out ${
              showShareMenu
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="py-2">
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("facebook")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/facebook.webp"
                  alt="Facebook"
                  className="h-5 w-5 object-contain"
                />{" "}
                Facebook
              </div>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("twitter")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/twitter 1.webp"
                  alt="X"
                  className="h-5 w-5 object-contain"
                />{" "}
                X
              </div>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("whatsapp")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/whatsapp.webp"
                  alt="WhatsApp"
                  className="h-5 w-5 object-contain"
                />{" "}
                WhatsApp
              </div>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("instagram")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/instagram.webp"
                  alt="Instagram"
                  className="h-5 w-5 object-contain"
                />{" "}
                Instagram
              </div>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("telegram")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/telegram.webp"
                  alt="Telegram"
                  className="h-5 w-5 object-contain"
                />{" "}
                Telegram
              </div>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("copy")}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src="/connection.webp"
                  alt="Copy Link"
                  className="h-5 w-5 object-contain"
                />{" "}
                Copy Link
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2 pr-12">
        {title}
      </h2>

      <div className="flex items-center gap-2 text-sm font-medium text-black mb-2 flex-wrap">
        <span className="font-semibold text-blue-600 text-base">
          {vendorName || "Unknown Vendor"}
        </span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="flex items-center gap-1 bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-md text-xs">
          <FaRegCalendarCheck className="text-sm" />
          Event Hosted: 0
        </span>
        {!isVendorAvailable && (
          <span className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-[11px] font-medium text-red-800 sm:text-xs">
            Service Unavailable
          </span>
        )}
      </div>

      <p className="text-sm text-black mr-5 mb-2">{location}</p>
      <p className="text-sm text-black mb-2 mt-0">
        {stateLocation.toUpperCase()}
      </p>
      {ratingData ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {ratingData.averageRating.toFixed(1)} ★
          </span>
          <span className="text-gray-500 text-sm">
            ({ratingData.totalReviews} reviews)
          </span>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-3">Loading rating...</p>
      )}

      <div className="flex flex-wrap gap-3 items-center mb-2 text-sm">
        <span className="text-xl font-bold text-black">{price}</span>
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
      <p
        className={`text-sm mb-1 ${
          available ? "text-green-600" : "text-red-700"
        }`}
      >
        {available ? null : "Out Of Service"}
      </p>
      <p className="text-sm text-black mb-4">
        <span className="font-bold">Prep Time: </span>
        {formattedDuration}
      </p>

      <div className="service-description">
        <p className="text-black text-sm">{serviceDes}</p>
      </div>
    </div>
  );
};

export default ServiceDetailCard;
