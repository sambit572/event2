import React from 'react';
import "../../components/customer/ProductCard.css"

function ProductCard({ image, title, description, actualPrice,specialPrice,discount,rating,reviews,location,brand }) {
  return (
    <div className="product-card">
      <img src={image} alt="product" />
      <div className='sub-category'>
        <h2>{title}</h2>
        <div className='price'><span className='special-price'>{specialPrice}</span> <span className='actual-price'>{actualPrice}</span> <span className='discount'>{discount}</span></div>
        <div className='rate'><span className='ratings'>{rating}</span> <span className='reviews'>{reviews} reviews</span></div>
        <h3>Brand: {brand}</h3>
        <p className='paragraph'>{description}</p>
        <p>Location: {location}</p>
      </div>
    </div>
  );
}

export default ProductCard;
