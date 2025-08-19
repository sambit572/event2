import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../utils/constant";

const OrderSummary = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/cart`);
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        toast.error("Could not load your cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Calculate order summary
  const orderSummary = useMemo(() => {
    const finalTotal = items.reduce((acc, item) => acc + (item.serviceId?.minPrice || 0), 0);
    const listedTotal = items.reduce((acc, item) => acc + (item.serviceId?.maxPrice || item.serviceId?.minPrice || 0), 0);
    const discount = listedTotal - finalTotal;
    const cgst = Math.round(finalTotal * 0.02);
    const sgst = Math.round(finalTotal * 0.01);
    const grandTotal = finalTotal + cgst + sgst;
    
    return { listedTotal, finalTotal, discount, cgst, sgst, grandTotal };
  }, [items]);

  const handlePlaceOrder = () => {
    navigate("/userdetails"); // need to change here
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your order summary...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any services yet.</p>
          <button 
            onClick={() => navigate('/')} 
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
          <div className="w-24 h-1 bg-gray-400 mx-auto mt-4 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  Selected Services ({items.length})
                </h2>
                <p className="text-orange-100 mt-2">Perfect choices for your special event</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item, index) => {
                    let displayPrice = 'Price not available';
                    let priceColor = 'text-gray-500';
                    
                    if (item.serviceId?.minPrice && item.serviceId?.maxPrice) {
                      if (item.serviceId.minPrice === item.serviceId.maxPrice) {
                        displayPrice = `₹${item.serviceId.minPrice.toLocaleString()}`;
                        priceColor = 'text-green-600';
                      } else {
                        displayPrice = `₹${item.serviceId.minPrice.toLocaleString()} - ₹${item.serviceId.maxPrice.toLocaleString()}`;
                        priceColor = 'text-blue-600';
                      }
                    } else if (item.serviceId?.priceRange) {
                      displayPrice = item.serviceId.priceRange;
                      priceColor = 'text-blue-600';
                    }

                    return (
                      <div key={item._id} className="group relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="flex items-start gap-6 p-6 border border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg hover:border-blue-200 transition-all duration-300 ml-2">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                              <img 
                                src={item.serviceId?.serviceImage?.[0] || 'https://via.placeholder.com/150'} 
                                alt={item.serviceId?.serviceName} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                              {item.serviceId?.serviceName || "Unnamed Service"}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-gray-600 text-sm font-medium">
                                {item.serviceId?.locationOffered?.[0] || "Location not specified"}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                              {item.serviceId?.serviceDes?.substring(0, 120) || "No description available"}
                              {item.serviceId?.serviceDes?.length > 120 && "..."}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className={`text-lg font-bold ${priceColor}`}>
                                {displayPrice}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600 font-medium">Available</span>
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
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Order Details
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Listed Price</span>
                      <span className="font-semibold text-gray-800">₹{orderSummary.listedTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Service Price</span>
                      <span className="font-semibold text-green-600">₹{orderSummary.finalTotal.toLocaleString()}</span>
                    </div>
                    
                    {orderSummary.discount > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Discount Applied</span>
                        <span className="font-semibold text-red-500">- ₹{orderSummary.discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center py-1 text-sm">
                        <span className="text-gray-500">CGST (2%)</span>
                        <span className="text-gray-700">₹{orderSummary.cgst.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 text-sm">
                        <span className="text-gray-500">SGST (1%)</span>
                        <span className="text-gray-700">₹{orderSummary.sgst.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">₹{orderSummary.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {orderSummary.discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-800 font-semibold">Great Savings!</p>
                          <p className="text-green-700 text-sm">You saved ₹{orderSummary.discount.toLocaleString()} on this order</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={handlePlaceOrder}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      PLACE ORDER
                    </button>
                    
                    <button 
                      onClick={handleBackToCart}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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