import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { UseVendorProfile } from "./UseVendorProfile.jsx";
import axios from "axios";
import { setVendor } from "../../redux/VendorSlice.js";

// Props updated: added onSaveComplete to notify parent after verified update
function DashBoardSideBar({
  isOpen,
  isVerified,
  setConfirmPasswordModal,
  onSaveComplete,
}) {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.vendor.vendor);

  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  const { form, updateField, updateVendor, updateBank } = UseVendorProfile();

  // 🔁 Trigger actual save *only* when password is verified
  useEffect(() => {
    const updateAfterVerification = async () => {
      if (isVerified && editMode) {
        await updateVendor();
        await updateBank();
        setEditMode(false);
        console.log("✅ Updated vendor + bank and turned off edit mode");

        if (onSaveComplete) onSaveComplete(); // Let parent know
      }
    };
    updateAfterVerification();
  }, [isVerified]);

  // 🔁 Edit toggle (calls for password confirmation on Save)
  const handleToggleEdit = () => {
    if (editMode) {
      setConfirmPasswordModal(true); // Ask password on save
    } else {
      setEditMode(true); // Enter edit mode
    }
  };

  const getInitialsAvatar = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const formData = new FormData();
      formData.append("vendorId", vendor._id);
      formData.append("profilePicture", file);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/upload-profile`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        dispatch(setVendor(res.data.data));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      const formData = new FormData();
      formData.append("removeProfilePicture", "true");

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/${vendor._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      dispatch(setVendor(res.data.data));
      setSelectedImage(null);
    } catch (err) {
      console.error("Image remove failed:", err);
    }
  };

  return (
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="dasgboardHeading">DASHBOARD</h2>

      <div className="sidebar-content">
        <img
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : vendor?.profilePicture
              ? vendor.profilePicture
              : getInitialsAvatar(form.fullName)
          }
          alt="Profile"
          className="profile-pic"
        />

        <div className="profile-buttons">
          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            onClick={() => document.getElementById("profilePicInput").click()}
          >
            Upload Photo
          </button>
          <button onClick={handleRemoveImage}>Remove Photo</button>
        </div>

        <ul className="custom-list-decor-dashboard">
          <li className="typography custom-font">
            {editMode ? (
              <input
                type="text"
                value={form.fullName}
                className="custom-li"
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            ) : (
              form.fullName
            )}
          </li>

          {editMode ? (
            <label className="status-edit-toggle">
              <input
                type="checkbox"
                checked={form.active}
                onChange={() => updateField("active", !form.active)}
              />
              <span className="vendor-active">
                {form.active ? "Active" : "Inactive"}
              </span>
            </label>
          ) : (
            <span className="status-indicator">
              <span
                className={`status-dot ${
                  form.active ? "active-dot" : "inactive-dot"
                }`}
              ></span>
              {form.active ? "Active" : "Inactive"}
            </span>
          )}

          <li className="typography">
            {editMode ? (
              <input
                type="email"
                value={form.email}
                className="custom-li"
                onChange={(e) => updateField("email", e.target.value)}
              />
            ) : (
              form.email
            )}
          </li>

          <li className="typography">
            {editMode ? (
              <input
                type="text"
                value={form.phoneNumber}
                className="custom-li"
                onChange={(e) => updateField("phoneNumber", e.target.value)}
              />
            ) : (
              form.phoneNumber
            )}
          </li>

          <li className="typography">
            Events Hosted: {vendor?.eventsHosted ?? 0}
          </li>

          <li className="typography">
            {editMode ? (
              <input
                type="text"
                value={form.upiId}
                className="custom-li"
                onChange={(e) => updateField("upiId", e.target.value)}
              />
            ) : (
              form.upiId
            )}
          </li>

          <li className="typography bank-dropdown">
            <div
              onClick={() => setBankDropdownOpen((prev) => !prev)}
              className="dropdown-action"
            >
              Bank Details {bankDropdownOpen ? "▲" : "▼"}
            </div>

            {bankDropdownOpen && (
              <div className="dropdown-content">
                <div>
                  <strong className="vendor-accno">Account Number:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      style={{ color: "black" }}
                      value={form.tempAccountNumber}
                      onChange={(e) =>
                        updateField("tempAccountNumber", e.target.value)
                      }
                    />
                  ) : (
                    `****${form.accountNumber?.slice(-4)}`
                  )}
                </div>
                <div>
                  <strong className="vendor-ifsc">IFSC Code:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      style={{ color: "black" }}
                      value={form.tempIfscCode}
                      onChange={(e) =>
                        updateField("tempIfscCode", e.target.value)
                      }
                    />
                  ) : (
                    form.ifscCode
                  )}
                </div>
              </div>
            )}
          </li>
        </ul>
        {/* {showPasswordModal && (
          <div className="modal">
            <h3>Enter your password to confirm</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button onClick={handleConfirmPassword}>Confirm</button>
            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        )} */}

        {/* Edit / Save Button */}
        <button className="edit-buttons flex gap-1" onClick={handleToggleEdit}>
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

export default DashBoardSideBar;
