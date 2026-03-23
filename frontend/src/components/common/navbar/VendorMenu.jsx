import { useRef } from "react";
import { FaStore, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
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
      {/* Vendor section */}
      <div
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#004080] hover:text-white
                   max-[1024px]:text-[12px] max-[820px]:text-[11px]"
        onClick={toggleVendorDropdown}
      >
        <FaStore className="text-[#001f3f] text-[18px] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
        <span className="text-[#001F3F] font-semibold hidden sm:inline md:hidden lg:inline group-hover:text-white transition-colors duration-300">
          {!VendorFirstName ? "Be a Vendor" : `Hi, ${VendorFirstName}`}
        </span>
      </div>

      {/* Dropdown menu */}
      {showVendorDropdown && (
        <div className="absolute top-[50px] right-[-75px] bg-white border border-gray-200 rounded-2xl shadow-2xl p-[1rem] w-[260px] z-[2000] cursor-default animate-fadeIn max-[640px]:top-[60px]">
          {/* <h4 className="text-[18px] text-[#001f3f] font-semibold mb-1 text-center">
            Welcome Vendor 
          </h4>
          <p className="text-[13px] text-gray-600 mb-1 text-center">
            Access your tools and manage services
          </p> */}

          {/* If NOT logged in → Register + Login */}
          {!VendorFirstName && (
            <>
              {/* <div className="flex justify-between items-center gap-2 mt-1 cursor-default">
                <span className="text-[#001f3f] font-medium">New Vendor?</span>
              </div> */}
              <h4 className="text-[18px] text-[#001f3f] font-semibold mb-1 text-center">
                Welcome Vendor
              </h4>
              <p className="text-[13px] text-gray-600 mb-1 text-center">
                Access your tools and manage services
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="w-1/2 bg-[#001f3f] text-white rounded-full py-2 text-[15px] font-semibold shadow-md 
                             hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
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

                <button
                  className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-2 text-[15px] font-semibold shadow-md 
                             hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
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
              <div className="flex flex-col gap-[0.05rem]">
                <div
                  className="flex items-center gap-3 text-[#001f3f] text-[15px] cursor-pointer 
                             px-3 py-2 rounded-lg transition-all duration-300
                             hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white hover:shadow-md"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    navigate("/dashboard");
                  }}
                >
                  <FaTachometerAlt className="text-lg" />
                  <span>My Dashboard</span>
                </div>

                <div
                  className="flex items-center gap-3 text-[#001f3f] text-[15px] cursor-pointer 
                             px-3 py-2 rounded-lg transition-all duration-300
                             hover:bg-red-100 hover:text-red-600 hover:shadow-sm"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    vendorLogout();
                  }}
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Sign Out</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorMenu;
