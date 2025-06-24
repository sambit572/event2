import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLock,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
} from 'react-icons/fa';
import bgBanner from '../../assets/home/bgbanner.jpeg'; // Adjust path as needed

const HelpUs = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Top Section: Banner */}
        <div
          className="w-full max-w-5xl min-h-[420px] relative bg-cover bg-center rounded-xl overflow-hidden shadow-lg mx-auto"
          style={{
            backgroundImage: `url(${bgBanner})`,
          }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 z-10">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-4 text-black max-w-[500px]">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 drop-shadow-sm">
                Our Help Center
              </h1>

              <p className="text-black text-sm sm:text-base leading-relaxed">
                We're always happy to help! Our team is available 24/7 to assist with event planning,
                vendor support, or just friendly guidance.
              </p>

              <p className="text-black text-sm sm:text-base leading-relaxed md:block">
                Our support team is just a message away. Whether you're planning your first event or managing a complex setup, we're here to simplify every step for you.
              </p>

              {showMore && (
                <p className="text-sm sm:text-base leading-relaxed text-black transition-all duration-300 ease-in-out">
                  You can reach us via live chat, email, or call. We’re committed to providing real-time
                  support for your events with expert advice and quick solutions tailored to your needs.
                </p>
              )}

              <button
                className="mt-2 bg-white text-purple-700 px-4 py-2 rounded hover:bg-purple-100 hover:shadow-md hover:scale-105 transition-all font-semibold"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show Less" : "Read More"}
              </button>
            </div>

            {/* Optional Right Side (you can add image or icons here if needed) */}
            <div className="w-full lg:w-1/2 hidden lg:block"></div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center px-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-700">We’re here to support you</h1>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center px-2">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaLock className="text-4xl text-purple-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg">100% SECURE PAYMENTS</h3>
            <p className="text-g mt-2">
              Moving your card details to a much more secured place
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg">TRUSTPAY</h3>
            <p className="text-gray-600 mt-2">
              100% Payment Protection. Easy Return Policy
            </p>
          </div>
          <div
            onClick={() => navigate('/help-center')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <FaHeadset className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg">HELP CENTER</h3>
            <p className="text-gray-600 mt-2">
              Need help? Reach out to our support team — we're here for you.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaMobileAlt className="text-4xl text-blue-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg">BOOK ON THE GO</h3>
            <p className="text-gray-600 mt-2">
              Download the app and enjoy app-only offers at your fingertips
            </p>
          </div>
        </div>

        {/* Wedding Help Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center">💒 Wedding Planning Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <h4 className="font-semibold text-purple-700">Vendor Coordination</h4>
              <p className="text-sm text-gray-600">
                Need help managing caterers, decorators or photographers? We’ve got you covered.
              </p>
              <a onClick={() => navigate('/help-center')} className="text-base text-purple-700 cursor-pointer">Connect Us</a>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <h4 className="font-semibold text-purple-700">Guest Management</h4>
              <p className="text-sm text-gray-600">
                Our team helps you track RSVPs, dietary preferences, and accommodations for guests.
              </p>
              <a onClick={() => navigate('/help-center')} className="text-base text-purple-700 cursor-pointer">Connect Us</a>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <h4 className="font-semibold text-purple-700">Emergency Contact</h4>
              <p className="text-sm text-gray-600">
                Available 24/7 for any unexpected wedding-day issues. Quick and calm solutions.
              </p>
              <a onClick={() => navigate('/help-center')} className="text-base text-purple-700 cursor-pointer">Connect Us</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpUs;
