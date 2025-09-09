import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { BACKEND_URL } from "../../utils/constant.js";
import { setCategoryServices } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ServiceList = ({ onSwitchToLogin }) => {
  const dispatch = useDispatch();
  // const [services, setServices] = useState([]);

  const { categoryId } = useParams(); // This is the category name passed in URL
  console.log("################################");
  console.log(categoryId);
  console.log("################################");

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
        console.log("category data", response.data);
        // console.log("Fetched services1:", response.data.data);
        dispatch(setCategoryServices(response.data.data)); // save to redux
        // console.log("My data", response.data.data);
        // setServices(response.data.data);
        console.log("Fetched services data:", response.data.data); // Debugging log
        setServices(response.data.data);
        setFilteredServices(response.data.data); // Initialize filtered services
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters);
    // Initialize results by filtering services
    const results = services.filter((service) => {
      console.log("Inspecting service:", service); // Debugging log

      const serviceMin = Number(service.minPrice) || 0;
      const serviceMax = Number(service.maxPrice) || 0;

      // ✅ Price overlap check
      const priceMatch =
        (!filters.minPrice && !filters.maxPrice) ||
        (serviceMin >= filters.minPrice && serviceMax <= filters.maxPrice);

      // ✅ Rating check
      const ratingValue =
        Number(service.avgRating) ||
        Number(service?.ratingData?.averageRating) ||
        0; // Default to 0 if no rating is available
      const ratingMatch = filters.rating
        ? ratingValue >= Number(filters.rating) // Ensure rating is equal to or above the selected rating
        : true;

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

      return (
        priceMatch && ratingMatch && durationMatch && stateMatch && cityMatch
      );
    });

    console.log("Filtered services:", results);

    // ✅ Sorting logic
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return (a.minPrice || 0) - (b.minPrice || 0);
          case "name":
            return a.serviceName.localeCompare(b.serviceName);
          case "duration":
            return (a.duration || 0) - (b.duration || 0);
          case "rating":
            const ratingA =
              Number(a.rating) || Number(a?.ratingData?.averageRating) || 0;
            const ratingB =
              Number(b.rating) || Number(b?.ratingData?.averageRating) || 0;
            return ratingB - ratingA; // Higher rating first
          default:
            return 0;
        }
      });
    }

    setFilteredServices(results);
    console.log("Filtered and sorted count:", results.length);
  };

  // Runs when Cancel is clicked in Filter
  const handleCancelFilters = () => {
    setFilteredServices(services);
  };

  console.log("categoryId:",categoryId)

  return (
    <div className="serviceList">
      <Filter onApply={handleApplyFilters} onCancel={handleCancelFilters} />

      <div className="serviceCardDetails">
        {loading ? (
          <p>Loading services...</p>
        ) : filteredServices?.length > 0 ? (
          filteredServices.map((service, idx) => (
            <div className="singleServiceCard hover:shadow-lg" key={idx}>
              <Link
                to={`/service/${categoryId}/${service._id}`}
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
