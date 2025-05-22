import React from "react";

import "./Services.css";
const Services = ({ person }) => {
  return (
    <a href="/category/service" className="category_person">
      <img src={person} alt="" />
      <div className="person_description">
        <h3>Name</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum,
          placeat cupiditate. Laboriosam nihil earum quam odio saepe aut
          veritatis. Voluptates quos cumque veniam sint illum saepe sunt.
          Adipisci nam officiis sapiente quae! Enim sapiente tempore libero
          consectetur? Rem nesciunt porro impedit tempora veritatis eaque enim,
        </p>
        <p>
          exercitationem magnam asperiores earum ipsum accusamus nobis ratione
          vero temporibus tenetur aspernatur ipsam non dignissimos aliquam velit
          soluta architecto! Quia libero illum, ea pariatur ullam consequatur
          officia doloribus recusandae aliquam quisquam sint!
        </p>
      </div>
    </a>
  );
};

export default Services;
