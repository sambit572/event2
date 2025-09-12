import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import "./ServiceDetails.css";
// import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";
import RatingDetails from "../../components/customer/ServiceDetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/servicedetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/ServiceDetails/ServiceDetailCard.jsx";
import ReviewList from "../../components/customer/servicedetails/ReviewList.jsx";
import ReviewForm from "../../components/customer/servicedetails/ReviewForm.jsx";
import { FaBell } from "react-icons/fa6";
import { BACKEND_URL } from "../../utils/constant.js";
import { useSelector, useDispatch } from "react-redux";

import { setCategoryServices } from "../../redux/categorySlice";
import { incrementCartCount } from "../../redux/UserSlice.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import SimilarProductCard from "./../../components/customer/ServiceDetails/PeopleAlsoBooked";

const Service = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const categoryServices = useSelector(
    (state) => state.category.categoryServices
  );
  const dispatch = useDispatch();
  const { categoryId } = useParams(); // This is the category name passed in URL
  // console.log("Category ID:", categoryId);
  // console.log("Fetched services2:", categoryServices);
  useEffect(() => {
    if (!categoryServices || categoryServices.length === 0) {
      axios

        .get(`${BACKEND_URL}/common/category/${categoryId}`)
        .then((res) => {
          dispatch(setCategoryServices(res.data.data));
        })
        .catch((err) => console.error(err));
    }
  }, [categoryId]);

  const [service, setService] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [selectMedia, setSelectMedia] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [latestReview, setLatestReview] = useState(null);
  const [notified, setNotified] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  // helpers + effects (place inside the component, after state)
  const prevSlide = () =>
    setCurrentIndex((i) =>
      i === 0 ? Math.max(mediaList.length - 1, 0) : i - 1
    );

  const nextSlide = () =>
    setCurrentIndex((i) => (mediaList.length ? (i + 1) % mediaList.length : 0));

  // reset to first image when list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [mediaList.length]);

  const handleUserReview = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      setIsReviewModalOpen(true);
    } else {
      onSwitchToLogin(true);
    }
  };

  const handleNotifyClick = () => {
    setNotified(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };
  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/common/service/${serviceId}`
        );
        const data = res.data.data;
        setService(data);

        const formattedMedia = (data.serviceImage || []).map((src) => ({
          type: "image",
          src,
        }));
        setMediaList(formattedMedia);
        setSelectMedia(formattedMedia[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Service not found.");
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const isVendorAvailable = service?.available !== false;

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate(`/userdetails/${serviceId}`);
    } else {
      if (onSwitchToLogin) {
        onSwitchToLogin(true);
      } else {
        toast.error("Please log in to book this service.");
        navigate("/login");
      }
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

  const handleNotifyMe = async (e) => {
    e.stopPropagation();
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to get notifications.");
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/notifications/notify-when-available`, {
        serviceId,
      });
      toast.success("You'll be notified when this service becomes available!");
    } catch (err) {
      toast.error("Failed to set up notification.");
      console.error("Notify me error:", err);
    }
  };

  if (loading) return <p>Loading service details...</p>;
  if (error || !service) return <p>{error || "Service not found."}</p>;

  return (
    <div className="dj">
      <div className="section_one">
        <div className="left-fixed">
          <div
            className="relative w-full h-[260px] mb-5 sm:h-[400px] lg:h-[430px] overflow-hidden rounded-lg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Images */}
            {mediaList.length > 0 ? (
              <>
                {mediaList.map((media, idx) => (
                  <img
                    key={idx}
                    src={media.src}
                    alt={`slide-${idx}`}
                    className={`absolute top-0 left-0 w-full h-full  rounded-lg object-cover transition-opacity duration-700 ${
                      idx === currentIndex ? "opacity-100" : "opacity-0"
                    } ${!isVendorAvailable ? "grayscale brightness-50" : ""}`}
                  />
                ))}

                {/* Left Arrow */}
                {hovered && mediaList.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <FaChevronLeft />
                  </button>
                )}

                {/* Right Arrow */}
                {hovered && mediaList.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <FaChevronRight />
                  </button>
                )}

                {/* Dots */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {mediaList.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 w-2 rounded-full cursor-pointer ${
                          idx === currentIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      ></span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
                {!isVendorAvailable ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-red-600">
                      OUT OF SERVICE
                    </p>
                    <p className="text-xs text-gray-600">No Image Available</p>
                  </div>
                ) : (
                  "No Image Available"
                )}
              </div>
            )}
          </div>

          {/* THIS IS THE CORRECTED LINE */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
            {isVendorAvailable ? (
              <>
                <button
                  className="flex w-full cursor-pointer items-center justify-center rounded-full border-none bg-[#7f00ff] px-12 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#5e00cc] active:bg-[#4b0099] lg:w-auto lg:min-w-[220px]"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
                <button
                  className="w-full lg:w-auto lg:min-w-[220px] px-4 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <button
                onClick={handleNotifyClick}
                className={`w-full sm:w-44 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-900 bg-transparent border border-blue-900 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md transition-all duration-300`}
              >
                {!notified ? (
                  "Notify"
                ) : (
                  <FaBell
                    className={`text-base ${
                      isAnimating ? "animate-bounce" : ""
                    }`}
                  />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="right-scrollable">
          <DJServiceCard service={service} />
          <div className="why-choose">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>5-Star Rated Wedding DJs</li>
              <li>Backup Equipment Always On-Hand</li>
              <li>Experience With All Cultures & Traditions</li>
              <li>Custom Packages & Friendly Support</li>
            </ul>
          </div>
          <div className="reviews">
            <h3>DJ Ratings & Reviews</h3>
            <RatingDetails serviceId={serviceId} />
            <hr />

            {/* Add Feedback Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUserReview}
                className="flex items-center gap-2 mt-5 bg-[#7f00ff] hover:bg-[#5e00cc] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 text-sm sm:text-base md:text-lg"
              >
                <span className="text-lg sm:text-xl">💬</span>
                Add Feedback
              </button>
            </div>
            {/* {latestReview && (
              <div className="mt-4 p-4 bg-gray-50 border rounded-lg shadow-sm">
                <p className="font-semibold">
                  {latestReview.userName || "You"}
                </p>
                <p className="text-yellow-500">
                  {"★".repeat(latestReview.rating)}
                </p>
                <p className="text-gray-700 mt-1">{latestReview.reviewText}</p>
              </div>
            )} */}
            {/* Review List */}
            <ReviewList newReview={latestReview} serviceId={serviceId} />
          </div>
        </div>
      </div>

      <div className="view-dj-section">
        <h2 className="people-also-book">People Also Booked</h2>
        <div className="view-dj">
          {categoryServices.map((product) => (
            <SimilarProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            <ReviewForm
              serviceId={service._id}
              userName={currentUser?.fullName || "Guest"}
              userId={currentUser?.id} // 👈 id is fine
              onNewReview={(newReview) => {
                setLatestReview(newReview);
                setReviews((prev) => [newReview, ...prev]);
                setIsReviewModalOpen(false);
              }}
              closePopup={() => setIsReviewModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
