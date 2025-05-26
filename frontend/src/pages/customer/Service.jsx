import React, { useState } from "react";
import "../../pages/customer/Service.css";
import djimg1 from "../../assets/service/dj-img1.png";
import djimg2 from "../../assets/service/dj-img5.jpg";
import djimg3 from "../../assets/service/dj-img6.jfif";
import djimg4 from "../../assets/service/dj-img7.jfif";
import djimg8 from "../../assets/service/dj-img8.jfif";
import { FaCartShopping } from "react-icons/fa6";
import { MdPlayArrow } from "react-icons/md";
import { similarServiceData } from "../../components/customer/SimilarServiceData.jsx";
import ReviewList from "../../components/customer/ReviewList";
import RatingDetails from "../../components/customer/RatingDetails";
import SimilarProductCard from "../../components/customer/PeopleAlsoBooked";
import DJServiceCard from "../../components/customer/DJService/DJServiceCard.jsx";

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

  return (
    <div className="dj">
      <div className="dj-total-img">
        <div className="dj-img">
          <div className="thumbnail-list">
            {mediaList.map((media, index) => (
              <div key={index} onClick={() => setSelectMedia(media)} className="li1">
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
              <iframe src={selectMedia.src} title="selected-video" allowFullScreen />
            )}
          </div>
        </div>

        <div className="buttons">
          <button className="add-to-cart">
            <FaCartShopping /> Add To Cart
          </button>
          <button className="buynow">
            <MdPlayArrow /> Book Now
          </button>
        </div>
      </div>

      <div className="dj-about">
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
