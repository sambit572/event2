// ProfileMenu.jsx
import { useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaUser, FaHeart, FaSignOutAlt } from "react-icons/fa";
import UserProfileIcon from "./../../../pages/common/UserProfileIcon";

const ProfileMenu = ({
  userFirstName,
  currentUser,
  showProfileDropdown,
  setShowProfileDropdown,
  handleLoginClick,
  handleSignupClick,
  handleLogout,
  navigate,
  setShowVendorDropdown,
  setShowEllipsisDropdown,
}) => {
  const profileRef = useRef(null);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => {
      if (!prev) {
        setShowVendorDropdown(false);
        setShowEllipsisDropdown(false);
      }
      return !prev;
    });
  };

  return (
    <div
      ref={profileRef}
      className="relative flex items-center text-[15px] font-medium cursor-pointer"
    >
      {/* Profile section */}
      <div
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#004080] hover:text-white"
      >
        <span
          className="flex items-center gap-2 max-[1024px]:text-[13px] max-[820px]:text-[12px] max-[640px]:text-[11px]"
          onClick={toggleProfileDropdown}
        >
          {!userFirstName ? (
            <>
              <CgProfile className="text-2xl text-[#001f3f] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              <span className="font-semibold hidden sm:inline md:hidden lg:inline group-hover:text-white transition-colors duration-300">
                Login
              </span>
            </>
          ) : (
            <>
              <UserProfileIcon currentUser={currentUser} />
              <span className="font-semibold hidden sm:inline md:hidden lg:inline group-hover:text-white transition-colors duration-300">
                {`Hi, ${userFirstName}`}
              </span>
            </>
          )}
        </span>
      </div>

      {/* Dropdown menu */}
      {showProfileDropdown && (
        <div
          className="absolute top-[55px] left-[-15px] bg-white border border-gray-200 rounded-2xl shadow-2xl 
                     p-[1rem] w-[220px] z-[2000] cursor-default animate-fadeIn
                     max-[430px]:top-[40px] max-[800px]:left-[-120px]"
        >
          {!userFirstName ? (
            <>
              <h4 className="text-[17px] text-[#001f3f] font-semibold mb-[0.05rem]">
                Welcome
              </h4>
              <p className="text-[13px] text-gray-600 mb-1">
                To access your account and manage services
              </p>

              <div className="flex flex-col gap-[0.5rem]">
                <button
                  onClick={handleSignupClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full 
                             text-[15px] font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] 
                             transition-all duration-300"
                >
                  Sign Up
                </button>
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-gradient-to-r from-[#001f3f] to-[#004080] text-white py-2 rounded-full 
                             text-[15px] font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] 
                             transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="flex items-center gap-2 mb-1 text-[#001f3f] text-[14px] cursor-pointer 
             px-2 py-1 rounded-md transition-all duration-300
             hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white hover:shadow-sm"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate("/profile");
                }}
              >
                <FaUser className="text-base" />
                <span>My Profile</span>
              </div>

              <div
                className="flex items-center gap-2 mb-1 text-[#001f3f] text-[14px] cursor-pointer 
             px-2 py-1 rounded-md transition-all duration-300
             hover:bg-pink-100 hover:text-pink-600 hover:shadow-sm"
                onClick={() => navigate("/wishlist")}
              >
                <FaHeart className="text-base" />
                <span>Wishlist</span>
              </div>

              <div
                className="flex items-center gap-2 text-[#001f3f] text-[14px] cursor-pointer 
             px-2 py-1 rounded-md transition-all duration-300
             hover:bg-red-100 hover:text-red-600 hover:shadow-sm"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="text-base" />
                <span>Sign Out</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
