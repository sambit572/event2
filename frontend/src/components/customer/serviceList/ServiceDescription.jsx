import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaRegHeart,
  FaHeart,
  FaRegCalendarCheck,
  FaBell,
} from "react-icons/fa6";
import { BACKEND_URL } from "../../../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { incrementCartCount, setCartCount } from "../../../redux/UserSlice.js";

const ServiceDescription = ({ service, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareContainerRef = useRef(null); // Ref for the share container

  if (!service) {
    return null;
  }
  const [ratingData, setRatingData] = useState(null);

  const serviceId = service._id || service._id;
  const title = service.serviceName || service.title || "Untitled Service";
  const vendorName = service.vendorName || "Unknown Vendor";
  const description = service.serviceDes || service.description || "";
  const rawDuration = service.duration || 0;

  // Check if vendor is available - based on your dashboard structure
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

  const duration = formatDuration(rawDuration);
  const stateLocation = Array.isArray(service.stateLocationOffered)
    ? service.stateLocationOffered.join(", ")
    : service.stateLocationOffered ||
      (service.address
        ? `${service.address.area}, ${service.address.city}, ${service.address.state} - ${service.address.pincode}`
        : "Location not provided");
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
  const [notified, setNotified] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const handleNotifyClick = () => {
    setNotified(true);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false); // stop vibrating after 10 seconds
      console.log("animation stopped");
    }, 2000);
  };
  const MAX_LENGTH = 200;
  const shouldTruncate = description.length > MAX_LENGTH;
  const displayDescription =
    isReadMore || !shouldTruncate
      ? description
      : `${description.substring(0, MAX_LENGTH)}...`;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) return;

    const fetchWishlistStatus = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/wishlist/getwishlist`, {
          withCredentials: true,
        });
        const found =
          Array.isArray(res.data) &&
          res.data.some((item) => item.service?._id === serviceId);
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
  // Toggle wishlist state
  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to manage your wishlist.");
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/wishlist/toggle/${serviceId}`,
        {},
        { withCredentials: true }
      );
      const newStatus = !isWishlisted;
      setIsWishlisted(newStatus);
      toast.success(
        newStatus ? "Added to wishlist!" : "Removed from wishlist!"
      );
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: { serviceId } })
      );
    } catch (err) {
      toast.error("Failed to update wishlist.");
      console.error("Toggle error:", err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareService = (platform) => {
    const serviceUrl = `${window.location.origin}/service/${serviceId}`;
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
      // ADDED INSTAGRAM LOGIC
      case "instagram":
        navigator.clipboard
          .writeText(serviceUrl)
          .then(() => {
            toast.success("Link copied! You can now share it on Instagram.");
            setShowShareMenu(false);
          })
          .catch(() => {
            toast.error("Failed to copy link");
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
            toast.success("Link copied to clipboard!");
            setShowShareMenu(false);
          })
          .catch(() => {
            toast.error("Failed to copy link");
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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.");
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/cart/add`,
        { serviceId },
        { withCredentials: true }
      );
      dispatch(incrementCartCount());
      toast.success("Service added to your cart!");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("This service is already in your cart.");
      } else {
        toast.error("Failed to add service.");
      }
      console.error("Add to cart error:", err);
    }
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate(`/userdetails/${serviceId}`);
    } else {
      if (onSwitchToLogin) onSwitchToLogin(true);
    }
  };

  const handleNotifyMe = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to get notifications.");
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    try {
      // You'll need to implement this endpoint on your backend
      await axios.post(
        `${BACKEND_URL}/notifications/notify-when-available`,
        { serviceId },
        { withCredentials: true }
      );
      toast.success("You'll be notified when this service becomes available!");
    } catch (err) {
      toast.error("Failed to set up notification.");
      console.error("Notify me error:", err);
    }
  };

  return (
    <section className="relative flex h-full flex-col bg-[#e5e5de] p-4 text-gray-800 md:p-5">
      <div className="absolute top-4 right-4 z-20 flex flPex-col items-end gap-3 md:top-5 md:right-5">
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
              src="/send.png"
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
                  src="/facebook.png"
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
                  src="/twitter 1.png"
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
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  className="h-5 w-5 object-contain"
                />{" "}
                WhatsApp
              </div>
              {/* ADDED INSTAGRAM BUTTON */}
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
                onClick={() => shareService("instagram")}
              >
                <img
                  src="/instagram.png"
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
                  src="/telegram.png"
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
                  src="/connection.png"
                  alt="Copy Link"
                  className="h-5 w-5 object-contain"
                />{" "}
                Copy Link
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <div>
          <Link
            to={`/service/${serviceId}`}
            className="text-inherit no-underline pr-12"
          >
            <h3 className="text-lg font-bold leading-tight text-[#2c3e50] sm:text-xl md:text-2xl">
              {title.toUpperCase()}
            </h3>
          </Link>
          <div className="mt-3 mb-3 flex flex-wrap items-center gap-2 md:flex-row md:gap-2">
            <span className="text-sm font-semibold text-[#3498db] sm:text-base">
              {vendorName}
            </span>
            <span className="hidden text-sm text-gray-400 md:inline">|</span>
            <span className="flex items-center gap-1.5 rounded-full border border-[#ffeaa7] bg-[#fff3cd] px-3 py-1 text-[11px] font-medium text-[#856404] sm:text-xs">
              <FaRegCalendarCheck className="text-xs" />
              Event Hosted: {service.eventsHosted || 0}
            </span>
            {!isVendorAvailable && (
              <span className="flex items-center gap-1.5 rounded-full border border-[#f8d7da] bg-[#f8d7da] px-3 py-1 text-[11px] font-medium text-[#721c24] sm:text-xs">
                Service Unavailable
              </span>
            )}
          </div>
          <p className="mb-3 text-sm leading-snug text-gray-500">{location}</p>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#27ae60] px-3 py-1.5 text-sm font-semibold text-white">
              {rating}
            </span>
            <span className="text-sm text-gray-500">{reviews} reviews</span>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-1.5 md:flex-row md:gap-3">
            <span className="text-xl font-bold text-[#2c3e50] sm:text-[22px]">
              ₹{price}
            </span>
            {originalPrice && (
              <>
                <span className="text-base font-medium text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-base font-semibold text-[#27ae60]">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            <span className="font-semibold text-[#34495e]">Prep Time: </span>
            {duration}
          </p>
        </div>
        <div className="mb-5 flex-grow">
          <p className="inline text-sm leading-relaxed text-[#34495e]">
            {displayDescription}
            {shouldTruncate && (
              <button
                className="ml-1 inline cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-[#3498db] no-underline transition-colors duration-200 ease-in-out hover:text-[#2980b9] hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReadMore(!isReadMore);
                }}
              >
                {isReadMore ? " Read Less" : " Read More"}
              </button>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 lg:flex-row lg:justify-center lg:gap-3">
          {isVendorAvailable ? (
            <>
              <button
                className="flex w-full cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-[#28a745] to-[#34ce57] px-12 py-3 text-sm font-semibold text-white normal-case shadow-[0_4px_15px_rgba(40,167,69,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-[#218838] hover:to-[#28a745] hover:shadow-[0_6px_20px_rgba(40,167,69,0.4)] lg:w-auto lg:min-w-[120px]"
                onClick={handleBookNow}
              >
                Book Now
              </button>
              <button
                className="flex w-full cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-[#fd7e14] to-[#e67e22] px-12 py-3 text-sm font-semibold text-white normal-case shadow-[0_4px_15px_rgba(253,126,20,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-[#e67e22] hover:to-[#dc3545] hover:shadow-[0_6px_20px_rgba(253,126,20,0.4)] lg:w-auto lg:min-w-[120px]"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </>
          ) : (
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-[#6c757d] to-[#495057] px-12 py-3 text-sm font-semibold text-white normal-case shadow-[0_4px_15px_rgba(108,117,125,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-[#5a6268] hover:to-[#343a40] hover:shadow-[0_6px_20px_rgba(108,117,125,0.4)] lg:w-auto lg:min-w-[140px]"
              onClick={handleNotifyMe}
            >
              <FaBell className="text-sm" />
              Notify Me
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceDescription;
