import PropTypes from "prop-types";
import namaste from "../../assets/home/categoriesImages/NAMASTE.png";
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
        <h2 className="font-bold text-4xl text-center mt-5 mb-5">
          Congratulations!
        </h2>

        {/* Subtitle */}
        <p className="font-semibold text-1xl text-center mt-5 text-[#001f3f]">
          You Are Logged In Successfully !!
        </p>

        {/* Image */}
        <div className="success-image-wrapper">
          <img
            src={namaste}
            alt="Success Animation"
            className="success-image"
          />
        </div>

        <h3 className="success-welcome">Welcome to Eventsbridge</h3>

        {/* Thank You */}
        <h3 className="signup-text font-semibold ml-15 mt-[10px] mb-[10px] text-[15px]">
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
