import React from "react";
import CartData from "./CartData";

const AddToCart = () => {
  const listedTotal = CartData.reduce(
    (acc, item) => acc + item.originalPrice,
    0
  );
  const finalTotal = CartData.reduce((acc, item) => acc + item.price, 0);
  const discount = listedTotal - finalTotal;
  const cgst = Math.round(finalTotal * 0.02);
  const sgst = Math.round(finalTotal * 0.01);
  const grandTotal = finalTotal + cgst + sgst;

  return (
    <div className="px-4 md:px-10 py-12 min-h-screen">
      {/* Heading */}
      <div className="text-center mt-[-10px] mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-wide">
          Your <span className="text-black">Cart</span>
        </h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left - Cart Items */}
        <div className="flex-1 max-h-[70vh] overflow-y-auto pr-0 lg:pr-4">
          {CartData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start gap-4 border border-gray-300 rounded-2xl shadow-xl p-5 mb-6 bg-gray-100"
            >
              {/* Image */}
              <div className="w-full sm:w-36 h-36 sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between sm:ml-5 flex-1">
                <div>
                  <div className="flex justify-between items-start gap-4 mt-[14px] sm:mt-0">
                    <h4 className="text-xl font-extrabold text-black-700 tracking-wide leading-snug">
                      {item.name}
                    </h4>

                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                      Remove
                    </button>
                  </div>

                  <p className="text-[13px] font-semibold tracking-wide mb-3 ">
                    <span className="bg-indigo-500 text-white px-2 py-1 rounded-md text-[12px]">
                      {item.vendor}
                    </span>
                  </p>
                  <p className="text-[14px] mt-2 mb-2 text-gray-500 font-medium">
                    <span className="font-semibold text-gray"></span>{" "}
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[14px] font-semibold">
                  <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded-full">
                    <span className="text-sm">{item.rating}</span>
                    <span className="ml-1 text-white text-xs">★</span>
                  </div>
                  <div className="text-gray-500 font-normal text-sm">
                    ({item.reviewsCount} reviews)
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap items-center mb-2">
                    <div className="text-lg font-bold text-black-700 mr-4">
                      ₹{item.price}
                    </div>
                    <div className="text-base line-through text-gray-400 mr-4">
                      ₹{item.originalPrice}
                    </div>
                    <div className="bg-green-100 text-green-700 text-sm font-medium px-2 py-0.5 rounded">
                      {item.discountPercent}% off
                    </div>
                  </div>
                  <p className="text-[15px] text-gray-700 font-normal leading-relaxed tracking-wide">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-1/3 bg-gray-100 rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
          <h4 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-dashed border-gray-300">
            🧾 Order Summary
          </h4>

          <div className="space-y-4 text-[15px] text-gray-700 font-medium">
            <div className="flex justify-between">
              <span>Listed Price</span>
              <span className="text-gray-900 font-semibold">
                ₹{listedTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discounted Price</span>
              <span className="text-green-700 font-semibold">
                ₹{finalTotal}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-rose-600">– ₹{discount}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST</span>
              <span className="text-gray-900">₹{cgst}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST</span>
              <span className="text-gray-900">₹{sgst}</span>
            </div>

            <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed border-gray-300">
              <span>Total Amount</span>
              <span className="text-black-700">₹{grandTotal}</span>
            </div>

            <p className="text-sm text-green-700 mt-1 font-medium">
              🎉 You saved ₹{discount} on this order!
            </p>

            <button className="mt-6 w-full bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-sm hover:bg-yellow-300 active:scale-95 transition">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
