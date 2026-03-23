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
      className="w-10 h-10 md:w-[40px] md:h-[40px] sm:w-[35px] sm:h-[32px] max-sm:w-[25px] max-sm:h-[22px] rounded-full overflow-hidden flex items-center justify-center bg-gray-300 cursor-pointer"
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
          {initials || "?"}
        </span>
      )}
    </div>
  );
};

export default UserProfileIcon;
