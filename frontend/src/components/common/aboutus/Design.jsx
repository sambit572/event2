import React from "react";
import "./Design.css";
import chatIcon from "../../../assets/serverLogo.webp";
import offers from "../../../assets/aboutUs/offer_img.webp";
import wedding from "../../../assets/aboutUs/WEDDING.webp";
import party from "../../../assets/aboutUs/PARTY.webp";
import tenthouse from "../../../assets/aboutUs/TENTHOUSE.webp";
import catering from "../../../assets/aboutUs/catering_service_img.webp";
import horseCart from "../../../assets/aboutUs/HORSECART.webp";
import magician from "../../../assets/aboutUs/MAGICIAN.webp";
import flowers from "../../../assets/aboutUs/FLOWERS.webp";

const Design = () => {
  return (
    <div className="container-design">
      <h1 className="headingdesign">What's waiting for you on the app?</h1>

      <div className="features-diagonal-layout">
        {/* Left Diagonal Features */}
        <div className="features-diagonal features-left">
          <img
            decoding="async"
            loading="lazy"
            src={flowers}
            className="feature feature-1"
          ></img>
          <img
            decoding="async"
            loading="lazy"
            src={magician}
            className="feature feature-2"
          ></img>
          <img decoding="async" src={party} className="feature feature-3"></img>
          <img
            decoding="async"
            loading="lazy"
            src={wedding}
            className="feature feature-4"
          ></img>
        </div>

        {/* Phone in Center */}
        <div className="phone-wrapper">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="phone-content phone-content-p">
              <img
                decoding="async"
                loading="lazy"
                className="chat-icon-about-us"
                src={chatIcon}
                alt="chat-icon"
              />
              Schedule your booking today
            </div>
          </div>
        </div>

        {/* Right Diagonal Features */}
        <div className="features-diagonal features-right">
          <img
            decoding="async"
            loading="lazy"
            src={horseCart}
            className="feature feature-1"
          ></img>
          <img decoding="async" className="feature feature-2" src={offers} />
          <img
            decoding="async"
            loading="lazy"
            src={tenthouse}
            className="feature feature-3"
          ></img>
          <img
            decoding="async"
            loading="lazy"
            src={catering}
            className="feature feature-4"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Design;
