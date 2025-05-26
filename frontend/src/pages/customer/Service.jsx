import React, { useState } from "react";
import "./Service.css";
import djimg1 from "../../assets/service/dj-img1.png";
import djimg2 from "../../assets/service/dj-img5.jpg";
import djimg3 from "../../assets/service/dj-img6.jfif";
import djimg4 from "../../assets/service/dj-img7.jfif";
import djimg8 from "../../assets/service/dj-img8.jfif";
import { FaCartShopping } from "react-icons/fa6";
import { MdPlayArrow } from "react-icons/md";
// import { IoIosStar } from "react-icons/io";
// import { BsCurrencyRupee } from "react-icons/bs";
import { similarServiceData } from "../../components/customer/SimilarServiceData.jsx";
import ReviewList from "../../components/customer/ReviewList";
import RatingDetails from "../../components/customer/RatingDetails";
import SimilarProductCard from "../../components/customer/PeopleAlsoBooked";
import DJServiceCard from "../../components/customer/DJService/DJServiceCard.jsx";

const Service = () => {
  const mediaList = [
    { type: "image", src: djimg1, alt: "img1" },
    {
      type: "video",
      src: "https://www.youtube.com/embed/QRB1bNIc5G4",
      alt: "img1",
    },
    { type: "image", src: djimg2, alt: "img1" },
    { type: "image", src: djimg3, alt: "img1" },
    { type: "image", src: djimg4, alt: "img1" },
    { type: "image", src: djimg8, alt: "img1" },
  ];

  const [selectMedia, setSelectMedia] = useState(mediaList[0]);

  return (
    <div>
      <div className="dj">
        <div className="dj-total-img">
          <div className="dj-img">
            <div>
              {mediaList.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setSelectMedia(media)}
                  className="li1"
                >
                  {media.type === "image" ? (
                    <img src={media.src} />
                  ) : (
                    <iframe
                      src={media.src}
                      style={{ height: "90px", width: "65px" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="big-image">
              {selectMedia.type === "image" ? (
                <img
                  src={selectMedia.src}
                  style={{
                    height: "500px",
                    width: "350px",
                    marginLeft: "70px",
                    marginTop: "55px",
                  }}
                />
              ) : (
                <iframe src={selectMedia.src} controls autoPlay />
              )}
            </div>
          </div>
          <div>
            <button className="add-to-cart">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
            <button className="buynow">
              <MdPlayArrow style={{ marginRight: "8px" }} />
              Book Now
            </button>
          </div>
        </div>
        <div className="dj-about">
          <div>
            <DJServiceCard />
          </div>
          <div
            style={{
              border: "1px solid lightgrey",
              borderRadius: "5px",
              height: "200px",
              padding: "30px",
              marginTop: "15px",
            }}
          >
            <h2>Why Choose Us?</h2>
            <li className="li2">5-Star Rated Wedding DJs</li>
            <li className="li2">Backup Equipment Always On-Hand</li>
            <li className="li2">Experience With All Cultures & Traditions</li>
            <li className="li2">Custom Packages & Friendly Support</li>
          </div>

          <div
            style={{
              width: "700px",
              padding: "20px",
              border: "1px solid lightgray",
              marginTop: "20px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ fontSize: "25px", marginBottom: "20px" }}>
              DJ Ratings & Reviews
            </h3>
            <RatingDetails />
            <hr style={{ marginTop: "15px", color: "gray" }} />
            <ReviewList />
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginLeft: "20px" }}>People Also Booked</h2>
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
