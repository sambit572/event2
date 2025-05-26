import React, { useState } from 'react';
import { productData } from './ProductData.jsx';
import "../../components/customer/FilterModel.css"

const getUniqueValues = (key) => [...new Set(productData.map(p => p[key]))];

const FilterModel = ({ setShowModal, setAppliedFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    location: [],
    rating: [],
    price: [],
  });

  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedFilters((prev) => ({
      ...prev,
      location: value ? [value] : [],
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(selectedFilters);
    setShowModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{textAlign:"center"}}>Filter Options</h2>

        <div className="filter-group">
          <h3>Brand</h3>
          {getUniqueValues('brand').map((brand) => (
            <label key={brand} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedFilters.brand.includes(brand)}
                onChange={() => toggleFilter('brand', brand)}
              />
              {brand}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h3>Location</h3>
          <select
            className="dropdown"
            onChange={handleLocationChange}
            value={selectedFilters.location[0] || ""}
          >
            <option value="">All Locations</option>
            {getUniqueValues('location').map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <h3>Rating</h3>
          {[3, 4, 4.5].map((rating) => (
            <label key={rating} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedFilters.rating.includes(rating)}
                onChange={() => toggleFilter('rating', rating)}
              />
              {rating}+
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h3>Price Range</h3>
          {[
            { label: 'Under ₹25,000', value: 'under25' },
            { label: '₹25,000 - ₹35,000', value: '25to35' },
            { label: 'Above ₹35,000', value: 'above35' },
          ].map(({ label, value }) => (
            <button
              key={value}
              className={`filter-button ${selectedFilters.price.includes(value) ? 'active' : ''}`}
              onClick={() => toggleFilter('price', value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="apply-btn" onClick={applyFilters}>Apply</button>
          <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModel;

