import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ServiceList.css";
import Filter from "../../components/customer/serviceList/Filter.jsx";
import ServiceCard from "./../../components/customer/serviceList/ServiceCard";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant.js";
import { setCategoryServices } from "../../redux/categorySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const ServiceList = ({ onSwitchToLogin }) => {
  const dispatch = useDispatch();
  // const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryServices = useSelector(
    (state) => state.category.categoryServices
  );
  const { categoryId } = useParams(); // This is the category name passed in URL

  useEffect(() => {
    // console.log("Category ID:", categoryId);
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/common/category/${categoryId}`
        );
        // console.log("Fetched services1:", response.data.data);
        dispatch(setCategoryServices(response.data.data)); // save to redux
        // console.log("My data", response.data.data);
        // setServices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);
  // console.log("Fetched services:", categoryServices);

  return (
    <div className="serviceList">
      <Filter />

      <div className="serviceCardDetails">
        {loading ? (
          <p>Loading services...</p>
        ) : categoryServices.length > 0 ? (
          categoryServices.map((service, idx) => (
            <div className="singleServiceCard" key={idx}>
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
          <p>No services found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
