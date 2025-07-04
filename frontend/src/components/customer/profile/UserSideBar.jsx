import React, { useState, useEffect } from "react";
import "./UserSideBar.css";
import { FaEdit, FaCamera, FaUpload, FaTrash } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant.js";

function UserSideBar({ isOpen, setShowPasswordModal }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [eventsBooked, setEventsBooked] = useState("0");
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/profile`, {
        withCredentials: true,
      });
      const { fullName, email, phoneNo, profilePhoto } = res.data.data;
      setFullName(fullName || "");
      setEmail(email || "");
      setContact(phoneNo || "");
      setProfilePhoto(profilePhoto || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleToggleEdit = async () => {
    if (editMode) {
      try {
        await axios.put(
          `${BACKEND_URL}/user/update-profile`,
          {
            fullName,
            email,
            phoneNo: contact,
          },
          { withCredentials: true }
        );
        alert("Profile updated successfully.");
        fetchProfile();
      } catch (err) {
        alert("Failed to update profile.");
        console.error(err);
      }
    }
    setEditMode((prev) => !prev);
  };

  const triggerPhotoUpload = () => {
    if (!uploading) document.getElementById("photo-upload").click();
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file under 5MB.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const res = await axios.post(
        `${BACKEND_URL}/user/upload-profile-photo`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await fetchProfile();
      alert("Profile photo updated.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handlePhotoRemove = async () => {
    setRemoving(true);
    try {
      await axios.delete(`${BACKEND_URL}/user/remove-profile-photo`, {
        withCredentials: true,
      });
      await fetchProfile();
      alert("Profile photo removed.");
    } catch (err) {
      console.error("Remove photo error:", err);
      alert("Failed to remove photo.");
    } finally {
      setRemoving(false);
      setShowRemoveConfirm(false);
    }
  };

  const getInitial = (name) =>
    name && typeof name === "string"
      ? name.trim().charAt(0).toUpperCase()
      : "";

  return (
    <div className={`user-sidebar ${isOpen ? "open" : "closed"}`}>
      <h2 className="profile-heading">PROFILE</h2>
      <div className="user-sidebar-content">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper" onClick={triggerPhotoUpload}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="user-profile-pic"
              />
            ) : (
              <div className="user-profile-pic profile-initials">
                {getInitial(fullName)}
              </div>
            )}
            <div className="camera-icon-overlay">
              {uploading ? (
                <FaUpload className="camera-icon spinning" />
              ) : (
                <FaCamera className="camera-icon" />
              )}
            </div>
          </div>

          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />

          {profilePhoto && (
            <button
              className={`remove-photo-btn ${removing ? "removing" : ""}`}
              onClick={() => setShowRemoveConfirm(true)}
              disabled={removing}
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

        <ul className="custom-list-decor">
          <li className="typography custom-font">
            {editMode ? (
              <input
                type="text"
                value={fullName}
                className="custom-li"
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              fullName || "N/A"
            )}
          </li>
          <li className="typography">
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
          <li className="typography">
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
          <li className="typography">Events Booked: {eventsBooked}</li>
        </ul>

        <button
          className="ch-password"
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>

        <button className="edit-button flex gap-1" onClick={handleToggleEdit}>
          {editMode ? (
            "Save"
          ) : (
            <>
              <FaEdit /> Edit
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default UserSideBar;
