import "./VendorButton.css";

const Button = ({ handleBack, handleNext }) => {
  return (
    <div className="navigation-buttons">
      <button type="button" onClick={handleBack} className="back-button">
        <span className="btn-content">
          <img
            src="/public/back.png"
            alt="Back"
            className="button-icon left-icon"
          />
          Back
        </span>
      </button>

      <button type="button" onClick={handleNext} className="submit-button">
        <span className="btn-content">
          Next
          <img
            src="/public/next.png"
            alt="Next"
            className="button-icon right-icon"
          />
        </span>
      </button>
    </div>
  );
};

export default Button;
