import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./UserProfileIcon.css";
import { BACKEND_URL } from "../../utils/constant"; // adjust the path as needed

const UserProfileIcon = ({ onClick, ariaLabel }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    profilePhoto: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/profile`, {
          withCredentials: true,
        });
        console.log(res.data.data);
        const { fullName, profilePhoto  } = res.data.data || {};
        setUserData({ fullName, profilePhoto });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const getFirstLetter = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <div
      className="user-profile-icon"
      onClick={onClick}
      aria-label={ariaLabel || "User Profile"}
      role="button"
      tabIndex={0}
    >
      {userData.profilePhoto ? (
        <img
          src={userData.profilePhoto}
          className="w-10 h-10 rounded-full object-cover"
        />

      ) : (
        <div className="profile-letter">
          {getFirstLetter(userData.fullName)}
        </div>
      )}
    </div>
  );
};

UserProfileIcon.propTypes = {
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default UserProfileIcon;
