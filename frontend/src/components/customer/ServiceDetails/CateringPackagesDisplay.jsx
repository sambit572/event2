import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { incrementCartCount } from "../../../redux/UserSlice.js";
import { BACKEND_URL } from "../../../utils/constant";
import {
  getCateringPricingOptions,
  validatePlateCount,
  calculateCateringTotal,
} from "../../../utils/pricingHelpers";


const CateringPackagesDisplay = ({ service, onSwitchToLogin }) => {
  const dispatch = useDispatch();

  // State for selected packages (allows multiple selections)
  const [selections, setSelections] = useState({});
  // { 'packageId': { plateCount: number, error: string } }

  // State for loading during cart addition
  const [addingToCart, setAddingToCart] = useState({});

  if (!service || service.pricingType !== "perPlate") {
    return null;
  }

  const pricingOptions = getCateringPricingOptions(service);

  if (pricingOptions.length === 0) {
    return null;
  }

  // Handle plate count input change
  const handlePlateCountChange = (optionId, value) => {
    const numValue = parseInt(value) || "";

    setSelections((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        plateCount: numValue,
        error: "",
      },
    }));
  };

  // Handle package selection (expand input area)
  const handlePackageSelect = (optionId) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: prev[optionId] || { plateCount: "", error: "" },
    }));
  };

  // Handle add to cart for a specific package
  const handleAddToCart = async (option) => {
    const isLoggedIn = localStorage.getItem("currentlyLoggedIn") === "true";

    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.");
      if (onSwitchToLogin) onSwitchToLogin(true);
      return;
    }

    const selection = selections[option.id];

    if (!selection || !selection.plateCount) {
      setSelections((prev) => ({
        ...prev,
        [option.id]: {
          ...prev[option.id],
          error: "Please enter number of plates",
        },
      }));
      return;
    }

    // Validate plate count
    const validation = validatePlateCount(
      selection.plateCount,
      option.minPlates,
      option.maxPlates
    );

    if (!validation.isValid) {
      setSelections((prev) => ({
        ...prev,
        [option.id]: {
          ...prev[option.id],
          error: validation.errorMessage,
        },
      }));
      return;
    }

    // Calculate total
    const totalPrice = calculateCateringTotal(
      selection.plateCount,
      option.pricePerPlate
    );

    // Prepare cart payload
    const cartPayload = {
      serviceId: service._id,
      cateringDetails: {
        packageName: option.packageName,
        plateCount: selection.plateCount,
        pricePerPlate: option.pricePerPlate,
        totalPrice: totalPrice,
        minPlates: option.minPlates,
        maxPlates: option.maxPlates,
      },
    };

    try {
      setAddingToCart((prev) => ({ ...prev, [option.id]: true }));

      await axios.post(`${BACKEND_URL}/cart/add`, cartPayload, {
        withCredentials: true,
      });

      dispatch(incrementCartCount());
      toast.success(`${option.packageName} added to cart!`);

      // Clear this selection after successful add
      setSelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[option.id];
        return newSelections;
      });
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(
          err.response.data.message || "This package is already in your cart."
        );
      } else {
        toast.error("Failed to add to cart. Please try again.");
      }
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [option.id]: false }));
    }
  };

  return (
    <div className="w-full p-5 mt-6 border border-gray-200 rounded-xl bg-slate-50">
      <h3 className="text-xl font-semibold text-gray-800 pb-3 mb-5 border-b-2 border-gray-100">
        💰 Select Package & Add to Cart
      </h3>

      <div className="flex flex-col gap-4">
        {pricingOptions.map((option) => {
          const isSelected = !!selections[option.id];
          const selection = selections[option.id] || {};
          const totalPrice = selection.plateCount
            ? calculateCateringTotal(selection.plateCount, option.pricePerPlate)
            : 0;
          const isAddingThisItem = addingToCart[option.id];

          return (
            <div
              key={option.id}
              className={`border-2 rounded-lg transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              {/* Package Header - Always visible */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => !isSelected && handlePackageSelect(option.id)}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-medium text-slate-700">
                    {option.packageName}
                    {option.isBase && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Base Option
                      </span>
                    )}
                  </span>
                  {option.description && (
                    <span className="text-sm italic text-slate-500">
                      {option.description}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 mt-1">
                    Valid for {option.minPlates} - {option.maxPlates} plates
                  </span>
                </div>
                <div className="text-base font-semibold text-green-600 whitespace-nowrap pl-4">
                  ₹{option.pricePerPlate}/- per plate
                </div>
              </div>

              {/* Expanded Input Section - Shows when selected */}
              {isSelected && (
                <div className="px-4 pb-4 border-t border-blue-200 pt-3 bg-white">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    {/* Plate Count Input */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Plates
                      </label>
                      <input
                        type="number"
                        min={option.minPlates}
                        max={option.maxPlates}
                        value={selection.plateCount}
                        onChange={(e) =>
                          handlePlateCountChange(option.id, e.target.value)
                        }
                        placeholder={`${option.minPlates} - ${option.maxPlates}`}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          selection.error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      {selection.error && (
                        <p className="text-red-500 text-xs mt-1">
                          {selection.error}
                        </p>
                      )}
                    </div>

                    {/* Total Price Display */}
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Price
                      </label>
                      <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-semibold">
                        {totalPrice > 0 ? `₹${totalPrice}/-` : "₹0/-"}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(option)}
                      disabled={!selection.plateCount || isAddingThisItem}
                      className={`flex-shrink-0 px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                        !selection.plateCount || isAddingThisItem
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isAddingThisItem ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> You can add multiple packages from this
          service to your cart!
        </p>
      </div>
    </div>
  );
};

export default CateringPackagesDisplay;
