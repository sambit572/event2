import React from "react";

import "./ServiceList.css";
import person from "../../assets/category/person.png";
import Services from "./../../components/customer/Services";
import FilterSection from "./../../components/customer/servicelist/FilterSection";
const ServiceList = () => {
  return (
    <div className="category_box">
      <FilterSection />
      <div className="category">
        <h1>Services</h1>
        <Services person={person} />
        <Services person={person} />
        <Services person={person} />
      </div>
    </div>
  );
};

export default ServiceList;
