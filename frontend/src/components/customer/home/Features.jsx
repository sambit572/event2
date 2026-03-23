import React from "react";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaHandshake,
  FaCreditCard,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

const features = [
  { text: "Multiple Vendors", icon: <FaUsers /> },
  { text: "Transparent Pricing", icon: <FaMoneyCheckAlt /> },
  { text: "Live Negotiation", icon: <FaHandshake /> },
  { text: "EMI for All", icon: <FaCreditCard /> },
  { text: "Verified Vendors", icon: <FaCheckCircle /> },
  { text: "Secure Payments", icon: <FaLock /> },
];

const Features = () => {
  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white ">
      <div className="flex gap-10 animate-scroll whitespace-nowrap">
        {[...features, ...features].map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-gray-700 text-[16px] font-medium"
          >
            <span className="text-5xl  text-blue-600">{f.icon}</span>
            <span className="font-extrabold">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
