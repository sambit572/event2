import PropTypes from "prop-types";
import namaste from "../../assets/home/categoriesImages/NAMASTE.png";

const SuccessBlock = ({ onClose }) => {
  return (
    <div
      className="fixed top-[-2px] left-0 w-full min-h-[calc(120vh-100px)] backdrop-blur-lg flex justify-center items-start z-[999] overflow-y-auto p-5 box-border scrollbar-hide"
      onClick={onClose}
    >
      <div
        className="relative bg-[#e5e5de] p-8 rounded-xl w-full min-h-[90vh] max-w-[420px] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] animate-[modalSlideIn_0.3s_ease-out] scrollbar-hide mt-[15px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-4 bg-transparent border-none text-2xl font-bold cursor-pointer text-[#333] hover:text-black z-[100]"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-2xl text-center mt-5 mb-5">
          Congratulations!
        </h2>

        {/* Subtitle */}
        <p className="font-semibold text-lg text-center mt-5 text-[#001f3f]">
          You Are Logged In Successfully !!
        </p>

        {/* Image */}
        <div className="w-full flex justify-center">
          <img
            src={namaste}
            alt="Success Animation"
            className="w-[90%] max-w-[250px] mb-2 object-contain animate-fadeIn"
          />
        </div>

        <h3 className="text-xl text-center font-bold text-[#001f3f] mt-2">
          Welcome to Eventsbridge
        </h3>

        {/* Thank You */}
        <h3 className="text-center font-semibold mt-[10px] mb-[10px] text-[15px] text-[#555]">
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
