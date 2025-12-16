import React, { useState, useEffect } from "react";
import "./UserSideBar.css";
import { FaEdit, FaCamera, FaUpload, FaTrash } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function UserSideBar({ isOpen, setShowPasswordModal }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [eventsBooked, setEventsBooked] = useState("0");
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Fetching profile data on mount
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/profile`, {
        withCredentials: true,
      });
      console.log(res.data.data.user);
      const { fullName, email, phoneNo, profilePhoto } = res.data.data.user;

      setFullName(fullName);
      setEmail(email);
      setContact(phoneNo);
      setProfilePhoto(profilePhoto || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  // useEffect now just calls fetchProfile
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleToggleEdit = async () => {
    if (editMode) {
      // Save the updated data
      try {
        await axios.put(
          `${BACKEND_URL}/user/update-profile`,
          {
            fullName,
            email,
            phoneNo: contact,
          },
          {
            withCredentials: true,
          }
        );
        alert("Profile updated successfully.");
      } catch (err) {
        alert("Failed to update profile.");
        console.error(err);
      }
    }

    setEditMode((prev) => !prev);
  };

  // Helper function to get initials from full name
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Trigger photo upload when camera icon is clicked
  const triggerPhotoUpload = () => {
    if (!uploading) {
      document.getElementById("photo-upload").click();
    }
  };

  // Handling profile photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Checking file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Checking file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      console.log("Uploading file:", file.name, file.type, file.size);
      console.log("FormData created:", formData);
      console.log("Upload URL:", `${BACKEND_URL}/user/upload-profile-photo`);

      let res;
      try {
        res = await axios.put(
          `${BACKEND_URL}/user/upload-profile-photo`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (putError) {
        console.log("PUT request failed, trying POST method...");

        res = await axios.post(
          `${BACKEND_URL}/user/upload-profile-photo`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Upload response:", res.data);

      // Just fetch the profile to get the updated photo URL
      await fetchProfile();
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Upload error details:", err);

      // More detailed error handling
      if (err.response) {
        // Server responded with error status
        console.error("Server response error:", err.response.data);
        console.error("Status code:", err.response.status);
        console.error("Response headers:", err.response.headers);
        console.error("Full response:", err.response);

        let errorMessage = "Unknown server error";
        if (err.response.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = JSON.stringify(err.response.data);
          }
        }

        if (err.response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else if (err.response.status === 413) {
          alert("File too large. Please select a smaller image.");
        } else if (err.response.status === 415) {
          alert("Unsupported file type. Please select a valid image.");
        } else if (err.response.status === 404) {
          alert("Upload endpoint not found. Please check the backend route.");
        } else if (err.response.status === 500) {
          alert(`Server error: ${errorMessage}`);
        } else {
          alert(
            `Failed to upload profile photo (${err.response.status}): ${errorMessage}`
          );
        }
      } else if (err.request) {
        // Network error
        console.error("Network error:", err.request);
        alert("Network error. Please check your connection and try again.");
      } else {
        // Other error
        console.error("Error:", err.message);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  // Handle photo removal
  const handlePhotoRemove = async () => {
    setRemoving(true);
    try {
      await axios.delete(`${BACKEND_URL}/user/remove-profile-photo`, {
        withCredentials: true,
      });

      // Refresh profile data
      await fetchProfile();
      alert("Profile photo removed successfully!");
    } catch (err) {
      console.error("Remove photo error:", err);
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Failed to remove photo";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Failed to remove photo. Please try again.");
      }
    } finally {
      setRemoving(false);
      setShowRemoveConfirm(false);
    }
  };

  return (
    <div className={`user-sidebar ${isOpen ? "open" : "closed"}`}>
      <h2 className="profile-heading">PROFILE</h2>
      <div className="user-sidebar-content">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper">
            {profilePhoto ? (
              <img
                decoding="async"
                loading="lazy"
                src={profilePhoto}
                alt="Profile"
                className="user-profile-pic"
                onClick={triggerPhotoUpload}
              />
            ) : (
              <div
                className="user-profile-pic profile-initials"
                onClick={triggerPhotoUpload}
              >
                {getInitials(fullName)}
              </div>
            )}

            {/* Camera Icon Overlay */}
            <div className="camera-icon-overlay" onClick={triggerPhotoUpload}>
              {uploading ? (
                <FaUpload className="camera-icon spinning" />
              ) : (
                <FaCamera className="camera-icon" />
              )}
            </div>
          </div>

          <div className="photo-upload-section">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showRemoveConfirm && (
          <div className="remove-confirm-overlay">
            <div className="remove-confirm-dialog">
              <h3>Remove Profile Photo</h3>
              <p>Are you sure you want to remove your profile photo?</p>
              <div className="remove-confirm-buttons">
                <button
                  className="confirm-remove-btn"
                  onClick={handlePhotoRemove}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Yes Remove"}
                </button>
                <button
                  className="cancel-remove-btn"
                  onClick={() => setShowRemoveConfirm(false)}
                  disabled={removing}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="custom-list-decor ">
          <li className="text-white font-montserrat text-[20px] not-italic font-bold leading-normal mt-[-10px] text-center tracking-[1px]">
            {editMode ? (
              <input
                type="text"
                value={fullName}
                className="custom-li uppercase"
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              fullName.toUpperCase() || "N/A"
            )}
          </li>
          <li className="text-[#d4d4d4] mr-2 text-[13px] text-center not-italic font-medium leading-normal mt-[15px] tracking-[0.5px]">
            {editMode ? (
              <input
                type="email"
                value={email}
                className="custom-li"
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              email || "N/A"
            )}
          </li>

          <li className="text-[#fff] text-[16px] ml-1 not-italic font-medium leading-normal mt-[1px] tracking-[0.5px]">
            {editMode ? (
              <input
                type="text"
                value={contact}
                className="custom-li"
                onChange={(e) => setContact(e.target.value)}
              />
            ) : (
              contact || "N/A"
            )}
          </li>
          <p className="mt-5 ml-1 text-[#fff] font-semibold text-[18px]">
            Quick Status
          </p>
          <li className="text-[15px] ml-1 not-italic font-medium leading-normal mt-[1px] tracking-[0.5px]">
            {" "}
            <span className="mr-10 text-[#d4d4d4]">Events Booked</span>{" "}
            <span className="text-[#fff]">{eventsBooked}</span>
          </li>
        </ul>

        <div
          className="flex items-center ml-1 cursor-pointer hover:text-[#f3c12d]"
          onClick={() => setShowPasswordModal(true)}
        >
          <span className="font-semibold mr-2 mt-0.5 text-[#fff] hover:text-[#f3c12d]">
            <IoKey className="text-[20px]" />
          </span>
          <span>Change Password</span>
        </div>

        <div
          className="flex items-center ml-1 mt-4 cursor-pointer text-[16px] hover:text-[#f3c12d]"
          onClick={handleToggleEdit}
        >
          {editMode ? (
            <span
              className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 
                shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg 
                active:scale-95 ml-12 active:shadow-inner 
                transition-all duration-200 ease-in-out"
            >
              Save
            </span>
          ) : (
            <>
              <span className="mr-2 text-lg text-white hover:text-[#f3c12d] transition">
                <MdOutlineEdit />
              </span>
              <span className="text-white hover:text-[#f3c12d] transition">
                Edit
              </span>
            </>
          )}
        </div>

        {/* Remove Photo Button - Only show if photo exists */}
        {profilePhoto && (
          <button
            className={`flex items-center justify-center gap-2 bg-gradient-to-br from-[#FFD93D] to-[#E6B800] text-[#2D004D] px-4 py-2 rounded-[30px] cursor-pointer text-[13px] font-semibold text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-0 shadow-[0_4px_15px_rgba(255,107,107,0.3)] relative overflow-hidden mt-3 font-montserrat tracking-[0.5px] remove-photo-btn ${
              removing ? "removing" : ""
            }`}
            onClick={() => setShowRemoveConfirm(true)}
            disabled={uploading || removing}
          >
            {removing ? (
              <>
                <FaUpload className="remove-icon spinning" />
                <span className="remove-text">Removing...</span>
              </>
            ) : (
              <>
                <FaTrash className="remove-icon" />
                <span className="remove-text">Remove Photo</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserSideBar;
