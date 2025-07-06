import React from "react";
import serviceList from "../../components/customer/serviceList/Data.jsx";
import "./ServiceList.css";
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
