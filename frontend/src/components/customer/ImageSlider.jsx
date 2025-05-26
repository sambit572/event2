import React from "react";
import Slider from "react-slick";

import "./ImageSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        color: "white",
        border: "none",
        padding: "20px 25px 35px 5px",
        cursor: "pointer",
        right: "10px",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        color: "white",
        border: "none",
        padding: "20px 25px 35px 5px",
        cursor: "pointer",
        left: "10px",
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
}

const ImageSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img className="slide" src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
