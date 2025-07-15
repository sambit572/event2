import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

import "./ServiceDetails.css";

import { CategoryData } from "../../utils/CatogoryData.jsx";
import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";

import RatingDetails from "../../components/customer/ServiceDetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/ServiceDetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/ServiceDetails/ServiceCard.jsx";
import ReviewList from "../../components/customer/ServiceDetails/ReviewList";
import ReviewForm from "../../components/customer/ServiceDetails/ReviewForm.jsx";

const Service = () => {
  const { serviceId } = useParams();

  // Get the service object from CategoryData
  const service = CategoryData.flatMap((cat) => cat.services).find(
    (srv) => srv.id === serviceId
  );

  // If service not found
  if (!service) return <p>Service not found</p>;

  const mediaList = service.img.map((src) => ({ type: "image", src }));
  const [selectMedia, setSelectMedia] = useState(mediaList[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ✅ For syncing new review from ReviewForm to ReviewList
  const [latestReview, setLatestReview] = useState(null);

  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };

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
              <img src={selectMedia.src} alt="Selected media" />
            </div>
          </div>

          <div className="buttons">
            <button
              className={`viewBtns ${isWishlisted ? "wishlisted" : ""}`}
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

            <button className="buynow">Book Now</button>
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
          {similarServiceData.map((product) => (
            <SimilarProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
