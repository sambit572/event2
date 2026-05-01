// src/components/common/ThreeDot.jsx
import { useRef, useState, useEffect } from "react";
import { FaBars, FaCompass, FaMapMarkerAlt, FaCalendarAlt, FaShoppingCart } from "react-icons/fa";
import { FcAbout, FcAssistant } from "react-icons/fc";
import { MdStorefront } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Explore",  icon: <FaCompass className="text-blue-500" />,      path: "/" },
  { label: "Venues",   icon: <FaMapMarkerAlt className="text-rose-500" />,  path: "/venues" },
  { label: "Planners", icon: <FaCalendarAlt className="text-green-500" />,  path: "/planners" },
];

const ThreeDot = ({
  showEllipsisDropdown,
  setShowEllipsisDropdown,
  setShowVendorDropdown,
  setShowProfileDropdown,
  VendorFirstName,
  cartCount,
  handleAddToCart,
  onOpenVendorLogin,
  vendorLogout,
}) => {
  const ellipsisRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={ellipsisRef}
      className="flex items-center cursor-pointer text-[15px] font-medium ml-2 mr-2"
    >
      {/* Hamburger (3-line) icon */}
      <FaBars
        size={20}
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
            shadow-md p-3 w-[220px] z-[2000] cursor-auto
            max-[820px]:right-[10px]
            max-[430px]:top-[60px]
          "
        >
          {/* Mobile-only section */}
          {isMobile && (
            <>
              {/* Navigation links */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold px-3 pb-1 pt-0.5">
                Navigation
              </p>
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[14px] rounded 
                    ${location.pathname === item.path ? "bg-[#f8dd8b]" : "bg-white"} 
                    text-[#001f3f] hover:font-bold hover:bg-gray-100 transition`}
                  onClick={() => {
                    navigate(item.path);
                    setShowEllipsisDropdown(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}

              <hr className="my-2 border-gray-300" />

              {/* Vendor section */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold px-3 pb-1">
                Vendor
              </p>
              {VendorFirstName ? (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[14px] rounded bg-white text-[#001f3f] hover:font-bold hover:bg-gray-100 transition"
                    onClick={() => {
                      navigate("/vendor/dashboard");
                      setShowEllipsisDropdown(false);
                    }}
                  >
                    <MdStorefront className="text-purple-500 text-[16px]" />
                    My Dashboard
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[14px] rounded bg-white text-red-500 hover:font-bold hover:bg-red-50 transition"
                    onClick={() => {
                      vendorLogout && vendorLogout();
                      setShowEllipsisDropdown(false);
                    }}
                  >
                    <MdStorefront className="text-[16px]" />
                    Vendor Logout
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[14px] rounded bg-white text-[#001f3f] hover:font-bold hover:bg-gray-100 transition"
                  onClick={() => {
                    onOpenVendorLogin && onOpenVendorLogin();
                    setShowEllipsisDropdown(false);
                  }}
                >
                  <MdStorefront className="text-purple-500 text-[16px]" />
                  Be a Vendor
                </div>
              )}

              {/* Cart */}
              <div
                className="flex items-center gap-2 px-3 py-2 mt-1 cursor-pointer text-[14px] rounded bg-white text-[#001f3f] hover:font-bold hover:bg-gray-100 transition"
                onClick={() => {
                  handleAddToCart && handleAddToCart();
                  setShowEllipsisDropdown(false);
                }}
              >
                <FaShoppingCart className="text-[#001f3f] text-[15px]" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </div>

              <hr className="my-2 border-gray-300" />

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold px-3 pb-1">
                More
              </p>
            </>
          )}

          {/* About Us */}
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[15px] rounded 
              ${location.pathname === "/about_us" ? "bg-[#f8dd8b]" : "bg-white"} 
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
