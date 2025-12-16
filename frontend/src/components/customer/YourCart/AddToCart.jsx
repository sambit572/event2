import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../utils/constant";
import { useDispatch } from "react-redux";
import { setCartCount, decrementCartCount } from "../../../redux/UserSlice.js";

const AddToCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/cart`, {
        withCredentials: true,
      });

      console.log("📦 Cart response:", response.data);

      if (response.data.success) {
        setItems(response.data.data);
        dispatch(setCartCount(response.data.data.length));
      }
    } catch (error) {
      console.error("❌ Failed to fetch cart items:", error);
      toast.error("Could not load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // ✅ FIXED: Handle remove item using cart item's _id
  const handleRemoveItem = async (cartItemId) => {
    try {
      console.log("🗑️ Removing cart item:", cartItemId);

      // Optimistically update UI
      const previousItems = [...items];
      setItems(items.filter((item) => item._id !== cartItemId));
      dispatch(decrementCartCount());

      // Make API call
      const response = await axios.delete(`${BACKEND_URL}/cart/${cartItemId}`, {
        withCredentials: true,
      });

      console.log("✅ Remove response:", response.data);

      toast.success("Item removed from cart!");

      // Sync with backend
      await fetchCartItems();
    } catch (error) {
      console.error("❌ Failed to remove item:", error);

      // Rollback on error
      await fetchCartItems();

      toast.error("Could not remove item. Please try again.");
    }
  };

  // Group catering items by service
  const groupedItems = items.reduce((acc, item) => {
    if (item.isCateringService) {
      const serviceId = item.serviceId._id;
      if (!acc[serviceId]) {
        acc[serviceId] = {
          service: item.serviceId,
          packages: [],
        };
      }
      acc[serviceId].packages.push(item);
    } else {
      // Regular services go under their own cart item ID
      acc[item._id] = { regularItem: item };
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading your cart...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-12 min-h-screen mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-wide">
          Your <span className="text-black">Cart</span>
        </h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="max-h-[70vh] overflow-y-auto">
          {Object.entries(groupedItems).map(([key, group]) => {
            // Render regular (non-catering) service
            if (group.regularItem) {
              const item = group.regularItem;
              const isAvailable = item.serviceId?.available !== false;

              let displayPrice = "Price: N/A";
              if (item.serviceId?.minPrice && item.serviceId?.maxPrice) {
                if (item.serviceId.minPrice === item.serviceId.maxPrice) {
                  displayPrice = `Price: ₹${item.serviceId.minPrice}`;
                } else {
                  displayPrice = `Price: ₹${item.serviceId.minPrice} - ₹${item.serviceId.maxPrice}`;
                }
              }

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start gap-4 border border-gray-300 rounded-2xl shadow-xl p-5 mb-6 bg-gray-100"
                >
                  <div className="relative w-full sm:w-36 h-[15rem] sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      decoding="async"
                      loading="lazy"
                      src={
                        item.serviceId?.serviceImage?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.serviceId?.serviceName}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        !isAvailable ? "grayscale brightness-75" : ""
                      }`}
                    />

                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="rounded-md bg-red-600 px-4 py-1.5 text-center shadow-lg">
                          <p className="text-xs font-bold text-white">
                            OUT OF SERVICE
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between sm:ml-5 flex-1">
                    <div>
                      <div className="flex justify-between items-start gap-4 mt-[14px] sm:mt-0">
                        <h4 className="text-xl font-extrabold text-black-700 tracking-wide leading-snug">
                          {item.serviceId?.serviceName || "Unnamed Service"}
                        </h4>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-[14px] mt-2 mb-2 text-gray-500 font-medium">
                        {item.serviceId?.locationOffered?.[0] || "No location"}
                      </p>
                      <p className="text-[15px] text-gray-700 font-normal leading-relaxed tracking-wide">
                        {item.serviceId?.serviceDes?.substring(0, 100) ||
                          "No description"}
                        ...
                      </p>

                      {!isAvailable && (
                        <div className="mt-3">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-lg font-bold text-black-700">
                        {displayPrice}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Render catering service with grouped packages
            const { service, packages } = group;
            const isAvailable = service?.available !== false;

            // ✅ FIXED: Properly calculate total price from packages
            const totalPrice = packages.reduce((sum, pkg) => {
              const pkgTotal = pkg.cateringDetails?.totalPrice || 0;
              console.log(
                `📊 Package ${pkg.cateringDetails?.packageName}: ₹${pkgTotal}`
              );
              return sum + pkgTotal;
            }, 0);

            console.log(
              `🎯 Service Total for ${service?.serviceName}: ₹${totalPrice}`
            );

            return (
              <div
                key={key}
                className="border-2 border-blue-200 rounded-2xl shadow-xl p-5 mb-6 bg-gradient-to-br from-blue-50 to-white"
              >
                {/* Service Header */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 pb-4 border-b-2 border-blue-100">
                  <div className="relative w-full sm:w-36 h-[15rem] sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      decoding="async"
                      loading="lazy"
                      src={
                        service?.serviceImage?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={service?.serviceName}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        !isAvailable ? "grayscale brightness-75" : ""
                      }`}
                    />

                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="rounded-md bg-red-600 px-4 py-1.5 text-center shadow-lg">
                          <p className="text-xs font-bold text-white">
                            OUT OF SERVICE
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xl font-extrabold text-blue-700 tracking-wide leading-snug">
                          {service?.serviceName || "Unnamed Service"}
                        </h4>
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          🍽️ Catering Service
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mt-2 text-gray-500 font-medium">
                      {service?.locationOffered?.[0] || "No location"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {service?.serviceDes?.substring(0, 80) ||
                        "No description"}
                      ...
                    </p>

                    {!isAvailable && (
                      <div className="mt-2">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                          Currently Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package List */}
                <div className="space-y-3">
                  <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Selected Packages ({packages.length})
                  </h5>

                  {packages.map((pkg) => {
                    const pkgPrice = pkg.cateringDetails?.totalPrice || 0;
                    const pkgPlates = pkg.cateringDetails?.plateCount || 0;
                    const pkgPricePerPlate =
                      pkg.cateringDetails?.pricePerPlate || 0;

                    return (
                      <div
                        key={pkg._id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h6 className="font-bold text-gray-800">
                                {pkg.cateringDetails?.packageName || "Package"}
                              </h6>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                ₹{pkgPricePerPlate}/plate
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Plates:</span>
                                {pkgPlates}
                              </span>
                              <span className="text-gray-300">|</span>
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold text-green-600">
                                  ₹{pkgPrice}
                                </span>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(pkg._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Service Total */}
                {/*    <div className="mt-4 pt-4 border-t-2 border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">
                      Service Total:
                    </span>
                    <span className="text-2xl font-extrabold text-blue-700">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div> */}
              </div>
            );
          })}
        </div>

        {/* Grand Total & Next Button */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
          {/*   <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-800">
              Cart Total:
            </span>
            <span className="text-3xl font-extrabold text-blue-700">
              ₹{items.reduce((total, item) => {
                if (item.isCateringService) {
                  return total + (item.cateringDetails?.totalPrice || 0);
                }
                return total + (item.serviceId?.minPrice || 0);
              }, 0)}
            </span>
          </div> */}

          <button
            onClick={() => navigate("/userdetails")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
