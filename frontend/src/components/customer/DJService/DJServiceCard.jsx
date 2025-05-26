import PriceSection from "../../customer/DJService/PriceSection.jsx";
import RatingSection from "../DJService/RatingSection.jsx";
import DescriptionSection from "../DJService/DescriptionSection.jsx";
import DJDetailsSection from "../DJService/DJDetailsSection.jsx";

const DJServiceCard = () => {
  return (
    <div
      style={{
        border: "1px solid lightgrey",
        borderRadius: "5px",
        height: "650px",
        padding: "30px",
      }}
    >
      <h2>Wedding DJ Service – Premium Entertainment for Your Big Day</h2>

      <PriceSection />
      <RatingSection />
      <DescriptionSection />
      <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
      <DJDetailsSection />
    </div>
  );
};

export default DJServiceCard;
