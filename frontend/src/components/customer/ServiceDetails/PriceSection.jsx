import { BsCurrencyRupee } from "react-icons/bs";
import "./PriceSection.css";

const PriceSection = ({ price, originalPrice, discountPercent }) => {
  return (
    <div className="price-section">
      <div className="current-price">
        <BsCurrencyRupee className="rupee-icon" />
        <span>{price}</span>
      </div>

      <div className="original-price">
        <BsCurrencyRupee className="rupee-icon" />
        <span>{originalPrice}</span>
      </div>

      <div className="discount">{discountPercent}% off</div>
    </div>
  );
};

export default PriceSection;
