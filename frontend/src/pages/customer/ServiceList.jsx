import React from "react";

import "./ServiceList.css";
import similarimg2 from "../../assets/category/similar-dj-img2.jfif"
import similarimg4 from "../../assets/category/similar-dj-img4.jpg"
import similarimg5 from "../../assets/category/similar-dj-img5.jpg"
import Services from "./../../components/customer/Services";
const ServiceList = () => {

  

  return (
    <div className="category_box">
      {/* <div className="category_filter">Filter</div> */}
  
        <Services person={similarimg2} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
        <Services person={similarimg4} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
        <Services person={similarimg5} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
        <Services person={similarimg2} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
        <Services person={similarimg4} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
        <Services person={similarimg5} />
        <hr style={{color:"lightgrey",margin:"20px",fontWeight:"100"}}/>
      </div>
    
  );
};

export default ServiceList;
