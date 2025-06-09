import React from "react";

import "./FilterSection.css";
import { useState } from "react";
import locationData from "./LocationData";
// import locationData from "./LocationData";

const FilterSection = () => {
  const rating = [4.9, 4.2, 3.5];
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showFilter, setShowFilter] = useState(false);

  const minGap = 1000;
  const priceCap = 100000;

  const handleMinChange = (e) => {
    if (parseInt(e.target.value) + minGap <= maxPrice) {
      setMinPrice(parseInt(e.target.value));
    }
  };

  const handleMaxChange = (e) => {
    if (parseInt(e.target.value) - minGap >= minPrice) {
      setMaxPrice(parseInt(e.target.value));
    }
  };

  //location filter
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");

  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCities(Object.keys(locationData[state] || {}));
    setSelectedCity("");
    setPincodes([]);
    setSelectedPincode("");
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setPincodes(locationData[selectedState]?.[city] || []);
    setSelectedPincode("");
  };

  const handlePincodeChange = (e) => {
    setSelectedPincode(e.target.value);
  };

  return (
    <section className="filter_section ">
      <h2>Filters</h2>
      <div className="filter_location">
        <h3>Location</h3>
        <div className="dropdown">
          <label htmlFor="state" className="state">
            State
          </label>
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {Object.keys(locationData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        {cities.length > 0 && (
          <div className="dropdown">
            <label htmlFor="city">City</label>
            <select value={selectedCity} onChange={handleCityChange}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {pincodes.length > 0 && (
          <div className="dropdown">
            <label htmlFor="pincode">Pincode</label>
            <select value={selectedPincode} onChange={handlePincodeChange}>
              <option value="">Select Pincode</option>
              {pincodes.map((pin) => (
                <option key={pin} value={pin}>
                  {pin}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <h4 className="head4">Date</h4>
          <input type="date" className="dateFilter" />
        </div>
      </div>

      <div className="price-range-wrapper">
        <h4>Price</h4>
        <div
          className="slider"
          style={{
            "--min": minPrice,
            "--max": maxPrice,
          }}
        >
          <div className="price-display">
            <span className="price-box">₹{minPrice}</span>
            <span className="price-box">₹{maxPrice}</span>
          </div>
          <div className="range-track" />
          <input
            type="range"
            min="0"
            max={priceCap}
            value={minPrice}
            onChange={handleMinChange}
            className="thumb thumb-left"
          />
          <input
            type="range"
            min="0"
            max={priceCap}
            value={maxPrice}
            onChange={handleMaxChange}
            className="thumb thumb-right"
          />
        </div>
      </div>
      <div className="">
        <h3>Ratings</h3>
        <div className="filter_rating">
          {[5, 4, 3, 2].map((rating) => (
            <label key={rating}>
              <input type="checkbox" />
              {rating} &#9733; & above
            </label>
          ))}
        </div>
      </div>
      <div className="filter_button">
        <button>Apply</button>
        <button>Cancel</button>
      </div>
    </section>
  );
};

export default FilterSection;
