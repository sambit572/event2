import { BsCurrencyRupee } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { FaHeart } from "react-icons/fa6"; // FontAwesome shopping cart
import "./PeopleAlsoBooked.css"; // Extracted CSSs for maintainability
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SimilarProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { categoryId } = useParams();
  // console.log("Category ID & Service ID:", categoryId, product._id);
  const handleClick = () => {
    navigate(`/service/${categoryId}/${product._id}`);
  };

  return (
    <div className="similar-card" onClick={handleClick}>
      <div className="similar-image">
        <img src={product.serviceImage[0]} alt="DJ Service" />
      </div>

      <div className="similar-container">
        <h3 className="similar-title">{product.serviceName}</h3>

        <div className="price-block">
          <div className="prices">
            <BsCurrencyRupee />
            <span>{product.minPrice}</span>
          </div>
          {/* <div className="original-prices">
            <BsCurrencyRupee />
            <span>{product.minPrice}</span>
          </div> */}
          <div className="discounts">40% off</div>
        </div>

        <div className="review-block">
          <div className="rating-badge">
            <span>4.5</span>
            <IoIosStar />
          </div>
          <span className="review-text">{product.reviews} reviews</span>
        </div>
        <Link
          to={`/service/${categoryId}/${product._id}`}
          className="viewBtn"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          View
        </Link>
        {/* <button  
          
        </button> */}
      </div>
    </div>
  );
};

export default SimilarProductCard;
