import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaRegHeart,
  FaHeart,
  FaRegCalendarCheck,
  FaBell,
} from "react-icons/fa6";
import { BACKEND_URL } from "../../../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { incrementCartCount } from "../../../redux/UserSlice.js";
import { useDispatch } from "react-redux";
import { getServicePriceDisplay } from "../../../utils/pricingHelpers";

const ServiceDescription = ({ service, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareContainerRef = useRef(null); // Ref for the share container
  const [isReadMoreLocation, setIsReadMoreLocation] = useState(false);
  const locationPath = useLocation();

  if (!service) {
    return null;
  }

  const [ratingData, setRatingData] = useState(null);

  const serviceId = service._id || service.id;
  const title = service.serviceName || service.title || "Untitled Service";
  const vendorName = service.vendorName || "Unknown Vendor";
  const description = service.serviceDes || service.description || "";
  const rawDuration = service.duration || 0;

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
  // ✅ UPDATED: Use the helper function for consistent pricing
  const price = getServicePriceDisplay(service);
  // const price = service.minPrice
  //   ? service.maxPrice
  //     ? `₹${service.minPrice} - ₹${service.maxPrice}`
  //     : `₹${service.minPrice}`
  //   : "N/A";

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
  const MAX_LENGTH = 100;
  const MAX_LOCATION_LENGTH = 50;
  const shouldTruncate = description.length > MAX_LENGTH;
  const shouldTruncateLocation = location.length > MAX_LOCATION_LENGTH;
  const displayDescription =
    isReadMore || !shouldTruncate
      ? description
      : `${description.substring(0, MAX_LENGTH)}...`;

  const displayLocation =
    isReadMoreLocation || !shouldTruncateLocation
      ? location
      : `${location.substring(0, MAX_LOCATION_LENGTH)}...`;

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
        console.log("Rating summary data:", res.data);
      } catch (err) {
        console.error("Error fetching rating summary:", err);
      }
    };

    if (serviceId) fetchRatingSummary();
  }, [serviceId]);

  const handleWishlistUpdate = (e) => {
    if (e.detail?.serviceId === serviceId) {
      fetchWishlistStatus();
    }
  };

  // Toggle wishlist state
  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to manage your wishlist.", { duration: 1500 });
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
        newStatus ? "Added to wishlist!" : "Removed from wishlist!",
        { duration: 1500 }
      );
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: { serviceId } })
      );
    } catch (err) {
      toast.error("Failed to update wishlist.", { duration: 1500 });
      console.error("Toggle error:", err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  // --- THIS IS THE ADJUSTED PORTION ---
  const shareService = (platform) => {
    // Get the category from the service object prop
    const categoryId = service.categoryId;

    // Important check: If categoryId is missing, the link will be wrong.
    if (!categoryId) {
      toast.error("Cannot generate share link: Category ID is missing.", {
        duration: 3000,
      });
      console.error(
        "Service object is missing 'categoryId' property.",
        service
      );
      return;
    }

    // Build the correct URL
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
              duration: 3000,
            });
            setShowShareMenu(false);
          })
          .catch(() => {
            toast.error(
              "Failed to copy link. Please use a secure (HTTPS) connection.",
              { duration: 3000 }
            );
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
            toast.error(
              "Failed to copy link. Please use a secure (HTTPS) connection.",
              { duration: 2000 }
            );
          });
        return;
      default:
        return;
    }

    if (shareUrl) {
      const newWindow = window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        toast.error(
          "Pop-up blocked! Please allow pop-ups for this site to share.",
          { duration: 2000 }
        );
      }
    }
  };
  // --- END OF ADJUSTED PORTION ---

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.", {
        duration: 3000,
      });
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    // === NEW: Prevent direct cart addition for catering services ===
    const isCateringService = service.pricingType === "perPlate";

    if (isCateringService) {
      toast.error("Please select a package from the service details page.");
      const categoryId = service.categoryId || service.serviceCategory;
      navigate(`/service/${categoryId}/${serviceId}`);
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/cart/add`,
        { serviceId },
        { withCredentials: true }
      );
      dispatch(incrementCartCount());
      toast.success("Service added to your cart!", { duration: 1500 });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("This service is already in your cart.", {
          duration: 1500,
        });
      } else {
        toast.error("Failed to add service.", { duration: 1500 });
      }
      console.error("Add to cart error:", err);
    }
  };

  // --- THIS IS THE CORRECTED FUNCTION ---

  const handleBookNow = (e) => {
    e.stopPropagation();

    // Step 1: Check for login status first.
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to book a service.", { duration: 2000 });
      if (onSwitchToLogin) onSwitchToLogin(true);
      return; // Stop execution if not logged in
    }

    // Step 2: User is logged in, NOW check the service type.
    const isCateringService = service.pricingType === "perPlate";

    if (isCateringService) {
      // Navigate to the service details page to select a package.
      const categoryId = service.categoryId || service.serviceCategory;

      if (!categoryId) {
        console.error("Cannot navigate: Missing categoryId on service object.");
        toast.error("Could not open service, category ID is missing.");
        return;
      }

      navigate(`/service/${categoryId}/${serviceId}`);
      toast.success("Please select a package and plate count to proceed.");
    } else {
      // Navigate directly to user details as before.
      navigate(`/userdetails/${serviceId}`, {
        state: { from: locationPath.pathname },
      });
    }
  };
  const handleNotifyMe = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to get notifications.", { duration: 2000 });
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/notifications/notify-when-available`,
        { serviceId },
        { withCredentials: true }
      );
      toast.success("You'll be notified when this service becomes available!", {
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to set up notification.", { duration: 2000 });
      console.error("Notify me error:", err);
    }
  };

  useEffect(() => {
    if (!service) return;
    const serviceId = service._id || service.id;
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

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [service]);

  return (
    <section className="relative flex h-full flex-col bg-[#ffffff] p-4 sm:pr-[40px] text-gray-800 md:py-0 px-5">
      <div className="absolute top-[0.5rem] right-4 z-20 flex flex-col items-end gap-3 md:right-5">
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 shadow-md cursor-pointer transition-all duration-300 ${
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("facebook");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("twitter");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("whatsapp");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("instagram");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("telegram");
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareService("copy");
                }}
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
      <div className="flex flex-grow flex-col">
        <div>
          {/* This Link component also needs the categoryId to work correctly */}
          <Link
            to={`/service/${service.categoryId}/${serviceId}`}
            className="text-inherit no-underline "
          >
            <h3 className="text-lg font-bold leading-tight text-[#2c3e50] sm:text-xl md:text-2xl">
              {title.toUpperCase()}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-2 md:flex-row md:gap-2">
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
          <p className="mb-[0.2rem] text-sm leading-snug text-gray-500">
            {displayLocation}
            {shouldTruncateLocation && (
              <button
                className="ml-1 inline cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-[#3498db] no-underline transition-colors duration-200 ease-in-out hover:text-[#2980b9] hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReadMoreLocation(!isReadMoreLocation);
                }}
              >
                {isReadMoreLocation ? " Read Less" : " Read More"}
              </button>
            )}
          </p>

          <p className="mb-[0.2rem] text-sm leading-snug text-gray-500">
            {stateLocation.toUpperCase()}
          </p>
          {ratingData ? (
            <div className="flex items-center gap-2 mb-[0.3rem]">
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
          <div className="mb-[0.2rem] flex flex-wrap items-center gap-1.5 md:flex-row md:gap-3">
            <span className="text-xl font-bold text-[#2c3e50] sm:text-[22px]">
              {price}
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
          <p className="mb-[0.2rem] text-sm text-gray-500">
            <span className="font-semibold text-[#34495e]">Prep Time: </span>
            {duration}
          </p>
        </div>
        <div className="mb-[0.5rem] flex-grow">
          <p className="text-sm text-gray-500">
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
        <div className="flex flex-row gap-2.5 lg:flex-row lg:justify-center lg:gap-3">
          {isVendorAvailable ? (
            <>
              <button
                className="flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#001f3f] to-[#004f9f] lg:px-12 lg:py-3 px-1 py-1 text-xs lg:text-sm font-bold text-white transition-colors duration-300 ease-in-out hover:from-[#002366] hover:to-[#004c99] active:from-[#000d1a] active:to-[#002244] lg:w-auto lg:min-w-[120px] shadow-md hover:shadow-lg"
                onClick={handleBookNow}
              >
                BOOK NOW
              </button>

              <button
                className="flex w-full cursor-pointer items-center justify-center 
             rounded-full border-none 
             bg-gradient-to-r from-[#fb923c] to-[#ef4444] 
             text-white font-bold transition-all duration-300 shadow-md 
             hover:shadow-lg hover:from-[#fca5a5] hover:to-[#dc2626] 
             lg:px-10 lg:py-3 px-1 py-2 lg:text-sm text-xs lg:w-auto
             "
                onClick={handleAddToCart}
              >
                ADD TO CART
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
