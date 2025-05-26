import React, { useState } from "react";
import FilterModal from "../../components/customer/FilterModel.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import { productData } from "../../components/customer/ProductData.jsx";
import "../../pages/customer/ServiceList.css";
import { Link } from "react-router-dom";

const ServiceList = () => {
  const [showModal, setShowModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    brand: [],
    location: [],
    rating: [],
    price: [],
  });

  const filterProducts = () => {
    return productData.filter((product) => {
      const { brand, location, rating, price } = appliedFilters;

      const matchesBrand = brand.length === 0 || brand.includes(product.brand);
      const matchesLocation =
        location.length === 0 || location.includes(product.location);
      const matchesRating =
        rating.length === 0 ||
        rating.some((r) => parseFloat(product.rating) >= r);

      const priceValue = parseInt(product.specialPrice.replace(/[₹,]/g, ""));
      const matchesPrice =
        price.length === 0 ||
        price.some((range) => {
          if (range === "under25") return priceValue < 25000;
          if (range === "25to35")
            return priceValue >= 25000 && priceValue <= 35000;
          if (range === "above35") return priceValue > 35000;
          return false;
        });

      return matchesBrand && matchesLocation && matchesRating && matchesPrice;
    });
  };

  const filteredData = filterProducts();

  return (
    <div className="app-container">
      <div className="filter-button-container">
        <button className="filter-button" onClick={() => setShowModal(true)}>
          Filter
        </button>
      </div>

      {showModal && (
        <FilterModal
          setShowModal={setShowModal}
          setAppliedFilters={setAppliedFilters}
        />
      )}

      <div className="product-list">
        <Link to="/category/service" className="category-service">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))
        ) : (
          <p>No products match your filters.</p>
        )}
        </Link>
      </div>
    </div>
  );
};

export default ServiceList;

