import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant.js";

const ServiceList = ({ onSwitchToLogin }) => {
  const { categoryId } = useParams(); // This is the category name passed in URL

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    console.log("Category ID:", categoryId);
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/common/category/${categoryId}`
        );
        console.log("Fetched services:", response);
        setServices(response.data.data);
        setFilteredServices(response.data.data); // Initialize filtered services
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);
  
const handleApplyFilters = (filters) => {
  console.log("Applying filters:", filters);
  const results = services.filter((service) => {
    const serviceMin = Number(service.minPrice) || 0;
    const serviceMax = Number(service.maxPrice) || 0;

  // ✅ Price overlap check
    const priceMatch =
      (!filters.minPrice && !filters.maxPrice) ||
      (serviceMax >= filters.minPrice && serviceMin <= filters.maxPrice);

    // ✅ Rating check
    const ratingValue =
      Number(service.rating) || Number(service?.ratingData?.averageRating) || 0;
    const ratingMatch = filters.rating
      ? ratingValue >= Number(filters.rating)
      : true;

    console.log("Service price:", serviceMin, serviceMax);
  console.log("Service ratings:", services.map(s => ({ id: s._id, rating: s.rating })));
  console.log("Filtered services:", results.map(s => ({ id: s._id, rating: s.rating })));

    const prepTimeDays = Math.ceil((service.duration || 0) / (24 * 60));
    const durationMatch =
      !filters.duration || prepTimeDays <= filters.duration;

    // ✅ State match
    let stateMatch = true;
    if (filters.state) {
      if (Array.isArray(service.stateLocationOffered)) {
        stateMatch = service.stateLocationOffered.some(
          (state) =>
            state?.toLowerCase().trim() === filters.state.toLowerCase().trim()
        );
      } else {
        stateMatch =
          service.stateLocationOffered?.toLowerCase().trim() ===
          filters.state.toLowerCase().trim();
      }
    }

    // ✅ City/District match
    let cityMatch = true;
    if (filters.subdistrict && stateMatch) {
      if (Array.isArray(service.locationOffered)) {
        cityMatch = service.locationOffered.some(
          (city) =>
            city?.toLowerCase().trim() ===
            filters.subdistrict.toLowerCase().trim()
        );
      } else {
        cityMatch =
          service.locationOffered?.toLowerCase().trim() ===
          filters.subdistrict.toLowerCase().trim();
      }
    }

    return priceMatch && ratingMatch && durationMatch && stateMatch && cityMatch;
  });

  setFilteredServices(results);
  console.log("Filtered count:", results.length);
};



  // Runs when Cancel is clicked in Filter
  const handleCancelFilters = () => {
    setFilteredServices(services);
  };

  return (
    <div className="serviceList">
      <Filter
        onApply={handleApplyFilters}
        onCancel={handleCancelFilters}
      />

      <div className="serviceCardDetails">
        {loading ? (
          <p>Loading services...</p>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service, idx) => (
            <div className="singleServiceCard" key={idx}>
              <Link
                to={`/service/${service._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              ></Link>
              <ServiceCard
                service={service}
                onSwitchToLogin={onSwitchToLogin}
              />
            </div>
          ))
        ) : (
          <p>No services found matching filters.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
