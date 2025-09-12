// ProfileMenu.jsx
import { useRef } from "react";
import { CgProfile } from "react-icons/cg";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
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
      {/* Profile section with group hover */}
      <div
        className="group flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300 
                   hover:bg-gradient-to-r hover:from-[#001f3f] hover:to-[#004080] hover:text-white"
      >
        <span
          className="flex items-center gap-2 max-[1024px]:text-[13px] max-[820px]:text-[12px] max-[640px]:text-[11px]"
          onClick={!userFirstName ? handleLoginClick : undefined}
        >
          {!userFirstName ? (
            <>
              <CgProfile
                className="text-2xl text-[#001f3f] group-hover:text-white group-hover:scale-110 transition-all duration-300"
                onClick={toggleProfileDropdown}
              />
              <span className="font-semibold vendorNameText max-[900px]:hidden max-[580px]:hidden group-hover:text-white transition-colors duration-300">
                Login
              </span>
            </>
          ) : (
            <>
              <UserProfileIcon currentUser={currentUser} />
              <span className="font-semibold vendorNameText max-[900px]:hidden max-[580px]:hidden group-hover:text-white transition-colors duration-300">
                {`Hi, ${userFirstName}`}
              </span>
            </>
          )}
        </span>

        {/* Dropdown toggle arrow */}
        <span
          onClick={toggleProfileDropdown}
          className="group-hover:text-white group-hover:scale-110 transition-transform duration-300"
        >
          {showProfileDropdown ? (
            <FaChevronUp className="text-sm" />
          ) : (
            <FaChevronDown className="text-sm" />
          )}
        </span>
      </div>

      {/* Dropdown menu */}
      {/* Dropdown menu */}
      {showProfileDropdown && (
        <div className="absolute top-[50px] left-[-90px] bg-[#f8f8f5] border border-gray-200 rounded-xl shadow-xl p-4 w-[240px] z-[2000] cursor-default animate-fadeIn max-[430px]:top-[40px] max-[800px]:left-[-120px]">
          {!userFirstName ? (
            <>
              <h4 className="text-[16px] text-black font-semibold cursor-default">
                Welcome
              </h4>
              <p className="text-[12px] text-[#001f3f] mt-1 cursor-default">
                To access account and manage services
              </p>

              <div className="flex justify-between items-center gap-2 mt-3 cursor-default">
                <span className="text-black text-[13px]">New Customer?</span>
                <button
                  onClick={handleSignupClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 
               rounded-full text-sm font-semibold shadow-md 
               hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 
               transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* My Profile */}
              <div
                className="flex items-center gap-2 mb-2 text-[#001f3f] text-[15px] cursor-pointer 
                     px-2 py-1 rounded-md transition-all duration-300
                     hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white hover:shadow-md"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate("/profile");
                }}
              >
                <FaUser />
                <span>My Profile</span>
              </div>

              {/* Wishlist */}
              <div
                className="flex items-center gap-2 mb-2 text-[#001f3f] cursor-pointer 
                     px-2 py-1 rounded-md transition-all duration-300
                     hover:bg-pink-100 hover:text-pink-600 hover:shadow-sm"
              >
                <FaHeart />
                <a href="/wishlist">Wishlist</a>
              </div>

              {/* Sign Out */}
              <div
                className="flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-300
                     hover:bg-red-100 hover:text-red-600 hover:shadow-sm cursor-pointer"
              >
                <FaSignOutAlt />
                <button
                  onClick={handleLogout}
                  className="text-[15px] font-medium p-0 transition-all duration-200"
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

export default ProfileMenu;
