import React from "react";
import CartData from "./CartData";
import "./AddToCart.css";

const AddToCart = () => {
  const listedTotal = CartData.reduce((acc, item) => acc + item.originalPrice, 0);
  const finalTotal = CartData.reduce((acc, item) => acc + item.price, 0);
  const discount = listedTotal - finalTotal;
  const cgst = Math.round(finalTotal * 0.05);
  const sgst = Math.round(finalTotal * 0.05);
  const grandTotal = finalTotal + cgst + sgst;

  return (
    <div className="add-to-cart-main-container">
      <h2 className="cart-heading">Your Cart</h2>

      <div className="cart-content">
        <div className="cart-left">
          {CartData.map((item) => (
            <div className="cart-card" key={item.id}>
              <div className="cart-img-box">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-info-box">
                <h4>{item.name}</h4>
                <p className="vendor"> {item.vendor}</p>
                <p className="desc">{item.description}</p>

                <div className="cart-price-row">
                  <div className="price">₹{item.price}</div>
                  <div className="original-price">₹{item.originalPrice}</div>
                  <div className="discount">{item.discountPercent}% off</div>
                </div>

                <div className="rating">
                  <span>{item.rating}★</span> ({item.reviewsCount} reviews)
                </div>

                <button className="remove-btn">REMOVE</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-right sticky-summary">
          <h4>ORDER SUMMARY</h4>
          <div className="summary-box">
            <div className="summary-item">
              <span>Listed Price</span>
              <span>₹{listedTotal}</span>
            </div>
            <div className="summary-item">
              <span>Discounted Price</span>
              <span>₹{finalTotal}</span>
            </div>
            <div className="summary-item small">
              Discount <span>₹{discount}</span>
            </div>
            <div className="summary-item">
              <span>CGST</span>
              <span>₹{cgst}</span>
            </div>
            <div className="summary-item">
              <span>SGST</span>
              <span>₹{sgst}</span>
            </div>
            <div className="summary-total">
              <span>Total Price</span>
              <span>₹{grandTotal}</span>
            </div>
            <p className="you-saved">You saved ₹{discount}</p>

            <button className="place-order-btn">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
