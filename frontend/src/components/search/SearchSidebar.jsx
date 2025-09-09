import { useState } from "react";

export const SearchSidebar = ({
  services = [],
  categories = [],
  onFiltersChange,
  onPriceFilterApply,
  onRatingFilterApply,
}) => {
  const [filters, setFilters] = useState({
    location: "",
    sortBy: "price",
  });

  const [priceInputs, setPriceInputs] = useState({
    minPrice: "",
    maxPrice: "",
  });

  const [ratingInputs, setRatingInputs] = useState({
    rating: "",
  });

  const uniqueLocations = [
    ...new Set(
      services
        .flatMap((service) =>
          Array.isArray(service.locationOffered)
            ? service.locationOffered
            : [service.locationOffered]
        )
        .filter(Boolean)
    ),
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceInputChange = (key, value) => {
    setPriceInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleRatingInputChange = (value) => {
    setRatingInputs({ rating: value });
  };

  const applyPriceFilter = () => {
    onPriceFilterApply(priceInputs);
    onRatingFilterApply(ratingInputs);
  };

  // const applyRatingFilter = () => {
  //     onRatingFilterApply(ratingInputs)
  // }

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      sortBy: "price",
    };
    setFilters(clearedFilters);
    setPriceInputs({
      minPrice: "",
      maxPrice: "",
    });
    setRatingInputs({
      rating: "",
    });
    onFiltersChange(clearedFilters);
    onPriceFilterApply({ minPrice: "", maxPrice: "" });
    onRatingFilterApply({ rating: "" });
  };

  return (
    <div className="w-full lg:w-[250px] rounded-lg shadow-md p-6 h-fit ">
      <h3
        className="
    flex items-center gap-[10px] 
    text-[1rem] font-extrabold 
    bg-[#f5f6ff] text-gray-800 
    px-5 py-2 
    w-[130px] 
    rounded-[12px] 
    border-l-[6px] border-[#007bff] 
    font-[Poppins,sans-serif] 
    uppercase tracking-[1px] 
    mb-[10px] 
    transition-all duration-300 ease-in-out
  "
      >
        Filters
      </h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Search Results</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Services</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {services.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Categories</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
              {categories.length}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="duration">Duration</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
        {/* <div className="price-range-wrapper">
            <h4 className="heading4">Price Range</h4>
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
          </div> */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-900 mb-1">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={priceInputs.minPrice}
              onChange={(e) =>
                handlePriceInputChange("minPrice", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-900 mb-1">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="100000"
              value={priceInputs.maxPrice}
              onChange={(e) =>
                handlePriceInputChange("maxPrice", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
      <h3 className="font-medium text-gray-800 mb-3">Customer Rating</h3>
      <div>
        <select
          value={ratingInputs.rating}
          onChange={(e) => handleRatingInputChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      {uniqueLocations.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Location</h3>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <div className="space-y-3">
          <button
            onClick={applyPriceFilter}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    <button
  onClick={clearFilters}
  className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded-lg transition-colors duration-200"
>
  Clear All Filters
</button>

    </div>
  );
};
