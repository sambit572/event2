import { BsCurrencyRupee } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { FaHeart } from "react-icons/fa6"; // FontAwesome shopping cart
import "./PeopleAlsoBooked.css"; // Extracted CSS for maintainability
import { useState } from "react";

const SimilarProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="similar-card">
      <div className="similar-image">
        <img src={product.image} alt="DJ Service" />
      </div>

      <div className="similar-container">
        <h3 className="similar-title">Wedding DJ Service</h3>

        <div className="price-block">
          <div className="prices">
            <BsCurrencyRupee />
            <span>{product.price}</span>
          </div>
          <div className="original-prices">
            <BsCurrencyRupee />
            <span>{product.originalPrice}</span>
          </div>
          <div className="discounts">40% off</div>
        </div>

        <div className="review-block">
          <div className="rating-badge">
            <span>{product.rating}</span>
            <IoIosStar />
          </div>
          <span className="review-text">{product.reviews} reviews</span>
        </div>

        <button
          className={`viewBtn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleClick}
        >
          <div>
            <FaHeart
              className="wishIcon"
              color={isWishlisted ? "red" : undefined}
            />
          </div>
          <div>{isWishlisted ? "Wishlisted" : "Add To Wishlist"}</div>
        </button>
      </div>
    </div>
  );
};

export default SimilarProductCard;
