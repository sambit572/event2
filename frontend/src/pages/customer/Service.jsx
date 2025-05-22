import React, { useState } from "react";
import "./Service.css";
// const product = {
//   id: 1,
//   title: "Product Title",
//   description:
//     "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime aliquid rerum a? Fugiat soluta facilis deleniti voluptatibus ab architecto dolores a, vero, beatae veniam error doloribus quia laudantium? Error fuga consequuntur quia accusantium? Consequatur modi laboriosam saepe culpa, ab atque.",
//   price: 9.99,
//   images: [
//     "https://placehold.co/500x500?font=roboto",
//     "https://placehold.co/400x400?font=roboto",
//     "https://placehold.co/300x300?font=roboto",
//     "https://placehold.co/200x200?font=roboto",
//   ],
//   stock: 10,
// };

const Service = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <section className=" single_service">
      <div className="align_center">
        <div className="single_service_thumbnail">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.title}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? "selected_image" : ""}
            />
          ))}
        </div>
        <img
          src={product.images[selectedImage]}
          alt=""
          className="single_service_display"
        />
        <div className="service_description">
          <h2>Description</h2>
        </div>
      </div>
    </section>
  );
};

export default Service;
