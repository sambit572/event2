import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

import "./ServiceDetails.css";

// import { CategoryData } from "../../utils/CatogoryData.jsx";
// import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";

import RatingDetails from "../../components/customer/servicedetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/servicedetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/servicedetails/ServiceDetailCard.jsx";
import ReviewList from "../../components/customer/servicedetails/ReviewList.jsx";
import ReviewForm from "../../components/customer/servicedetails/ReviewForm.jsx";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../../utils/constant.js";
import { FaBell } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCategoryServices } from "../../redux/categorySlice";
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
  // console.log("similarServiceData", similarServiceData.length);
  // useEffect(() => {
  //   console.log("Category ID:", categoryId);
  //   const fetchServices = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         `${BACKEND_URL}/common/category/${categoryId}`
  //       );
  //       console.log("Fetched services:", response);
  //       setServices(response.data.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching services:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchServices();
  // }, [categoryId]);
  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";

    if (isLoggedIn) {
      navigate("/userdetails");
    } else {
      onSwitchToLogin(true); // ✅ this opens your login popup
    }
  };
  const [service, setService] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [selectMedia, setSelectMedia] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
  const available = service?.available || false;
  if (loading) return <p>Loading service details...</p>;
  if (error || !service) return <p>{error || "Service not found."}</p>;

  return (
    <div className="dj">
      <div className="section_one">
        {/* Left Section */}
        <div className="left-fixed">
          <div className="dj-img">
            <div className="thumbnail-list">
              {mediaList.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectMedia(media)}
                  className="li1"
                >
                  <img src={media.src} alt={`media-${index}`} />
                </div>
              ))}
            </div>
            <div className="big-image">
              <img src={selectMedia?.src} alt="Selected media" />
            </div>
          </div>
          <div className="flex justify-center flex-col sm:flex-row-reverse gap-4">
            {available ? (
              <>
                <button className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md transition-all duration-300">
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
                onClick={handleNotifyClick}
                className={`w-full sm:w-44 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-900 bg-transparent border border-blue-900
        hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md transition-all duration-300`}
              >
                {!notified ? (
                  "Notify"
                ) : (
                  <span
                    className={`flex items-center gap-1 ${
                      isAnimating ? "animate-bell" : ""
                    }`}
                  >
                    <FaBell className="text-base" />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="right-scrollable">
          {/* Dynamic Service Info */}
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

            {/* ✅ Update latestReview on submission */}
            <h4 style={{ marginTop: "30px", fontWeight: "bold" }}>
              Write a Review
            </h4>
            <ReviewForm onNewReview={(review) => setLatestReview(review)} />

            {/* ✅ Pass latestReview to ReviewList */}
            <ReviewList newReview={latestReview} />
          </div>
        </div>
      </div>

      {/* Similar Services */}
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
