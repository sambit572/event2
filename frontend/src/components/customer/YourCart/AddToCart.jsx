import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../utils/constant";

const AddToCart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/cart`,{
          withCredentials: true
        });
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

  const handleRemoveItem = async (serviceId) => {
    try {
      await axios.delete(`${BACKEND_URL}/cart/${serviceId}`,{
        withCredentials: true
      });
      setItems(prevItems => prevItems.filter(item => item.serviceId._id !== serviceId));
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Could not remove item.");
    }
  };
  
  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading your cart...</div>;
  }
  
  if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
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
          {items.map((item) => {
            const isAvailable = item.serviceId?.available !== false;
            
            let displayPrice = 'Price: N/A';
            if (item.serviceId?.minPrice && item.serviceId?.maxPrice) {
                if (item.serviceId.minPrice === item.serviceId.maxPrice) {
                    displayPrice = `Price: ₹${item.serviceId.minPrice}`;
                } else {
                    displayPrice = `Price: ₹${item.serviceId.minPrice} - ₹${item.serviceId.maxPrice}`;
                }
            } else if (item.serviceId?.priceRange) {
                displayPrice = `Price: ${item.serviceId.priceRange}`;
            }

            return (
              <div key={item._id} className="flex flex-col sm:flex-row items-start gap-4 border border-gray-300 rounded-2xl shadow-xl p-5 mb-6 bg-gray-100">
                <div className="relative w-full sm:w-36 h-[15rem] sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white flex-shrink-0 mx-auto sm:mx-0">
                  <img src={item.serviceId?.serviceImage?.[0] || 'https://via.placeholder.com/150'} alt={item.serviceId?.serviceName} className={`w-full h-full object-cover transition-all duration-300 ${!isAvailable ? 'grayscale brightness-75' : ''}`}/>
                  
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="rounded-md bg-red-600 px-4 py-1.5 text-center  shadow-lg">
                        <p className="text-xs font-bold text-white">OUT OF SERVICE</p>
                      
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between sm:ml-5 flex-1">
                  <div>
                    <div className="flex justify-between items-start gap-4 mt-[14px] sm:mt-0">
                      <h4 className="text-xl font-extrabold text-black-700 tracking-wide leading-snug">{item.serviceId?.serviceName || "Unnamed Service"}</h4>
                      <button onClick={() => handleRemoveItem(item.serviceId._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        Remove
                      </button>
                    </div>
                    <p className="text-[14px] mt-2 mb-2 text-gray-500 font-medium">{item.serviceId?.locationOffered?.[0] || "No location"}</p>
                    <p className="text-[15px] text-gray-700 font-normal leading-relaxed tracking-wide">
                      {item.serviceId?.serviceDes?.substring(0, 100) || "No description"}...
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
                    <div className="text-lg font-bold text-black-700 mr-4">
                      {displayPrice}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Next Button */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => navigate("/userdetails")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;