import { BsCurrencyRupee } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { FaHeart } from "react-icons/fa6"; // FontAwesome shopping cart
import "./PeopleAlsoBooked.css"; // Extracted CSSs for maintainability
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../utils/constant";
import axios from "axios";
const SimilarProductCard = ({ product }) => {
    const [ratingData, setRatingData] = useState(null);
  const navigate = useNavigate();

  const { categoryId } = useParams();
  // console.log("Category ID & Service ID:", categoryId, product._id);
  const handleClick = () => {
    navigate(`/service/${categoryId}/${product._id}`);
  };
  const serviceId = product._id;
  useEffect(() => {
    const fetchRatingSummary = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/reviews/rating/${serviceId}`
        );
        if (res.data.success) {
          setRatingData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching rating summary:", err);
      }
    };

    if (serviceId) fetchRatingSummary();
  }, [serviceId]);

  return (
    <div className="similar-card" onClick={handleClick}>
      <div className="similar-image">
        <img src={product.serviceImage[0]} alt="DJ Service" />
      </div>

      <div className="similar-container">
        <h3 className="similar-title">{product.serviceName}</h3>

        <div className="price-block">
          <div className="prices">
            <span>₹{product.minPrice}</span> 
            <span className="ml-1">- ₹{product.maxPrice}</span>
          </div>
          {/* <div className="original-prices">
            <span>₹{product.maxPrice}</span>
          </div> */}
          {/* <div className="discounts">40% off</div> */}
        </div>

         {ratingData ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {ratingData.averageRating.toFixed(1)} ★
          </span>
          <span className="text-gray-500 text-sm">
            ({ratingData.totalReviews} reviews)
          </span>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-3">Loading rating...</p>
      )}
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
