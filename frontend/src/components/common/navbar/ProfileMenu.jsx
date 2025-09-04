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
}) => {
  const profileRef = useRef(null);

  return (
    <div
      ref={profileRef}
      className="relative flex items-center text-[15px] font-medium cursor-pointer"
    >
      {/* Profile section */}
      <div className="flex items-center gap-2 text-gray-700 login">
        <span
          className="flex items-center gap-2 max-[1024px]:text-[12px] max-[820px]:text-[11px]"
          onClick={!userFirstName ? handleLoginClick : undefined}
        >
          {!userFirstName ? (
            <>
              <CgProfile className="text-2xl text-[#001f3f]" />
              <span className="font-semibold vendorNameText max-[900px]:hidden max-[580px]:hidden max-[460px]:hidden">
                Login
              </span>
            </>
          ) : (
            <>
              <UserProfileIcon currentUser={currentUser} />
              <span className="font-semibold vendorNameText max-[900px]:hidden max-[580px]:hidden max-[460px]:hidden">
                {`Hi, ${userFirstName}`}
              </span>
            </>
          )}
        </span>

        {/* Dropdown toggle arrow */}
        <span onClick={() => setShowProfileDropdown((prev) => !prev)}>
          {showProfileDropdown ? (
            <FaChevronUp className="text-sm" />
          ) : (
            <FaChevronDown className="text-sm" />
          )}
        </span>
      </div>

      {/* Dropdown menu */}
      {showProfileDropdown && (
        <div className="absolute top-[55px] left-[-100px] bg-[#e5e5de] border border-white rounded-lg shadow-lg p-3 w-[200px] z-[2000]  max-[430px]:top-[40px]">
          {!userFirstName ? (
            <>
              <h4 className="text-[16px] text-black font-semibold">Welcome</h4>
              <p className="text-[12px] text-[#001f3f] mt-1">
                To access account and manage services
              </p>

              <div className="flex justify-between items-center gap-2 mt-3">
                <span className="text-black">New Customer?</span>
                <button
                  onClick={handleSignupClick}
                  className="bg-[#e5e5de] text-blue-700 px-2 py-1 rounded hover:bg-gray-900 hover:text-white transition"
                >
                  Sign Up
                </button>
              </div>

              <hr className="my-2 border-gray-300" />
            </>
          ) : (
            <>
              <div
                className="flex items-center gap-2 mb-2 text-[#001f3f] hover:text-[#022f5d] hover:font-bold text-[15px] cursor-pointer"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate("/profile");
                }}
              >
                <FaUser />
                <span>My Profile</span>
              </div>

              <div className="flex items-center gap-2 text-[#001f3f] hover:font-bold hover:text-[#001f3f] cursor-pointer mb-2">
                <FaHeart />
                <a href="/wishlist">Wishlist</a>
              </div>

              <div className="flex items-center gap-2">
                <FaSignOutAlt className="text-[#001f3f]" />
                <button
                  onClick={handleLogout}
                  className="bg-[#e5e5de] text-[#001f3f] text-[15px] font-medium px-2 py-1 rounded hover:text-[#001f3f] hover:font-bold"
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
