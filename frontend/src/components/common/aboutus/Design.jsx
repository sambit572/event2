import React from "react";
import "./design.css";
import chatIcon from "../../../assets/serverLogo.png";
import offers from "../../../assets/aboutus/offer_img.jpeg";
import wedding from "../../../assets/aboutus/wedding.jpeg";
import party from "../../../assets/aboutus/party.jpeg";
import tenthouse from "../../../assets/aboutus/tenthouse.jpeg";
import catering from "../../../assets/aboutus/catering_service_img.jpg";
import horseCart from "../../../assets/aboutus/horsecart.jpeg";
import magician from "../../../assets/aboutus/magician.jpeg";
import flowers from "../../../assets/aboutus/flowers.jpeg";

const Design = () => {
  return (
    <div className="container-design">
      <h1 className="headingdesign">What's waiting for you on the app?</h1>

      <div className="features-diagonal-layout">
        {/* Left Diagonal Features */}
        <div className="features-diagonal features-left">
          <img src={flowers} className="feature feature-1"></img>
          <img src={magician} className="feature feature-2"></img>
          <img src={party} className="feature feature-3"></img>
          <img src={wedding} className="feature feature-4"></img>
        </div>

        {/* Phone in Center */}
        <div className="phone-wrapper">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <div className="phone-content phone-content-p">
              <img
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
          <img src={horseCart} className="feature feature-1"></img>
          <img className="feature feature-2" src={offers} />
          <img src={tenthouse} className="feature feature-3"></img>
          <img src={catering} className="feature feature-4"></img>
        </div>
      </div>
    </div>
  );
};

export default Design;
