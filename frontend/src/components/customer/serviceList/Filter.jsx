import React, { useState } from "react";
import "../../customer/serviceList/Filter.css";
import { TiStarFullOutline } from "react-icons/ti";
import locationData from "./LocationData"; // { "Maharashtra": ["Mumbai", "Pune"], ... }
import { IoFilterOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";

const Filter = ({ onApply, onCancel }) => {
  const ratingOptions = [4.9, 4, 3];
  const STEP_MIN = 1000;
  const STEP_MAX = 1000;
  const priceCap = 200000;
  const minGap = 1000;

  const defaultFilters = {
    minPrice: "",
    maxPrice: "",
    rating: "",
    state: "",
    subdistrict: "",
    duration: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("price"); // Add state for sortBy

  const [states] = useState(Object.keys(locationData));
  const [subdistricts, setSubdistricts] = useState([]);
  // Already correct:
  const handleRatingChange = (e) => {
    setFilters({
      ...filters,
      rating: e.target.value ? Number(e.target.value) : "",
    });
  };

  // Price change handlers (snap to step)
  const handleMinChange = (e) => {
    setFilters((prev) => ({ ...prev, minPrice: e.target.value }));
  };

  const handleMaxChange = (e) => {
    setFilters((prev) => ({ ...prev, maxPrice: e.target.value }));
  };

  // State change → update subdistricts
  const handleStateChange = (e) => {
    const state = e.target.value;
    setFilters({ ...filters, state, subdistrict: "" });
    setSubdistricts(locationData[state] || []);
  };

  // Subdistrict change
  const handleSubdistrictChange = (e) => {
    setFilters({ ...filters, subdistrict: e.target.value });
  };

  // Apply filters
  const handleApply = () => {
    const appliedFilters = { ...filters, sortBy }; // Update handleApply to include sortBy
    onApply(appliedFilters);
    setShowFilter(false);
  };

  // Cancel filters
  const handleCancel = () => {
    setFilters(defaultFilters);
    setSubdistricts([]);
    onCancel();
    setShowFilter(false);
  };

  return (
    <>
      {!showFilter && (
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilter(true)}
        >
          <FaFilter className="filter-icon" />
          {/* <span className="filter-text">Filters</span> */}
        </button>
      )}

      <div className={`filterBox ${showFilter ? "show" : ""}`}>
        <div className="filter ">
          {showFilter && (
            <button
              className="close-filter-btn"
              onClick={() => setShowFilter(false)}
            >
              <FaWindowClose />
              {/* <span className="filter-text">Close</span> */}
            </button>
          )}

          <h3 className="filter-heading">Filters</h3>
          <div className="mb-2">
            <h3 className="text-[1rem] font-semibold text-black-700 mb-0 tracking-wide">
              Sort By
            </h3>

            <select
              value={sortBy} // Update the Sort By dropdown to use state
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-[0.3rem] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="duration">Duration</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          {/* Price Filter */}
          {/* <div className="price-range-wrapper">
            // <h4 className="heading4">Price Range</h4>
            <div
              className="slider"
              style={{
                "--min": filters.minPrice,
                "--max": filters.maxPrice,
              }}
            >
              <div className="price-display">
                <span className="price-box">₹{filters.minPrice}</span>
                <span className="price-box">₹{filters.maxPrice}</span>
              </div>
              <div className="range-track" />
              <input
                type="range"
                min="0"
                max={priceCap}
                step={STEP_MIN}
                value={filters.minPrice}
                onChange={handleMinChange}
                className="thumb thumb-left"
              />
              <input
                type="range"
                min="0"
                max={priceCap}
                step={STEP_MAX}
                value={filters.maxPrice}
                onChange={handleMaxChange}
                className="thumb thumb-right"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">OR </div> */}
          <div className="space-y-1">
            <h6 className="text-lg font-semibold text-black-700 mb-0 tracking-wide">Price Range</h6>
            <div>
              <label className="block text-xs text-gray-900 mb-1">
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter Min Price"
                value={filters.minPrice}
                onChange={handleMinChange}
                className="w-full px-3 py-[0.3rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-900 mb-1">
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter Max Price"
                value={filters.maxPrice}
                onChange={handleMaxChange}
                className="w-full px-3 py-[0.3rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="filter-section">
            <h6 className="text-lg font-semibold text-black-700 mb-0 tracking-wide">Customer Rating</h6>
            <div className="dropdown">
              <select value={filters.rating} onChange={handleRatingChange}>
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div className="filter-section">
             <h6 className="text-lg font-semibold text-black-700 mb-0 tracking-wide">Location</h6>

            <div className="dropdown">
              <label>State</label>
              <select value={filters.state} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown">
              <label>District</label>
              <select
                value={filters.subdistrict}
                onChange={handleSubdistrictChange}
                disabled={!filters.state}
              >
                <option value="">Select District</option>
                {subdistricts.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Ready Within */}
          <div className="dropdown">
            <h6 className="text-lg font-semibold text-black-700 mb-0 tracking-wide">Service Ready Within</h6>
            <select
              value={filters.duration}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: e.target.value ? parseInt(e.target.value) : "",
                })
              }
            >
              <option value="">Any</option>
              <option value={1}>12 Hours</option>
              <option value={2}>1 Day</option>
              <option value={3}>2 Days</option>
              <option value={4}>3 Days</option>
              <option value={5}>4 Days</option>
              <option value={7}>1 Week</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="filter-btn">
            <button className="applybtn" onClick={handleApply}>
              Apply 
            </button>
            <button className="cancelbtn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
