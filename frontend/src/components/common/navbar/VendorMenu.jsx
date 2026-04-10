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
      {/* Vendor section - Trigger button */}
      <div
        className="group flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-300
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#003366] hover:text-white
                   hover:shadow-[0_0_20px_-5px] hover:shadow-[#001f3f]/40
                   max-[1024px]:text-[12px] max-[820px]:text-[11px]"
        onClick={toggleVendorDropdown}
      >
        <FaStore className="text-[#001f3f] text-[20px] transition-all duration-300 group-hover:text-white group-hover:scale-110 group-active:scale-95" />
        <span className="text-[#001F3F] font-semibold hidden sm:inline md:hidden lg:inline group-hover:text-white transition-colors duration-300">
          {!VendorFirstName ? "Be a Vendor" : `Hi, ${VendorFirstName}`}
        </span>
      </div>

      {/* Dropdown menu */}
      {showVendorDropdown && (
        <div className="absolute top-[50px] right-[-75px] bg-white border border-gray-100 rounded-3xl shadow-[0_25px_50px_-12px_rgb(0,31,63)] p-5 w-[280px] z-[2000] cursor-default animate-fadeIn overflow-hidden max-[640px]:top-[60px]">

          {/* If logged in → Header + Dashboard + Sign Out */}
          {VendorFirstName && (
            <>
              <div className="flex flex-col gap-3">

                {/* Vendor Header - same px-5 py-4 padding as the cards below */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-2xl px-5 py-4 shadow-inner">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-[#3b82f6] text-white font-bold text-[18px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] ring-2 ring-white/30 shrink-0">
                    {VendorFirstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-[15px] leading-tight tracking-tight truncate">{VendorFirstName}</p>
                    <div className="flex items-center gap-1.5 text-green-400 text-[12px] font-medium mt-0.5">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                      </span>
                      <span>Vendor Active</span>
                    </div>
                  </div>
                </div>

                {/* My Dashboard */}
                <div
                  className="group flex items-center gap-4 cursor-pointer px-5 py-4 rounded-2xl transition-all duration-300
                             bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 hover:shadow-xl hover:-translate-y-0.5"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    navigate("/dashboard");
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-blue-600 shadow-md group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shrink-0">
                    <FaTachometerAlt className="text-white text-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#001f3f] font-semibold text-[15px] block">My Dashboard</span>
                    <span className="text-gray-500 text-[12.5px]">Manage your services</span>
                  </div>
                  <span className="text-gray-300 text-xl leading-none group-hover:text-[#3b82f6] transition-colors shrink-0">›</span>
                </div>

                {/* Sign Out */}
                <div
                  className="group flex items-center gap-4 cursor-pointer px-5 py-4 rounded-2xl transition-all duration-300
                             bg-gradient-to-r from-red-50 to-white hover:from-red-100 hover:to-red-50 hover:shadow-xl hover:-translate-y-0.5"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    vendorLogout();
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 shadow-md group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shrink-0">
                    <FaSignOutAlt className="text-white text-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-red-600 font-semibold text-[15px] block">Sign Out</span>
                    <span className="text-gray-500 text-[12.5px]">Log out of your account</span>
                  </div>
                  <span className="text-gray-300 text-xl leading-none group-hover:text-red-600 transition-colors shrink-0">›</span>
                </div>

              </div>
            </>
          )}

          {/* If NOT logged in → Register + Login */}
          {!VendorFirstName && (
            <>
              <div className="text-center mb-5">
                <h4 className="text-[19px] text-[#001f3f] font-semibold tracking-tight">Welcome Vendor 👋</h4>
                <p className="text-[13.5px] text-gray-600 mt-1">Access your tools and manage services</p>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-[#001f3f] text-white rounded-2xl py-3.5 text-[15px] font-semibold shadow-lg 
                             hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    if (!userFirstName) {
                      const toastId = toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-toast-wiggle" : "animate-leave"
                          } bg-white border cursor-pointer border-[#001f3f] text-black px-6 py-3 rounded-2xl shadow-xl`}
                        >
                          <span className="font-semibold block whitespace-nowrap">
                            Please register as a user first.
                          </span>
                        </div>
                      ));
                      setTimeout(() => toast.dismiss(toastId), 2200);
                    } else {
                      navigate("/vendor/register");
                    }
                  }}
                >
                  <FaStore className="text-lg" />
                  Register
                </button>

                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-3.5 text-[15px] font-semibold shadow-lg 
                             hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    if (!userFirstName) {
                      const toastId = toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-toast-wiggle" : "animate-leave"
                          } bg-white border cursor-pointer border-[#001f3f] text-black px-6 py-3 rounded-2xl shadow-xl`}
                        >
                          <span className="font-semibold block whitespace-nowrap">
                            Please register as a user first.
                          </span>
                        </div>
                      ));
                      setTimeout(() => toast.dismiss(toastId), 2200);
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
        </div>
      )}
    </div>
  );
};

export default VendorMenu;
