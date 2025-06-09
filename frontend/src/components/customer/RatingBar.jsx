const RatingBar = ({ label, count, max, color }) => {
  const widthPercent = ((count / max) * 100).toFixed(1);
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div style={{ height: "10px", background: "#ccc", borderRadius: "4px" }}>
        <div
          style={{
            width: `${widthPercent}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};
export default RatingBar

