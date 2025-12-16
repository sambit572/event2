import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [ratings, setRatings] = useState({}); // store ratings by serviceId

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const start = performance.now();
        const res = await axios.get(`${BACKEND_URL}/wishlist/getwishlist`, {
          withCredentials: true,
        });
        const end = performance.now();
        console.log(`wishlistFetch took ${end - start} ms`);

        setWishlist(res.data);
        console.log("Wishlist fetched successfully:", res.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  // Fetch rating for a specific service
  const fetchRatingSummary = async (serviceId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/reviews/rating/${serviceId}`);
      if (res.data.success) {
        setRatings((prev) => ({
          ...prev,
          [serviceId]: res.data.data,
        }));
      }
    } catch (err) {
      console.error(`Error fetching rating summary for ${serviceId}:`, err);
    }
  };

  // Delete wishlist item
  const handleDelete = async (id, serviceId) => {
    try {
      await axios.delete(`${BACKEND_URL}/wishlist/deleteWishlist/${id}`, {
        withCredentials: true,
      });

      setWishlist((prev) => prev.filter((item) => item._id !== id));

      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: { serviceId } })
      );

      console.log("Item removed and event dispatched:", serviceId);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-center text-[#002147] mb-2">
        Your Wishlist
      </h1>
      <div className="flex justify-center ">
        <div className="w-24 h-1 bg-[#002147] rounded-full"></div>
      </div>
      <div className="flex justify-center mt-1 mb-7">
        <div className="w-12 h-1 bg-[#004989] rounded-full"></div>
      </div>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No services in wishlist
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-6">
          {wishlist
            .filter((item) => item && item.service) // ✅ filter out null or missing services
            .map((item) => {
              const service = item.service;
              const ratingData = ratings[service._id];

              // Fetch rating only if not already loaded
              if (!ratingData) {
                fetchRatingSummary(service._id);
              }

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg hover:border-blue-600 transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  {/* Image */}
                  <Link
                    to={`/service/${service.serviceCategory}/${service._id}`}
                  >
                    <div className="relative">
                      <img
                        decoding="async"
                        loading="lazy"
                        src={
                          Array.isArray(service.serviceImage) &&
                          service.serviceImage.length > 0
                            ? service.serviceImage[0]
                            : "/default.webp"
                        }
                        alt={service.serviceName}
                        className="w-full h-44 object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
                          service.available
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {service.available ? "Available" : "Out of Service"}
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4 flex flex-col gap-2">
                    <Link
                      to={`/service/${service.serviceCategory}/${service._id}`}
                    >
                      <h2 className="text-lg mb-1 font-semibold text-[#002147] line-clamp-1">
                        {service.serviceName}
                      </h2>

                      {ratingData ? (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                            {ratingData.averageRating.toFixed(1)} ★
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({ratingData.totalReviews} reviews)
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          Loading rating...
                        </p>
                      )}
                      <p className="text-lg font-bold text-[#002147]">
                        ₹{service.minPrice} - ₹{service.maxPrice}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {service.serviceDes}
                      </p>
                    </Link>
                    {/* Remove Button */}
                    <button
                      onClick={() => handleDelete(item._id, service._id)}
                      className="mt-2 border-2 border-[#001f3f] hover:bg-gray-200 text-[#001f3f] font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
