import React from "react";
// import serviceList from "../../components/customer/serviceList/CatogoryData.jsx";
import "./ServiceList.css";
import Filter from "./../../components/customer/servicelist/Filter";
import ServiceCard from "./../../components/customer/servicelist/ServiceCard";
import { useNavigate, useParams } from "react-router-dom";
import categories from "../../utils/CatogoryData.jsx";

const ServiceList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categories.find((cat) => cat.id === categoryId);
  return (
    <div className="serviceList">
      <Filter />

      <div className="serviceCardDetails">
        {category.services.map((service, idx) => (
          <div className="singleServiceCard" key={idx}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
