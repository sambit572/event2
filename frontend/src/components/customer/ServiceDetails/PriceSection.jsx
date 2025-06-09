import { BsCurrencyRupee } from "react-icons/bs";
import "./PriceSection.css"; // Ensure your CSS file is imported

const PriceSection = () => {
  return (
    <div className="price-section">
      <div className="current-price">
        <BsCurrencyRupee className="rupee-icon" />
        <span>10000</span>
      </div>

      <div className="original-price">
        <BsCurrencyRupee className="rupee-icon" />
        <span>15000</span>
      </div>

      <div className="discount">40% off</div>
    </div>
  );
};

export default PriceSection;
