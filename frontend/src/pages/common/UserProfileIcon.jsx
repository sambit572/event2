import React, { useEffect, useState } from "react";
import "./UserProfileIcon.css";
import dummyImg from "../../assets/home/dummy-profile.png"; // 📸 your fallback image

const UserProfileIcon = () => {
  const [initial, setInitial] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const letter = localStorage.getItem("userInitial");
    const pic = localStorage.getItem("userProfilePic");
    setInitial(letter || "?");
    setProfilePic(pic || "");
  }, []);

  const finalPic = profilePic || dummyImg;

  return (
    <div className="user-profile">
      <img
        src={finalPic}
        alt="Profile"
        className="user-avatar-img"
        title="Profile"
      />
    </div>
  );
};

export default UserProfileIcon;
