import React from "react";

function ToggleTabs({ activeTab, setActiveTab }) {
  return (
    <div
      className="
        flex justify-center lg:justify-start
        mb-5 mt-5 ml-3
      "
    >
      <div
        className="
          relative flex 
          w-[280px] sm:w-[280px] 
          rounded-full bg-[#f3f4f6] 
          px-3 py-2 
          text-[#1e293b] 
          font-[Montserrat] 
          overflow-hidden shadow-sm
        "
      >
        {/* Sliding background */}
        <div
          className={`absolute top-1.5 bottom-1.5 rounded-full bg-[#001f3f] transition-all duration-500 ease-in-out 
    ${
      activeTab === "services"
        ? "left-[4%] w-[42%] sm:left-[6%] sm:w-[40%]"
        : "left-[50%] w-[44%] sm:left-[52%] sm:w-[42%]"
    }`}
        />

        {/* SERVICES button */}
        <button
          className={`relative z-10 flex-1 text-center cursor-pointer rounded-full 
            text-[13px] sm:text-[14px] font-medium 
            transition-all duration-300 ease-in-out 
            py-2
            ${
              activeTab === "services"
                ? "text-white font-semibold"
                : "text-[#374151] hover:text-emerald-600"
            }`}
          onClick={() => setActiveTab("services")}
        >
          SERVICES
        </button>

        {/* BOOKINGS button */}
        <button
          className={`relative z-10 flex-1 text-center cursor-pointer rounded-full 
            text-[13px] sm:text-[14px] font-medium 
            transition-all duration-300 ease-in-out 
            py-2
            ${
              activeTab === "bookings"
                ? "text-white font-semibold"
                : "text-[#374151] hover:text-emerald-600"
            }`}
          onClick={() => setActiveTab("bookings")}
        >
          BOOKINGS
        </button>
      </div>
    </div>
  );
}

export default ToggleTabs;
