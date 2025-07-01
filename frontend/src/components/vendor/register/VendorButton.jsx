import "./VendorButton.css";

const Button = ({ onBack, onNext }) => {
  return (
    <div className="navigation-buttons">
      <button type="button" onClick={onBack} className="back-button">
        <span className="btn-content">
          <img src="/back.png" alt="Back" className="button-icon left-icon" />
          Back
        </span>
      </button>

      <button type="button" onClick={onNext} className="submit-button">
        <span className="btn-content">
          Next
          <img src="/next.png" alt="Next" className="button-icon right-icon" />
        </span>
      </button>
    </div>
  );
};

export default Button;
