import React, { useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'DJ Setup', price: 500 },
    { id: 2, name: 'Stage Lighting', price: 300 },
    { id: 3, name: 'Flower Decor', price: 200 }
  ]);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {items.map(item => (
        <div className="cart-item" key={item.id}>
          <span>{item.name}</span>
          <span>${item.price}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total:</strong> ${total}
      </div>
      <button className="checkout-btn">Checkout</button>
    </div>
  );
};

export default Cart;
