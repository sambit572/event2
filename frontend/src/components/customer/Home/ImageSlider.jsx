import React from "react";
import Slider from "react-slick";

import "./ImageSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <picture>
              <source media="(min-width: 1024px)" srcSet={image.desktop} />
              <source media="(min-width: 768px)" srcSet={image.tablet} />
              <img
                className="slide"
                src={image.mobile}
                alt={`Slide ${index}`}
              />
            </picture>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
