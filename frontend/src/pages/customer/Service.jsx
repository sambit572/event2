import React, { useState } from "react";
import "./Service.css";
import djimg1 from "../../assets/service/dj-img1.png";
import djimg2 from "../../assets/service/dj-img5.jpg";
import djimg3 from "../../assets/service/dj-img6.jfif";
import djimg4 from "../../assets/service/dj-img7.jfif";
import djimg8 from "../../assets/service/dj-img8.jfif";
import { FaCartShopping } from "react-icons/fa6";
import { MdPlayArrow } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { BsCurrencyRupee } from "react-icons/bs";
import similarimg1 from "../../assets/service/similar-dj-img1.jfif";
import similarimg2 from "../../assets/service/similar-dj-img2.jfif";
import similarimg3 from "../../assets/service/similar-dj-img3.jpg";
import similarimg4 from "../../assets/service/similar-dj-img4.jpg";
import similarimg5 from "../../assets/service/similar-dj-img5.jpg";
import { BiLike } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";


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

  const ratingsData = {
    averageRating: 4.0,
    totalRatings: 81168,
    totalReviews: 20880,
    breakdown: [
      { label: "Excellent", count: 41292, color: "#007e33" },
      { label: "Very Good", count: 18605, color: "#00C851" },
      { label: "Good", count: 9784, color: "#ffbb33" },
      { label: "Average", count: 3692, color: "#ff4444" },
      { label: "Poor", count: 7795, color: "#CC0000" },
    ],
  };

  const RatingBar = ({ label, count, max, color }) => {
    const widthPercent = ((count / max) * 100).toFixed(1);
    return (
      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{label}</span>
          <span>{count}</span>
        </div>
        <div
          style={{ height: "10px", background: "#ccc", borderRadius: "4px" }}
        >
          <div
            style={{
              width: `${widthPercent}%`,
              height: "100%",
              backgroundColor: color,
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>
    );
  };

  const maxCount = Math.max(...ratingsData.breakdown.map((r) => r.count));

  const reviews = [
    {
      name: "Shashank Mehra",
      rating: 5,
      label: "Very Good",
      date: "25 Nov, 2024",
      text: "Very good quality I liked it",
      images: [djimg2, djimg1, djimg4],
      helpful: 44,
    },
    {
      name: "Meesho User",
      rating: 5,
      label: "Very Good",
      date: "21 days ago",
      text: "Achi hai",
      images: [djimg3, similarimg4, similarimg3, djimg3],
      helpful: 1,
    },
    {
      name: "Meesho User",
      rating: 5,
      label: "Very Good",
      date: "16 Apr, 2025",
      text: "Bahut cute achcha tha thank you",
      images: [similarimg4, similarimg3],
      helpful: 0,
    },
  ];

  const ReviewCard = ({ review }) => (
    <div style={{ borderBottom: "1px solid #eee", padding: "16px 0" }}>
      <h4 style={{ marginBottom: "8px" }}>{review.name}</h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            backgroundColor: "#008000",
            color: "white",
            padding: "4px 8px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <AiFillStar size={14} style={{ marginRight: "4px" }} />{" "}
          {review.rating}
        </div>
        <span>{review.label}</span>
        <span style={{ color: "#666" }}>• Posted on {review.date}</span>
      </div>
      <p style={{ fontSize: "14px", marginBottom: "8px" }}>{review.text}</p>
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        {review.images.map((img, idx) => (
          <div
            key={idx}
            style={{
              width: "45px",
              height: "60px",
              backgroundColor: "#ccc",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <img
              src={img}
              alt={`review-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#555",
          fontSize: "14px",
        }}
      >
        <BiLike /> Helpful{review.helpful ? ` (${review.helpful})` : ""}
      </div>
    </div>
  );
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
                  style={{ height: "500px", width: "350px",marginLeft:"70px",marginTop:"55px" }}
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
          <div
            style={{
              border: "1px solid lightgrey",
              borderRadius: "5px",
              height: "650px",
              padding: "30px",
            }}
          >
            <h2>Wedding DJ Service – Premium Entertainment for Your Big Day</h2>

            <div className="price">
              <div className="rupee">
                <div
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "26px",
                    marginLeft: "30px",
                    marginTop: "15px",
                  }}
                >
                  <BsCurrencyRupee style={{ fontSize: "25px" }} />{" "}
                  <span>10000</span>
                </div>
              </div>

              <div className="rupee1">
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px",
                    marginLeft: "100px",
                    marginTop: "15px",
                  }}
                >
                  <BsCurrencyRupee style={{ fontSize: "20px" }} />{" "}
                  <span>15000</span>
                </div>
              </div>
              <h2
                style={{
                  color: "green",
                  marginLeft: "80px",
                  textAlign: "center",
                  marginTop: "15px",
                }}
              >
                40% off
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "19px", fontWeight: "400" }}
              >
                3901 rating, 560 reviews
              </span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: "600" }}>
              <span>Brand :</span> Wedding DJ Service
            </div>
            <p className="para">
              A DJ component refers to a piece of equipment or software used by
              DJs (disc jockeys) to manipulate, mix, and perform music.
            </p>
            <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
            <div
              style={{
                marginTop: "15px",
              }}
            >
              <h2 style={{ marginBottom: "10px" }}>DJ Details</h2>
              <p className="para1">
                {" "}
                DJ Name : Elegant Beats Wedding DJ Package{" "}
              </p>
              <p className="para1">
                {" "}
                Category : Event Entertainment / DJ Services
              </p>
              <p className="para1">
                Ideal For : Weddings, Engagements,Receptions
              </p>

              <h3 style={{ marginBottom: "10px", marginTop: "10px" }}>
                What’s Included:
              </h3>

              <li className="li">1 Professional Wedding DJ </li>
              <li className="li"> 1 MC Host (can be the DJ)</li>
              <li className="li"> Sound System & Lights </li>
              <li className="li"> Pre-Wedding Music Planning Call</li>
              <li className="li"> Ceremony + Reception + Party Coverage</li>
            </div>
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
            <div style={{ display: "flex" }}>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#007e33",
                  marginTop: "25px",
                }}
              >
                {ratingsData.averageRating.toFixed(1)}
                <span
                  style={{
                    fontSize: "24px",
                    color: " green",
                    marginLeft: "5px",
                  }}
                >
                  ★
                </span>
                <p
                  style={{ color: "gray", fontSize: "15px", marginTop: "10px" }}
                >
                  <p>{ratingsData.totalRatings} Ratings,</p>{" "}
                  {ratingsData.totalReviews} Reviews
                </p>
              </div>

              <div style={{ width: "350px", marginLeft: "35px" }}>
                {ratingsData.breakdown.map((item, index) => (
                  <RatingBar
                    key={index}
                    label={item.label}
                    count={item.count}
                    max={maxCount}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
            <hr style={{ marginTop: "15px", color: "gray" }} />
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "20px",
              }}
            >
              {reviews.map((rev, i) => (
                <ReviewCard key={i} review={rev} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginLeft: "20px" }}>People Also Booked</h2>
        <div className="view-dj">
          <div className="similar-img2">
             <div className="image">
            <img src={similarimg1} alt="" />
            </div>
            <div style={{ padding: "8px" }}>
              <h3>Wedding DJ Service</h3>

              <div className="price">
                <div className="rupee">
                  <div
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "20px",
                      
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "17px" }} />{" "}
                    <span>10000</span>
                  </div>
                </div>

                <div className="rupee1">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "15px",
                     
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "13px" }} />{" "}
                    <span style={{fontSize:"13px"}}>15000</span>
                  </div>
                </div>
                <h2
                  style={{
                    color: "green",
                    marginLeft: "17px",
                    textAlign: "center",
                   fontSize:"17px"
                  }}
                >
                  40% off
                </h2>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "10px",
              }}
            >
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "17px", fontWeight: "400" }}
              >
                560 reviews
              </span>
            </div>
            <button className="add-to-cart1">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
          </div>
          <div className="similar-img2">
             <div className="image">
            <img src={similarimg2} alt="" />
            </div>
            <div style={{ padding: "8px" }}>
              <h3>Wedding DJ Service</h3>
              <div className="price">
                <div className="rupee">
                  <div
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "20px",
                      
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "17px" }} />{" "}
                    <span>10000</span>
                  </div>
                </div>

                <div className="rupee1">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "15px",
                     
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "13px" }} />{" "}
                    <span style={{fontSize:"13px"}}>15000</span>
                  </div>
                </div>
                <h2
                  style={{
                    color: "green",
                    marginLeft: "17px",
                    textAlign: "center",
                   fontSize:"17px"
                  }}
                >
                  40% off
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "10px",
              }}
            >
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "17px", fontWeight: "400" }}
              >
                560 reviews
              </span>
            </div>
            <button className="add-to-cart1">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
          </div>
          <div className="similar-img2">
             <div className="image">
            <img src={similarimg3} alt="" />
            </div>
            <div style={{ padding: "8px" }}>
              <h3>Wedding DJ Service</h3>
              <div className="price">
                <div className="rupee">
                  <div
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "20px",
                      
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "17px" }} />{" "}
                    <span>10000</span>
                  </div>
                </div>

                <div className="rupee1">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "15px",
                     
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "13px" }} />{" "}
                    <span style={{fontSize:"13px"}}>15000</span>
                  </div>
                </div>
                <h2
                  style={{
                    color: "green",
                    marginLeft: "17px",
                    textAlign: "center",
                   fontSize:"17px"
                  }}
                >
                  40% off
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "10px",
              }}
            >
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "17px", fontWeight: "400" }}
              >
                560 reviews
              </span>
            </div>
            <button className="add-to-cart1">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
          </div>
          <div className="similar-img2">
             <div className="image">
            <img src={similarimg4} alt="" />
            </div>
            <div style={{ padding: "8px" }}>
              <h3>Wedding DJ Service</h3>
              <div className="price">
                <div className="rupee">
                  <div
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "20px",
                      
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "17px" }} />{" "}
                    <span>10000</span>
                  </div>
                </div>

                <div className="rupee1">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "15px",
                     
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "13px" }} />{" "}
                    <span style={{fontSize:"13px"}}>15000</span>
                  </div>
                </div>
                <h2
                  style={{
                    color: "green",
                    marginLeft: "17px",
                    textAlign: "center",
                   fontSize:"17px"
                  }}
                >
                  40% off
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "10px",
              }}
            >
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "17px", fontWeight: "400" }}
              >
                560 reviews
              </span>
            </div>
            <button className="add-to-cart1">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
          </div>
          <div className="similar-img2">
            <div className="image">
            <img src={similarimg5} alt="" />
            </div>
            <div style={{ padding: "8px" }}>
              <h3>Wedding DJ Service</h3>
              <div className="price">
                <div className="rupee">
                  <div
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "20px",
                      
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "17px" }} />{" "}
                    <span>10000</span>
                  </div>
                </div>

                <div className="rupee1">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      marginLeft: "15px",
                     
                    }}
                  >
                    <BsCurrencyRupee style={{ fontSize: "13px" }} />{" "}
                    <span style={{fontSize:"13px"}}>15000</span>
                  </div>
                </div>
                <h2
                  style={{
                    color: "green",
                    marginLeft: "17px",
                    textAlign: "center",
                   fontSize:"17px"
                  }}
                >
                  40% off
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: "10px",
              }}
            >
              <div className="rating">
                <div>4 </div>
                <div>
                  <IoIosStar />
                </div>
              </div>
              <span
                style={{ color: "black", fontSize: "17px", fontWeight: "400" }}
              >
                560 reviews
              </span>
            </div>
            <button className="add-to-cart1">
              <FaCartShopping style={{ marginRight: "8px" }} />
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
