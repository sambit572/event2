import { BiLike } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";

const ReviewCard = ({ review }) => {
  if (!review) return null; // Safeguard for undefined prop

  const [isExpanded, setIsExpanded] = useState(false);

  // Limit message to ~120 chars (≈ 2 lines), adjust as needed
  const charLimit = 120;
  const isLong = review.reviewMessage?.length > charLimit;
  const displayMessage = isExpanded
    ? review.reviewMessage
    : review.reviewMessage?.slice(0, charLimit) + (isLong ? "..." : "");

  return (
    <div style={{ borderBottom: "1px solid #eee", padding: "16px 0" }}>
      {/* User Full Name */}
      <h4 style={{ marginBottom: "8px" }}>
        {review.userDetails?.fullName || review.userName || "Anonymous"}
      </h4>

      {/* Rating + Date */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          color: "#001f3f",
          gap: "10px",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        {/* Rating badge */}
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
        {/* Review Date */}
        <span style={{ color: "#666" }}>
          • Posted on {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Review Message with Read More / Read Less */}
      <p
        style={{ fontSize: "14px", marginBottom: "4px" }}
        className="text-black"
      >
        {displayMessage}
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              fontSize: "14px",
              marginLeft: "7px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>

      {/* Optional Images (if you plan to store images in reviews later) */}
      {review.images?.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            color: "#001f3f",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          {review.images.map((img, idx) => (
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
                decoding="async"
                loading="lazy"
                src={img}
                alt={`review-${idx}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
// This component displays a single review card with user details, rating, review message, optional images, and helpful count.
