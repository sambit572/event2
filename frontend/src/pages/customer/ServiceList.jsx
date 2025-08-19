import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { BACKEND_URL } from "../../utils/constant.js";

const ServiceList = ({ onSwitchToLogin }) => {
  const { categoryId } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/common/category/${categoryId}`);
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
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
          services.map((service) => (
            <div className="singleServiceCard" key={service._id}>
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