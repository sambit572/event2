import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../utils/constant.js";

const OrderSummary = () => {
  const { userDetailsId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState("single"); // 'single' or 'multiple'

  const fetchCartItems = useCallback(async () => {
    // Return early if there's no user ID
    if (!userDetailsId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/cart/${userDetailsId}`, // The new consolidated endpoint
        { withCredentials: true }
      );
      console.log("Cart fetch response:", response.data); // Debug log
      // Destructure the consistent response from the backend
      const { orderType, items } = response.data.data;

      if (items && items.length > 0) {
        setItems(items);
        setOrderType(orderType); // Set type directly from backend response
      } else {
        // This handles the "empty" case gracefully
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      toast.error("Could not load your cart.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const orderSummary = useMemo(() => {
    if (!items.length) {
      return {
        finalTotal: 0,
        platformDiscountAmount: 0,
        totalAfterDiscount: 0,
        cgst: 0,
        sgst: 0,
        grandTotal: 0,
      };
    }

    // --- SIMPLIFIED LOGIC ---
    // The structure of 'item' is now consistent for both single and multiple order types.
    // We can directly reduce the array without the unnecessary if/else check.
    const finalTotal = items.reduce(
      (acc, item) => acc + (item.finalPrice ?? item.proposedPrice ?? 0),
      0
    );

    const platformDiscountAmount = Math.round(finalTotal * 0.1);
    const totalAfterDiscount = finalTotal - platformDiscountAmount;

    const cgst = Math.round(totalAfterDiscount * 0.09);
    const sgst = Math.round(totalAfterDiscount * 0.09);
    const grandTotal = totalAfterDiscount + cgst + sgst;

    return {
      finalTotal,
      platformDiscountAmount,
      totalAfterDiscount,
      cgst,
      sgst,
      grandTotal,
    };
  }, [items]);

  const handlePlaceOrder = () => {
    // Generate order ID and merchant reference
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const merchantRef = `MER-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Generate UPI URI
    const upiUri = `upi://pay?pa=merchant@paytm&pn=EventVendor&am=${Math.round(
      orderSummary.grandTotal * 0.2
    )}&cu=INR&tn=Order-${orderId}`;

    // Set expiration to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Navigate to QR Payment page with order details
    navigate("/qr-payment", {
      state: {
        amount: Math.round(orderSummary.grandTotal * 0.2), // 20% advance payment
        upiUri: upiUri,
        merchantRef: merchantRef,
        orderId: orderId,
        expiresAt: expiresAt,
      },
    });
  };
  const handleBackToCart = () => navigate("/cart");

  // Helper function to get service details based on order type
  const getServiceDetails = (item) => {
    return {
      serviceName: item.serviceId?.serviceName || "Unnamed Service",
      serviceImage:
        item.serviceId?.serviceImage?.[0] || "https://via.placeholder.com/150",
      serviceDes: item.serviceId?.serviceDes || "No description available",
      locationOffered:
        item.serviceId?.locationOffered?.[0] || "Location not specified",
      proposedPrice: item.proposedPrice || 0,
      minPrice: item.serviceId?.minPrice,
      maxPrice: item.serviceId?.maxPrice,
      priceRange: item.serviceId?.priceRange,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading your order summary...
          </p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any services yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4 mt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Order Summary
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Review your selected services before proceeding to checkout
          </p>
          <div className="flex items-center justify-center mt-4 gap-2">
            <div className="w-24 h-1 bg-gray-400 rounded-full"></div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderType === "single"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {orderType === "single"
                ? "Single Service"
                : `${items.length} Services`}
            </span>
            <div className="w-24 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  Selected Services ({items.length})
                </h2>
                <p className="text-orange-100 mt-2">
                  Perfect choices for your special event
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item, index) => {
                    return (
                      <div
                        key={item._id || `item-${index}`}
                        className="group relative"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="flex items-start gap-6 p-6 border border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg hover:border-blue-200 transition-all duration-300 ml-2">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                              <img
                                decoding="async"
                                loading="lazy"
                                src={
                                  item.serviceId?.serviceImage?.[0] ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={
                                  item.serviceId?.serviceName || "Service Image"
                                }
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* --- MODIFICATION START --- */}
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="flex-1 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {(
                                  item.serviceId?.serviceName ||
                                  "Unnamed Service"
                                ).toUpperCase()}
                              </h3>

                              <div className="relative group flex flex-col items-center ml-4">
                                <a
                                  href={`tel:"+911169320147`}
                                  className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                  aria-label="Contact Vendor"
                                >
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                </a>
                                <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                  Contact Vendor
                                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                            {/* --- MODIFICATION END --- */}

                            <div className="flex items-center gap-2 mb-3">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-gray-600 text-sm font-medium">
                                {item.serviceId?.locationOffered?.[0] ||
                                  "Location not specified"}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                              {(item.serviceId?.serviceDes || "").substring(
                                0,
                                120
                              )}
                              {(item.serviceId?.serviceDes?.length || 0) >
                                120 && "..."}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                {item.proposedPrice > 0 ? (
                                  <>
                                    <div className="text-lg font-bold text-green-600">
                                      Negotiated: ₹
                                      {item.proposedPrice.toLocaleString()}
                                    </div>
                                    {item.serviceId?.minPrice &&
                                      item.serviceId?.maxPrice && (
                                        <div className="text-sm text-gray-500">
                                          Original: ₹
                                          {item.serviceId.minPrice.toLocaleString()}{" "}
                                          - ₹
                                          {item.serviceId.maxPrice.toLocaleString()}
                                        </div>
                                      )}
                                  </>
                                ) : (
                                  <div className="text-lg font-bold text-red-500">
                                    Price not negotiated
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    item.proposedPrice > 0
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                ></div>
                                <span
                                  className={`text-sm font-medium ${
                                    item.proposedPrice > 0
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  }`}
                                >
                                  {item.proposedPrice > 0
                                    ? "Ready to Order"
                                    : "Pending Negotiation"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    Order Details
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Final Price</span>
                      <span className="font-semibold text-gray-800">
                        ₹{orderSummary.finalTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">
                        Platform Discount (10%)
                      </span>
                      <span className="font-semibold text-red-500">
                        - ₹
                        {orderSummary.platformDiscountAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center py-1 text-sm">
                        <span className="text-gray-500">CGST (9%)</span>
                        <span className="text-gray-700">
                          ₹{orderSummary.cgst.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1 text-sm">
                        <span className="text-gray-500">SGST (9%)</span>
                        <span className="text-gray-700">
                          ₹{orderSummary.sgst.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{orderSummary.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {orderSummary.platformDiscountAmount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-800 font-semibold">
                            Great Savings!
                          </p>
                          <p className="text-green-700 text-sm">
                            You saved ₹
                            {orderSummary.platformDiscountAmount.toLocaleString()}{" "}
                            on this order
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderSummary.finalTotal === 0}
                      className={`w-full font-bold py-4 rounded-2xl shadow-lg transform transition-all duration-200 flex items-center justify-center group ${
                        orderSummary.finalTotal > 0
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:-translate-y-0.5"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-2 group-hover:animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {orderSummary.finalTotal > 0
                        ? "PLACE ORDER"
                        : "COMPLETE NEGOTIATIONS FIRST"}
                    </button>

                    <button
                      onClick={handleBackToCart}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-all duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
