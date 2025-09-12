// VendorMenu.jsx
import { useRef } from "react";
import { FaStore, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-hot-toast";

const VendorMenu = ({
  VendorFirstName,
  userFirstName,
  showVendorDropdown,
  setShowVendorDropdown,
  setShowProfileDropdown,
  setShowEllipsisDropdown,
  navigate,
  onOpenVendorLogin,
  vendorLogout,
}) => {
  const vendorRef = useRef(null);

  const toggleVendorDropdown = () => {
    setShowVendorDropdown((prev) => {
      if (!prev) {
        setShowProfileDropdown(false);
        setShowEllipsisDropdown(false);
      }
      return !prev;
    });
  };

  return (
    <div
      ref={vendorRef}
      className="relative flex items-center text-[15px] font-medium cursor-pointer"
    >
      {/* Vendor section with group hover */}
      <div
        className="group flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#004080] hover:text-white
                   max-[1024px]:text-[12px] max-[820px]:text-[11px]"
      >
        <FaStore
          className="text-[#001f3f] text-[15px] transition-transform duration-300 group-hover:text-white group-hover:scale-110 
                     max-[1024px]:h-[18px] max-[1024px]:w-[18px] max-[820px]:h-[15px]"
          onClick={toggleVendorDropdown}
        />

        <span
          className="text-[#001F3F] font-semibold max-[900px]:hidden max-[580px]:hidden group-hover:text-white transition-colors duration-300"
          onClick={toggleVendorDropdown}
        >
          {!VendorFirstName ? (
            <span className="font-semibold">Be a Vendor</span>
          ) : (
            <span className="font-semibold">{VendorFirstName}</span>
          )}
        </span>

        <span
          onClick={toggleVendorDropdown}
          className="group-hover:text-white group-hover:scale-110 transition-transform duration-300"
        >
          {showVendorDropdown ? (
            <FaChevronUp className="text-sm" />
          ) : (
            <FaChevronDown className="text-sm" />
          )}
        </span>
      </div>

      {/* Dropdown menu */}
      {showVendorDropdown && (
        <div className="absolute top-[45px] right-[-1px] bg-[#f8f8f5] cursor-default border border-gray-200 rounded-xl shadow-xl p-[0.75rem] w-[278px] z-[2000] animate-fadeIn max-[640px]:top-[60px]">
          <h4 className="text-lg font-semibold text-[#001F3F] text-center">
            Welcome Vendor
          </h4>
          <p className="text-gray-600 text-center mb-1 text-[13px]">
            Access your vendor tools and profile
          </p>

          {/* If NOT logged in → Register + Login */}
          {!VendorFirstName && (
            <>
              <div className="flex justify-between items-center gap-2 mt-[0.2rem] cursor-default">
                <span className="text-[#001f3f]">New Vendor?</span>
              </div>

              <div className="flex gap-2 mt-[0.4rem]">
                {/* Register */}
                <button
                  className="w-1/2 bg-black text-white rounded px-3 py-2 transition-all duration-300
                             hover:bg-gray-800 hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setShowVendorDropdown(false);

                    if (!userFirstName) {
                      const toastId = toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-toast-wiggle" : "animate-leave"
                          } bg-white border cursor-pointer border-[#001f3f] text-black px-6 py-3 rounded-xl shadow-lg`}
                        >
                          <span className="font-semibold block whitespace-nowrap">
                            Please register as a user first.
                          </span>
                        </div>
                      ));
                      setTimeout(() => toast.dismiss(toastId), 2000);
                    } else {
                      navigate("/vendor/register");
                    }
                  }}
                >
                  Register
                </button>

                {/* Login */}
                <button
                  className="w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded px-3 py-2 transition-all duration-300
                             hover:from-indigo-600 hover:to-blue-600 hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setShowVendorDropdown(false);

                    if (!userFirstName) {
                      const toastId = toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-toast-wiggle" : "animate-leave"
                          } bg-white border border-[#001f3f] text-black px-6 py-3 rounded-xl shadow-lg`}
                        >
                          <span className="font-semibold block whitespace-nowrap">
                            Please register as a user first.
                          </span>
                        </div>
                      ));
                      setTimeout(() => toast.dismiss(toastId), 2000);
                    } else {
                      onOpenVendorLogin();
                    }
                  }}
                >
                  Login
                </button>
              </div>
            </>
          )}

          {/* If logged in → Dashboard + Sign Out */}
          {VendorFirstName && (
            <>
              <hr className="my-2 border-gray-300" />
              <div className="flex flex-col gap-2">
                <button
                  className="bg-[#7f00ff] text-white px-3 py-3 rounded transition-all duration-300 hover:bg-[#5e00cc] hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    navigate("/dashboard");
                  }}
                >
                  My Dashboard
                </button>

                <button
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-3 rounded transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    vendorLogout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorMenu;
