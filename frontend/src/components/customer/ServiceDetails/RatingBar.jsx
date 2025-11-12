import React from "react";

const RatingBar = ({ label, count, max, color }) => {
  if (!max || max === 0) {
    return null; // avoid division by zero
  }

  const widthPercent = ((count / max) * 100).toFixed(1);

  
  return (
    <div style={{ marginBottom: "10px" }}>
      {/* Label and Count */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "14px", color: "#333" }}>{label}</span>
        <span style={{ fontSize: "14px", color: "#555" }}>{count}</span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: "10px",
          background: "#e0e0e0",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${widthPercent}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "5px",
            transition: "width 0.4s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

export default RatingBar;
