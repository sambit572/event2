import React, { useState } from "react";
import "../../customer/serviceList/Filter.css";
import { TiStarFullOutline } from "react-icons/ti";
import locationData from "./LocationData"; // { "Maharashtra": ["Mumbai", "Pune"], ... }
import { IoFilterOutline } from "react-icons/io5";

const Filter = ({ onApply, onCancel }) => {
  const ratingOptions = [4.9, 4, 3];
  const STEP_MIN = 1000;
  const STEP_MAX = 1000;
  const priceCap = 200000;
  const minGap = 1000;
  

  const defaultFilters = {
    minPrice: 0,
    maxPrice: priceCap,
    ratings: [],
    state: "",
    subdistrict: "",
    duration: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);

  const [states] = useState(Object.keys(locationData));
  const [subdistricts, setSubdistricts] = useState([]);

  // Price change handlers (snap to step)
  const handleMinChange = (e) => {
    let value = Number(e.target.value);
    // snap to step
    value = Math.round(value / STEP_MIN) * STEP_MIN;
    // keep within gap
    if (value + minGap <= filters.maxPrice) {
      setFilters((prev) => ({ ...prev, minPrice: value }));
    }
  };

  const handleMaxChange = (e) => {
    let value = Number(e.target.value);
    // snap to step
    value = Math.round(value / STEP_MAX) * STEP_MAX;
    // keep within gap
    if (value - minGap >= filters.minPrice) {
      setFilters((prev) => ({ ...prev, maxPrice: value }));
    }
  };

  // Rating selection
  const handleRatingChange = (rating) => {
    setFilters((prev) => {
      const alreadySelected = prev.ratings.includes(rating);
      return {
        ...prev,
        ratings: alreadySelected
          ? prev.ratings.filter((r) => r !== rating)
          : [...prev.ratings, rating],
      };
    });
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
    onApply(filters);
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
          <IoFilterOutline className="filter-icon" />
          <span className="filter-text">Filters</span>
        </button>
      )}

      <div className={`filterBox ${showFilter ? "show" : ""}`}>
        <div className="filter m-2">
          {showFilter && (
            <button
              className="close-filter-btn"
              onClick={() => setShowFilter(false)}
            >
              <span className="filter-text">Close</span>
            </button>
          )}

          <h3 className="filter-heading">Filters</h3>

          {/* Price Filter */}
          <div className="price-range-wrapper">
            <h4 className="heading4">Price</h4>
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
          <hr className="line" />

          {/* Customer Rating */}
          <div>
            <h4 className="head4">Customer Rating</h4>
            {ratingOptions.map((rating) => (
              <div key={rating} className="align_center rating-option">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={filters.ratings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <label className="align_center ml-2" htmlFor={`rating-${rating}`}>
                  {rating}{" "}
                  <span className="star">
                    <TiStarFullOutline />
                  </span>{" "}
                  & above
                </label>
              </div>
            ))}
          </div>
          <hr className="line" />

          {/* Location Filter */}
          <div className="filter-section">
            <h4>Location</h4>

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
              <label>City/District</label>
              <select
                value={filters.subdistrict}
                onChange={handleSubdistrictChange}
                disabled={!filters.state}
              >
                <option value="">Select City/District</option>
                {subdistricts.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <hr className="line" />

          {/* Service Ready Within */}
          <div className="dropdown">
            <h4 className="head4">Service Ready Within</h4>
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
