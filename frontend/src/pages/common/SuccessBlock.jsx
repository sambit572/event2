import { useEffect } from "react";
import PropTypes from "prop-types";
import namaste from "/categories/namaste1.webp";

const SuccessBlock = ({ onClose, autoCloseTime = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [onClose, autoCloseTime]);

  return (
    <div
      className="login-wrapper flex justify-center items-center bg-black/40 backdrop-blur-sm z-[10000] p-4"
      onClick={onClose}
    >
      <div
        className=" login-modal relative bg-[#fff] rounded-2xl shadow-2xl border border-white/10 
        w-full max-w-[420px] min-h-[50vh] sm:min-h-[45vh] md:min-h-[42vh] 
        flex flex-col justify-center items-center p-6 animate-fadeInScale text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-2xl font-bold text-gray-700 hover:text-black transition-colors"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#001f3f] mt-2 mb-3">
          Congratulations!
        </h2>

        {/* Subtitle */}
        <p className="text-[#001f3f] font-semibold text-base md:text-lg mb-4">
          You Are Logged In Successfully !!
        </p>

        {/* Image */}
        <img
          decoding="async"
          loading="lazy"
          src={namaste}
          alt="Success"
          className="w-[60%] max-w-[200px] mb-4 animate-fadeIn"
        />

        {/* Welcome Text */}
        <h3 className="text-xl md:text-2xl font-bold text-[#001f3f] mb-1">
          Welcome to Eventsbridge
        </h3>

        <p className="text-sm md:text-base font-semibold text-[#555]">
          Thank you for joining us!
        </p>
      </div>
    </div>
  );
};

SuccessBlock.propTypes = {
  onClose: PropTypes.func.isRequired,
  autoCloseTime: PropTypes.number,
};

export default SuccessBlock;
