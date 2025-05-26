import { IoIosStar } from "react-icons/io";

const RatingSection = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div className="rating" style={{ display: "flex", alignItems: "center" }}>
        <div>4 </div>
        <div>
          <IoIosStar />
        </div>
      </div>
      <span style={{ color: "black", fontSize: "19px", fontWeight: "400" }}>
        3901 rating, 560 reviews
      </span>
    </div>
  );
};

export default RatingSection;
