import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BACKEND_URL } from "../../../utils/constant";
import axios from "axios";

const SimilarProductCard = ({ product }) => {
  const [ratingData, setRatingData] = useState(null);
  const navigate = useNavigate();
  const { categoryId } = useParams();

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
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:border-blue-500 border"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative w-full max-w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100">
        <img
          decoding="async"
          loading="lazy"
          src={product.serviceImage[0]}
          alt="DJ Service"
          className="w-full h-full transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.serviceName}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <span className="text-black-700 font-semibold text-lg">
            ₹{product.minPrice}
          </span>
          <span className="text-black-700 font-semibold text-lg ml-1">
            - ₹{product.maxPrice}
          </span>
        </div>

        {/* Ratings */}
        {ratingData ? (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded-lg text-sm font-semibold">
              {ratingData.averageRating.toFixed(1)} ★
            </span>
            <span className="text-gray-500 text-sm">
              ({ratingData.totalReviews} reviews)
            </span>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-2">Loading rating...</p>
        )}

        {/* View button */}
        <Link
          to={`/service/${categoryId}/${product._id}`}
          className="flex items-center justify-center gap-2 mt-1 border-2 border-[#001f3f] text-[#001f3f] font-semibold px-5 py-1 rounded-lg shadow-md transition-all duration-300 hover:bg-[#001f3f] hover:text-white hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm sm:text-base md:text-lg"
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default SimilarProductCard;
