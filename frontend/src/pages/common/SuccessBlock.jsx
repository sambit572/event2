import PropTypes from "prop-types";
import success from "../../assets/home/categoriesImages/NAMASTE-IMAGE.png";
import "./LoginRegister.css"; // Reuse same styles for consistent layout

const SuccessBlock = ({ onClose }) => {
  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal mt-15px" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {/* Title */}
        <h2 className="login-title">Congratulations!</h2>

        {/* Subtitle */}
        <p className="signup-text" style={{ marginBottom: "12px" }}>
          You Are Logged In Successfully !!
        </p>

        {/* Welcome Text */}
        <h3 className="success-welcome">
          Welcome to Eventsbridge
        </h3>

        {/* Image */}
        <div className="success-image-wrapper">
          <img
            src={success}
            alt="Namaste Icon"
            className="success-image"
          />
        </div>

        {/* Thank You */}
        <h3 className="signup-text success-thankyou">
          Thank you
        </h3>
      </div>
    </div>
  );
};

SuccessBlock.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SuccessBlock;
