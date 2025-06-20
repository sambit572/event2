import React from "react";

// import ServiceCard from "../../components/customer/serviceList/ServiceCard.js";
import serviceList from "../../components/customer/serviceList/Data.jsx";
import "./ServiceList.css";
// import FilterSection from "../../components/customer/serviceList/FilterSection.js";
import Filter from "./../../components/customer/servicelist/Filter";
import ServiceCard from "./../../components/customer/servicelist/ServiceCard";

const ServiceList = () => {
  return (
    <div className="serviceList">
      <Filter />

      <div className="serviceCardDetails">
        {serviceList.map((service, idx) => (
          <div className="singleServiceCard" key={idx}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
