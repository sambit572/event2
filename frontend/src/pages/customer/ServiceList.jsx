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

  useEffect(() => {
    console.log("Category ID:", categoryId);
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/vendors/category/${categoryId}`
        );
        console.log("Fetched services:", response);
        setServices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  return (
    <div className="serviceList">
      <Filter />

      <div className="serviceCardDetails">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service, idx) => (
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
          <p>No services found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
