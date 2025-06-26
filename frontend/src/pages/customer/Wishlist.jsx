import React, { useState } from 'react';
import './Wishlist.css';
import { FaTrash } from 'react-icons/fa';


const wishlistData = [
  {
    id: 1,
    title: 'Dream Frame Studio',
    price: '₹ 6,200',
    oldPrice: '10,000',
    discount: '20% Off',
    description:
      'Lorem ipsum dolour sit a met, connecter adipescnt elite, sed do temper incident ut labore et dolore magna aliquant. Ut denim ad minim venial, quiz nostrum exercitation.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  },
  {
    id: 2,
    title: 'Sunlight Portraits',
    price: '₹ 4,800',
    oldPrice: '8,000',
    discount: '40% Off',
    description:
      'Lorem ipsum dolour sit a met, connecter adipescnt elite, sed do temper incident ut labore et dolore magna aliquant. Ut denim ad minim venial, quiz nostrum exercitation.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  },
  {
    id: 3,
    title: 'Nature Clicks',
    price: '₹ 5,500',
    oldPrice: '9,000',
    discount: '38% Off',
    description:
      'Lorem ipsum dolour sit a met, connecter adipescnt elite, sed do temper incident ut labore et dolore magna aliquant. Ut denim ad minim venial, quiz nostrum exercitation.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  },
  {
    id: 4,
    title: 'Studio Flash Pro',
    price: '₹ 7,000',
    oldPrice: '12,000',
    discount: '42% Off',
    description:
      'Lorem ipsum dolour sit a met, connecter adipescnt elite, sed do temper incident ut labore et dolore magna aliquant. Ut denim ad minim venial, quiz nostrum exercitation.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312',
  },
];
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(wishlistData);
  const [popupVisible, setPopupVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [flippingOut, setFlippingOut] = useState(false);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setPopupVisible(true);
    setFlippingOut(false); // Reset flip state
  };

  const confirmDelete = () => {
    setFlippingOut(true);
    setTimeout(() => {
      setWishlistItems((items) => items.filter((item) => item.id !== itemToDelete));
      setPopupVisible(false);
      setItemToDelete(null);
    }, 600); // matches animation duration
  };

  const cancelDelete = () => {
    setFlippingOut(true);
    setTimeout(() => {
      setPopupVisible(false);
      setItemToDelete(null);
    }, 600);
  };

  return (
    <div className="wishlist-container">
      <h1 className="text-4xl font-bold text-[#001f3f] mb-8 text-center">My Wishlist</h1>
      <p className="text-gray-600 ml-20 relative bottom-5 text-lg inline text-center max-w-2xl mx-auto mb-10">
        Here's a list of your saved services. You can book them anytime or remove the ones you no longer need.
      </p>
      {wishlistItems.map((item) => (
        <div className="wishlist-card" key={item.id}>
          <div className="wishlist-left">
            <img src={item.image} alt={item.title} className="wishlist-image" />
          </div>
          <div className="wishlist-right">
            <div className="wishlist-header">
              <h3 className="wishlist-title">{item.title}</h3>
            </div>
            <div className="wishlist-pricing">
              <span className="wishlist-price">{item.price}</span>
              <span className="wishlist-old-price">{item.oldPrice}</span>
              <span className="wishlist-discount">{item.discount}</span>
            </div>
            <p className="wishlist-description">{item.description}</p>
            <div className='btn-columns'>
              <button className="wishlist-book-btn"><a href="userdetails">Book Now</a></button>
              <button className="wishlist-remove-btn" onClick={() => handleDeleteClick(item.id)} >Remove</button>
            </div>
          </div>
        </div>
      ))}

      {popupVisible && (
        <div className="wishlist-popup-overlay">
          <div className={`wishlist-popup-box ${flippingOut ? 'flip-out' : 'flip-in'}`}>
            <p>
              Are you sure you want to delete this?
            </p>
            <div className="wishlist-popup-buttons">
              <button className="wishlist-popup-yes" onClick={confirmDelete}>
                Remove
              </button>
              <button className="wishlist-popup-no" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;