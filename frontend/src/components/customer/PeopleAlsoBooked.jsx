import { BsCurrencyRupee } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6"; // FontAwesome shopping cart
import "./PeopleAlsoBooked.css"; // Extracted CSS for maintainability

const SimilarProductCard = ({ product }) => (
  <div className="similar-card">
    <div className="similar-image">
      <img src={product.image} alt="DJ Service" />
    </div>

    <div className="similar-content">
      <h3 className="similar-title">Wedding DJ Service</h3>

      <div className="price-block">
        <div className="price">
          <BsCurrencyRupee />
          <span>{product.price}</span>
        </div>
        <div className="original-price">
          <BsCurrencyRupee />
          <span>{product.originalPrice}</span>
        </div>
        <div className="discount">40% off</div>
      </div>

      <div className="review-block">
        <div className="rating-badge">
          <span>{product.rating}</span>
          <IoIosStar />
        </div>
        <span className="review-text">{product.reviews} reviews</span>
      </div>

      <button className="similar-add-to-cart">
        <FaCartShopping />
        Add To Cart
      </button>
    </div>
  </div>
);

export default SimilarProductCard;
