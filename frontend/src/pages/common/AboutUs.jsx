import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import AboutUs_1 from "../../assets/home/AboutUs_1.jpeg";
import Aboutus_2 from "../../assets/home/Aboutus_2.png";
import AboutUs_3 from "../../assets/home/AboutUs_3.png";
import Design from "../../components/common/aboutus/Design";
import Team from "../../components/common/aboutus/Team";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800 px-4 sm:px-6 md:px-10 py-10 space-y-20">
      {/* First Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="w-full lg:w-1/2">
          <img src={AboutUs_1} alt="About Us" className="w-100% rounded-xl shadow-md" />
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
            Your dream events start's with right vendors
          </h2>
          <p className="text-sm md:text-base">
            Eventsbridge is a next-generation Platform-as-a-Service (PaaS) that
            simplifies how events are planned and managed by connecting
            customers with the right vendors — effortlessly, efficiently, and
            digitally... We help you make lasting memories.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>
                For Vendors: Expand your reach, manage bookings effortlessly, and
                grow your business.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>
                For Customers: Find trusted services, compare options, and book
                with confidence.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Design />

      {/* Second Section (Reversed Layout) */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
        <div className="w-full lg:w-1/2 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
            We Bring Vendors & Customers Together
          </h2>
          <p className="text-sm md:text-base">
            Choosing Eventsbridge means choosing convenience, quality, and
            confidence... Eventsbridge makes every event effortless and extraordinary.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>AI-driven service discovery & recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>Secure booking and transparent reviews</span>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-1/2">
          <img src={Aboutus_2} alt="About Platform" className="w-full rounded-xl shadow-md" />
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col lg:flex-row items-start gap-10">
        <div className="w-full lg:w-1/2">
          <img src={AboutUs_3} alt="About Us" className="w-full rounded-xl shadow-md" />
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
            Your Perfect Event Starts with Eventsbridge
          </h2>
          <p>
            Eventsbridge offers an extensive range of event services that cater
            to every element of your big day — traditional, cultural, or modern.
          </p>
          <p>
            We’ve curated a wide array of services across regions and traditions,
            making us your ultimate one-stop booking platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-purple-700">🎵 Music & Entertainment</h3>
              <ul className="list-disc list-inside text-sm">
                <li>DJs</li>
                <li>Brass bands</li>
                <li>Regional bands</li>
                <li>Orchestras (dance and singing)</li>
                <li>Magicians</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">🎀 Decor & Setup</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Tenthouse and themed decorations</li>
                <li>Flower decorators</li>
                <li>Personalized setups</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">🍽 Culinary Delights</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Premium catering services</li>
                <li>Diverse menus (regional, traditional, international)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">📸 Capture Moments</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Photographers</li>
                <li>Videographers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">🛐 Religious Services</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Pandits</li>
                <li>Fathers</li>
                <li>Maulvis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">💄 Beauty & Grooming</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Professional makeup artists</li>
                <li>Mehendi artists</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">🚗 Grand Entries</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Horse carts</li>
                <li>Luxury grooming cars</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-700">🎆 Special Effects</h3>
              <ul className="list-disc list-inside text-sm">
                <li>Fireworks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Team />
    </div>
  );
};

export default AboutUs;
