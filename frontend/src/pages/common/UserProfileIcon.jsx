import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserProfileIcon = () => {
  const fullName = useSelector((state) => state.user?.user?.fullName || "");
  const profilePhoto = useSelector(
    (state) => state.user?.user?.profilePhoto || ""
  );

  const [initials, setInitials] = useState("");

  useEffect(() => {
    const nameParts = fullName.trim().split(" ");
    const first = nameParts[0]?.[0] || "";
    const last = nameParts.length > 1 ? nameParts.at(-1)[0] : "";
    setInitials((first + last).toUpperCase());
  }, [fullName]);

  const isImageValid = profilePhoto && profilePhoto.startsWith("http");

  return (
    <div
      className="w-7 h-7 md:w-[38px] md:h-[38px] rounded-full overflow-hidden flex items-center justify-center bg-gray-300 cursor-pointer"
      title="Profile"
    >
      {isImageValid ? (
        <img
          decoding="async"
          loading="lazy"
          src={profilePhoto}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white bg-blue-600 w-full h-full flex items-center justify-center font-semibold text-sm uppercase select-none">
          {initials ? initials : (
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          )}
        </span>
      )}
    </div>
  );
};

export default UserProfileIcon;
