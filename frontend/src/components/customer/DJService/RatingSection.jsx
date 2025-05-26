import { IoIosStar } from "react-icons/io";
import "../DJService/RatingSection.css"; // Separate CSS for better maintainability

const RatingSection = () => {
  return (
    <div className="rating-section">
      <div className="rating-box">
        <span className="rating-value">4</span>
        <IoIosStar className="star-icon" />
      </div>
      <span className="rating-text">3901 ratings, 560 reviews</span>
    </div>
  );
};

export default RatingSection;
