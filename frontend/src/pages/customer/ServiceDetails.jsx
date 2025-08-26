import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import "./ServiceDetails.css";
// import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";
import RatingDetails from "../../components/customer/servicedetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/servicedetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/servicedetails/ServiceDetailCard.jsx";
import ReviewList from "../../components/customer/servicedetails/ReviewList.jsx";
import ReviewForm from "../../components/customer/servicedetails/ReviewForm.jsx";
import { FaBell } from "react-icons/fa6";
import { BACKEND_URL } from "../../utils/constant.js";
import { useSelector, useDispatch } from "react-redux";

import { setCategoryServices } from "../../redux/categorySlice";


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [latestReview, setLatestReview] = useState(null);
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

  const handleAddToCart = async () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.");
      if (onSwitchToLogin) {
        onSwitchToLogin(true);
      } else {
        navigate("/login");
      }
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/cart/add`, { serviceId: serviceId });
      toast.success("Service added to your cart!");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("This service is already in your cart.");
      } else {
        toast.error("Failed to add service. Please try again.");
      }
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
          <div className="dj-img">
            <div className="thumbnail-list">
              {mediaList.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectMedia(media)}
                  className="li1"
                >
                  <img
                    src={media.src}
                    alt={`media-${index}`}
                    className={
                      !isVendorAvailable ? "grayscale brightness-75" : ""
                    }
                  />
                </div>
              ))}
            </div>
            <div className="big-image relative">
              <img
                src={selectMedia?.src}
                alt="Selected media"
                className={`transition-all duration-300 ${
                  !isVendorAvailable ? "grayscale brightness-50" : ""
                }`}
              />

              {!isVendorAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="rounded-lg bg-red-600 px-6 py-5 text-center shadow-lg">
                    <p className="text-sm font-bold text-white">
                      OUT OF SERVICE
                    </p>
                    <p className="text-xs text-red-100">
                      Oops! We’re on a quick break, back soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* THIS IS THE CORRECTED LINE */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
            {isVendorAvailable ? (
              <>
                <button
                  className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </>
            ) : (
              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-[#6c757d] to-[#495057] px-12 py-3 text-sm font-semibold text-white normal-case shadow-[0_4px_15px_rgba(108,117,125,0.3)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:from-[#5a6268] hover:to-[#343a40] hover:shadow-[0_6px_20px_rgba(108,117,125,0.4)] sm:w-auto sm:min-w-[140px]"
                onClick={handleNotifyMe}
              >
                <FaBell className="text-sm" />
                Notify Me
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
            <RatingDetails />
            <hr />
            <h4 style={{ marginTop: "30px", fontWeight: "bold" }}>
              Write a Review
            </h4>
            <ReviewForm onNewReview={(review) => setLatestReview(review)} />
            <ReviewList newReview={latestReview} />
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
    </div>
  );
};

export default Service;
