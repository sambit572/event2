import React, { useEffect, useState } from "react";
import "./UserProfileIcon.css";
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
    <div className="user-profile">
      {isImageValid ? (
        <img
          src={profilePhoto}
          alt="Profile"
          className="user-avatar-img"
          title="Profile"
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold text-sm uppercase select-none"
          title="Profile"
        >
          {initials || "?"}
        </div>
      )}
    </div>
  );
};

export default UserProfileIcon;
