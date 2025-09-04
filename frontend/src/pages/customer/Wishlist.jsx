import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/wishlist/getwishlist`, {
          withCredentials: true,
        });
        setWishlist(res.data);
        console.log("Wishlist fetched successfully:", res.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

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
      <h1 className="text-3xl font-bold text-center text-[#002147] mb-8">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No services in wishlist
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {wishlist.map((item) => {
            const service = item.service;

            return (
              <div
                key={item._id}
                className="flex flex-col bg-gray-200 md:flex-row items-center gap-6 p-4 rounded-lg shadow border hover:shadow-md transition"
              >
                {/* Entire left section is clickable */}
                <Link
                  to={`/service/${service.serviceCategory}/${service._id}`}
                  className="flex flex-col md:flex-row gap-6 w-full hover:opacity-80"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/4 flex justify-center">
                    <img
                      src={
                        Array.isArray(item.service.serviceImage) &&
                        item.service.serviceImage.length > 0
                          ? service.serviceImage[0]
                          : "/default.jpg"
                      }
                      alt={service.serviceName}
                      className="w-60 h-40 object-cover rounded-md"
                    />
                  </div>

                  {/* Details */}
                  <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold mb-2 text-[#002147]">
                      {item.service.serviceName}
                    </h2>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-green-700 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="text-sm font-semibold">
                          {item.service.rating !== undefined
                            ? item.service.rating
                            : 0}
                        </span>
                        <FaStar className="text-white-500" />
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        item.service.available
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.service.available ? null : "Out Of Service"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {service.serviceDes}
                    </p>
                  </div>
                </Link>

                {/* Right: Price + Remove */}
                <div className="w-full md:w-1/4 flex md:flex-col items-end justify-between gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">
                      ₹{item.service.minPrice} - ₹{item.service.maxPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id, service._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
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
