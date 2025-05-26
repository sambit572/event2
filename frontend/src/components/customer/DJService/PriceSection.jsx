import { BsCurrencyRupee } from "react-icons/bs";

const PriceSection = () => {
  return (
    <div className="price">
      <div className="rupee">
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            fontSize: "26px",
            marginLeft: "30px",
            marginTop: "15px",
          }}
        >
          <BsCurrencyRupee style={{ fontSize: "25px" }} />
          <span>10000</span>
        </div>
      </div>

      <div className="rupee1">
        <div
          style={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            marginLeft: "100px",
            marginTop: "15px",
          }}
        >
          <BsCurrencyRupee style={{ fontSize: "20px" }} />
          <span>15000</span>
        </div>
      </div>

      <h2
        style={{
          color: "green",
          marginLeft: "80px",
          textAlign: "center",
          marginTop: "15px",
        }}
      >
        40% off
      </h2>
    </div>
  );
};

export default PriceSection;
