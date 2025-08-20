import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import axios from "axios";
import "./ServiceDetails.css";

import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";
import RatingDetails from "../../components/customer/ServiceDetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/ServiceDetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/ServiceDetails/ServiceDetailCard.jsx";
import ReviewList from "../../components/customer/ServiceDetails/ReviewList";
import ReviewForm from "../../components/customer/ServiceDetails/ReviewForm.jsx";
import { BACKEND_URL } from "../../utils/constant.js";

const Service = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

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
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/userdetails");
    } else {
      onSwitchToLogin(true);
    }
  };
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("Parsed user from localStorage:", parsed); // 👈 check shape
      setCurrentUser(parsed);
    }
  }, []);

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
                  className="w-full sm:w-44 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={handleBookNow}
                >
                  Book Now
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

        {/* Right Section */}
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
                className="flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 text-sm sm:text-base md:text-lg"
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

      {/* Similar Services */}
      <div className="view-dj-section">
        <h2 className="people-also-book">People Also Booked</h2>
        <div className="view-dj">
          {similarServiceData.map((product) => (
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
