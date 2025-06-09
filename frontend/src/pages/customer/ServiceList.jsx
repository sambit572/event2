import React from "react";
import Filter from "../../components/customer/serviceList/Filter";
import ServiceCard from "../../components/customer/serviceList/ServiceCard";
import serviceList from "../../components/customer/serviceList/Data.jsx";
import "../../pages/customer/ServiceList.css";
import FilterSection from "./../../components/customer/servicelist/FilterSection";

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
