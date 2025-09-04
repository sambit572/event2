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
      {/* Vendor section */}
      <div className="flex items-center gap-1 max-[1024px]:flex-row max-[1024px]:text-[12px] max-[820px]:text-[11px]">
        <FaStore
          className="text-[#001f3f] text-[15px] max-[1024px]:h-[18px] max-[1024px]:w-[18px] max-[820px]:h-[15px] hover:text-white transition"
          onClick={toggleVendorDropdown}
        />

        <span
          className="text-[#001F3F] font-semibold vendorNameText max-[900px]:hidden max-[580px]:hidden max-[460px]:hidden"
          onClick={toggleVendorDropdown}
        >
          {!VendorFirstName ? (
            <span className="font-medium transition-colors">Be a Vendor</span>
          ) : (
            <span className="font-medium">{VendorFirstName}</span>
          )}
        </span>

        <span onClick={toggleVendorDropdown}>
          {showVendorDropdown ? (
            <FaChevronUp className="text-sm text-[#001f3f]" />
          ) : (
            <FaChevronDown className="text-sm text-[#001f3f]" />
          )}
        </span>
      </div>

      {/* Dropdown menu */}
      {showVendorDropdown && (
        <div className="absolute top-[75px] right-[50px] bg-[#e5e5de] border border-white rounded-lg shadow-lg p-4 w-[278px] z-[2000] max-[640px]:top-[60px]">
          <h4 className="text-lg font-semibold text-[#001F3F] text-center mb-1">
            Welcome Vendor
          </h4>
          <p className="text-gray-600 text-center mb-3">
            Access your vendor tools and profile
          </p>

          {/* If NOT logged in → Register + Login */}
          {!VendorFirstName && (
            <>
              <div className="flex justify-between items-center gap-2 mt-3">
                <span className="text-[#001f3f]">New Vendor?</span>
              </div>

              <div className="flex gap-2 mt-3">
                {/* Register */}
                <button
                  className="w-1/2 bg-black hover:bg-gray-800 text-white rounded px-3 py-2 transition"
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
                      navigate("/vendor/register");
                    }
                  }}
                >
                  Register
                </button>

                {/* Login */}
                <button
                  className="w-1/2 bg-blue-500 hover:bg-blue-800 text-white font-bold rounded px-3 py-2 transition"
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-3 rounded"
                  onClick={() => {
                    setShowVendorDropdown(false);
                    navigate("/dashboard");
                  }}
                >
                  My Dashboard
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded"
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
