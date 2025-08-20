import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="text-center bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg mx-auto border border-gray-100">
        {/* Rocket Icon */}
        <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 hover:scale-110">
          <svg
            className="w-16 h-16 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Almost There!
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg mb-8">
          Our secure payment gateway is under construction and will be launching
          soon.
        </p>

        {/* Informational Text */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8">
          <p className="text-gray-700">
            We're working hard to bring you a seamless checkout experience.
            Thank you for your patience!
          </p>
        </div>

        {/* Go to Homepage Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
