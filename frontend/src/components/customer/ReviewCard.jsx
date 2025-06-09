import { BiLike } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

const ReviewCard = ({ review }) => {
  if (!review) return null; // Safeguard for undefined prop

  return (
    <div style={{ borderBottom: "1px solid #eee", padding: "16px 0" }}>
      <h4 style={{ marginBottom: "8px" }}>{review.name}</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            backgroundColor: "#008000",
            color: "white",
            padding: "4px 8px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <AiFillStar size={14} style={{ marginRight: "4px" }} />{" "}
          {review.rating}
        </div>
        <span>{review.label}</span>
        <span style={{ color: "#666" }}>• Posted on {review.date}</span>
      </div>
      <p style={{ fontSize: "14px", marginBottom: "8px" }}>{review.text}</p>
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        {(review.images || []).map((img, idx) => (
          <div
            key={idx}
            style={{
              width: "60px",
              height: "80px",
              backgroundColor: "#ccc",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <img
              src={img}
              alt={`review-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#555",
          fontSize: "14px",
        }}
      >
        <BiLike /> Helpful{review.helpful ? ` (${review.helpful})` : ""}
      </div>
    </div>
  );
};

export default ReviewCard;
