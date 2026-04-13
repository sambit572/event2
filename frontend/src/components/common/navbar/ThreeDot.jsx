// src/components/common/ThreeDot.jsx
import { useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { FcAbout, FcAssistant } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";

const ThreeDot = ({
  showEllipsisDropdown,
  setShowEllipsisDropdown,
  setShowVendorDropdown,
  setShowProfileDropdown,
}) => {
  const ellipsisRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      ref={ellipsisRef}
      className="flex items-center cursor-pointer text-[15px] font-medium ml-2 mr-2"
    >
      {/* 3 Dot Icon */}
      <FaEllipsisV
        className="text-[#001f3f]"
        onClick={() => {
          setShowEllipsisDropdown((prev) => {
            if (!prev) {
              setShowVendorDropdown(false);
              setShowProfileDropdown(false);
            }
            return !prev;
          });
        }}
      />

      {/* Dropdown Menu */}
      {showEllipsisDropdown && (
        <div
          className="
            absolute top-[75px] right-[5px] bg-[#e5e5de] rounded-lg border border-[#001f3f] 
            shadow-md p-3 w-[200px] z-[2000] cursor-auto
            max-[820px]:right-[10px]
            max-[430px]:top-[60px]
          "
        >
          {/* About Us */}
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[15px] rounded 
              ${
                location.pathname === "/about_us" ? "bg-[#f8dd8b]" : "bg-white"
              } 
              text-[#001f3f] hover:font-bold hover:bg-gray-100 transition`}
            onClick={() => {
              navigate("/about_us");
              setShowEllipsisDropdown(false);
            }}
          >
            <FcAbout className="text-[16px]" /> About Us
          </div>

          {/* Help Us */}
          <div
            className={`flex items-center cursor-pointer gap-2 px-3 py-2 text-[15px] rounded 
              ${location.pathname === "/help_us" ? "bg-[#f8dd8b]" : "bg-white"} 
              text-[#001f3f] hover:font-bold hover:bg-gray-100 transition`}
            onClick={() => {
              navigate("/help_us");
              setShowEllipsisDropdown(false);
            }}
          >
            <FcAssistant className="text-[16px]" /> Help Us
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDot;