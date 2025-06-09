import React, { useState } from "react";
import "./ServiceDetails.css";
import djimg1 from "../../assets/service/sub-img1.avif";
import djimg2 from "../../assets/service/sub-img2.webp";
import djimg3 from "../../assets/service/sub-img3.jpg";
import djimg4 from "../../assets/service/sub-img4.jpg";
import djimg8 from "../../assets/service/sub-img4.jpg";
import { FaHeart } from "react-icons/fa6";
import { similarServiceData } from "../../components/customer/ServiceDetails/SimilarServiceData.jsx";

import RatingDetails from "../../components/customer/ServiceDetails/RatingDetails.jsx";
import SimilarProductCard from "../../components/customer/ServiceDetails/PeopleAlsoBooked.jsx";
import DJServiceCard from "../../components/customer/ServiceDetails/ServiceCard.jsx";
// import RatingBar from "../../components/customer/RatingBar.jsx";
import ReviewList from "./../../components/customer/ServiceDetails/ReviewList";

const Service = () => {
  const mediaList = [
    { type: "image", src: djimg1 },
    { type: "video", src: "https://www.youtube.com/embed/QRB1bNIc5G4" },
    { type: "image", src: djimg2 },
    { type: "image", src: djimg3 },
    { type: "image", src: djimg4 },
    { type: "image", src: djimg8 },
  ];

  const [selectMedia, setSelectMedia] = useState(mediaList[0]);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };

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
                  {media.type === "image" ? (
                    <img src={media.src} alt={`media-${index}`} />
                  ) : (
                    <iframe src={media.src} title="video-thumb" />
                  )}
                </div>
              ))}
            </div>
            <div className="big-image">
              {selectMedia.type === "image" ? (
                <img src={selectMedia.src} alt="Selected media" />
              ) : (
                <iframe
                  src={selectMedia.src}
                  title="selected-video"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          <div className="buttons">
            <button className="add-to-cart" onClick={handleClick}>
              <div className="heartIcon">
                <FaHeart
                  color={isWishlisted ? "red" : "black"}
                  className="wishIcons"
                />{" "}
              </div>
              Add To Wishlist
            </button>
            <button className="buynow">Book Now</button>
          </div>
        </div>

        <div className="right-scrollable">
          <DJServiceCard />
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
            <ReviewList />
          </div>
        </div>
      </div>

      <div className="view-dj-section">
        <h2>People Also Booked</h2>
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
