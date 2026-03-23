import React from "react";
import "./Spinner.css";

const Spinner = ({ size = 40, color = "#09f" }) => {
  return (
    <div className="spinner-overlay">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
        }}
      ></div>
    </div>
  );
};

export default Spinner;
