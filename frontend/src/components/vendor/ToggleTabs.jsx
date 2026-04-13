import React from "react";

function ToggleTabs({ activeTab, setActiveTab }) {
  const tabs = ["services", "bookings", "analytics"];

  // Sliding pill position for each tab (3 equal slots)
  const pillStyle = {
    services:  { left: "2%",   width: "30%" },
    bookings:  { left: "34%",  width: "30%" },
    analytics: { left: "67%",  width: "31%" },
  };

  return (
    <div className="flex justify-center lg:justify-start mb-5 mt-5 ml-3">
      <div className="relative flex w-[340px] sm:w-[360px] rounded-full bg-[#f3f4f6] px-3 py-2 text-[#1e293b] font-[Montserrat] overflow-hidden shadow-sm">
        {/* Sliding background pill */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-[#001f3f] transition-all duration-500 ease-in-out"
          style={pillStyle[activeTab] || pillStyle.services}
        />

        {tabs.map((tab) => (
          <button
            key={tab}
            className={`relative z-10 flex-1 text-center cursor-pointer rounded-full text-[11px] sm:text-[12px] font-medium transition-all duration-300 ease-in-out py-2 ${
              activeTab === tab
                ? "text-white font-semibold"
                : "text-[#374151] hover:text-emerald-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ToggleTabs;
