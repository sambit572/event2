import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit, FaCamera, FaUpload, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { UseVendorProfile } from "./UseVendorProfile.jsx";
import axios from "axios";
import { setVendor } from "../../redux/VendorSlice.js";

function DashBoardSideBar({
  isOpen,
  isVerified,
  setConfirmPasswordModal,
  setIsVerified,
  setVendorShowPasswordModal,
}) {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.vendor.vendor);

  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const { form, updateField, updateVendor, updateBank } = UseVendorProfile();

  console.log("DashBoardSideBar render - isVerified:", isVerified);
  console.log("DashBoardSideBar render - editMode:", editMode);


  useEffect(() => {
    if (!isVerified) return; // only run when verified

    if (editMode) {
      (async () => {
        await updateVendor();
        console.log("Vendor updated successfully");

        await updateBank();
        console.log("Bank updated successfully");

        setEditMode(false); // exit edit mode
        setIsVerified(false); // reset verification flag
      })();
    }
  }, [isVerified]); // 🚨 only depend on isVerified

  const handleToggleEdit = () => {
    if (editMode) {
      setConfirmPasswordModal(true);
    } else {
      setEditMode(true);
    }
  };

  const getInitialsAvatar = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 9 * 1024 * 1024) {
      alert("File size should be less than 9MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("vendorId", vendor._id);
      formData.append("profilePicture", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/upload-profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch(setVendor(res.data.data));
      alert("Profile photo uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload profile photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleImageRemove = async () => {
    setRemoving(true);
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
      alert("Profile photo removed successfully!");
    } catch (err) {
      console.error("Remove photo error:", err);
      alert("Failed to remove photo.");
    } finally {
      setRemoving(false);
      setShowRemoveConfirm(false);
    }
  };

  return (
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="dasgboardHeading">DASHBOARD</h2>
      <div className="sidebar-content">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper">
            {vendor?.profilePicture ? (
              <img
                src={vendor.profilePicture}
                alt="Profile"
                className="user-profile-pic"
                onClick={() => document.getElementById("vendor-photo").click()}
              />
            ) : (
              <div
                className="user-profile-pic profile-initials"
                onClick={() => document.getElementById("vendor-photo").click()}
              >
                {getInitialsAvatar(form.fullName)}
              </div>
            )}
            <div
              className="camera-icon-overlay"
              onClick={() => document.getElementById("vendor-photo").click()}
            >
              {uploading ? (
                <FaUpload className="camera-icon spinning" />
              ) : (
                <FaCamera className="camera-icon" />
              )}
            </div>
          </div>

          <input
            type="file"
            id="vendor-photo"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />

          {vendor?.profilePicture && (
            <button
              className={`remove-photo-btn ${removing ? "removing" : ""}`}
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

        {/* Confirmation Dialog */}
        {showRemoveConfirm && (
          <div className="remove-confirm-overlay">
            <div className="remove-confirm-dialog">
              <h3>Remove Profile Photo</h3>
              <p>Are you sure you want to remove your profile photo?</p>
              <div className="remove-confirm-buttons">
                <button
                  className="confirm-remove-btn"
                  onClick={handleImageRemove}
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

          {/* <li className="typography">
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
          </li> */}

          <button
            className="change-password"
            onClick={() => setVendorShowPasswordModal(true)}
          >
            Change Password
          </button>

          <li className="typography bank-dropdown">
            <div
              onClick={() =>
                updateField("bankDropdownOpen", !form.bankDropdownOpen)
              }
              className="dropdown-action"
            >
              Bank Details {form.bankDropdownOpen ? "▲" : "▼"}
            </div>

            {form.bankDropdownOpen && (
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
