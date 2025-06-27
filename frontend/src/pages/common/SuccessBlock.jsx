import PropTypes from "prop-types";
import "./LoginRegister.css"; // Reuse styles if already defined


const SuccessBlock = ({ showSuccessIcon }) => {

  return (
    <div className="success-container">
      <h2 className="success-heading">Congratulations</h2>
      <p>Welcome 🎉 to Eventsbridge</p>

      {showSuccessIcon && <div className="success-icon"></div>}

      <h3 className="success-heading">Thank you!</h3>
      <p className="success-message">
        You have logged in successfully !! 
      </p>
    </div>
  );
};

SuccessBlock.propTypes = {
  showSuccessIcon: PropTypes.bool.isRequired,
};

export default SuccessBlock;
