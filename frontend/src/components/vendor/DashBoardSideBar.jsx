import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit, FaCamera, FaUpload, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { UseVendorProfile } from "./UseVendorProfile.jsx";
import axios from "axios";
import { setVendor } from "../../redux/VendorSlice.js";
import { IoKey } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";

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

  // ✅ 1. Destructure the new `resetForm` function from your hook.
  const { form, updateField, updateVendor, updateBank, resetForm } =
    UseVendorProfile();

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
  }, [isVerified]);

  const handleToggleEdit = () => {
    if (editMode) {
      setConfirmPasswordModal(true);
    } else {
      setEditMode(true);
    }
  };

  // ✅ 2. Create the handler for the Cancel button.
  const handleCancelEdit = () => {
    resetForm(); // This reverts any unsaved changes in the form state.
    setEditMode(false); // This switches the UI back to view mode.
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
      <h2 className="dashboardHeading">DASHBOARD</h2>
      <div className="sidebar-content">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper">
            {vendor?.profilePicture ? (
              <img
                decoding="async"
                loading="lazy"
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
          <li className="text-white font-montserrat text-[20px] not-italic font-bold leading-normal mt-[-12px] text-center tracking-[1px]">
            {editMode ? (
              <input
                type="text"
                value={form.fullName}
                className="custom-li"
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            ) : (
              form.fullName.toUpperCase()
            )}
          </li>

          {editMode ? (
            <label className="flex items-center justify-center gap-3  mt-2 mb-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={() => updateField("active", !form.active)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-green-500 transition-colors duration-300"></div>
                <div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md 
                  transition-all duration-300 peer-checked:translate-x-6"
                ></div>
              </div>
              <span
                className={`font-semibold transition-colors duration-300 ${
                  form.active
                    ? "text-white font-bold"
                    : "text-gray-200 font-semibold"
                }`}
              >
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

          <li className="text-[#d4d4d4] mr-2 text-[13px] text-center not-italic font-medium leading-normal mt-[15px] tracking-[0.5px]">
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

          <li className="text-[#fff] text-[16px] ml-5 not-italic font-medium leading-normal mt-[1px] tracking-[0.5px]">
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
          <p className="mt-3 ml-5 text-[#fff] font-semibold text-[18px]">
            Quick Status
          </p>
          <li className="text-[15px] ml-5 not-italic font-medium leading-normal mt-[1px] tracking-[0.5px]">
            <span className=" text-[#d4d4d4]">Event Hosted</span>{" "}
            <span className="text-[#fff] ml-14">
              {vendor?.eventsHosted ?? 0}
            </span>
          </li>

          <div
            className="flex mt-5 ml-5 cursor-pointer hover:text-[#f3c12d]"
            onClick={() => setVendorShowPasswordModal(true)}
          >
            <span className="font-semibold mr-2 mt-0.5 text-[#fff] hover:text-[#f3c12d]">
              <IoKey className="text-[20px]" />
            </span>
            <span>Change Password</span>
          </div>

          <li>
            <div
              onClick={() =>
                updateField("bankDropdownOpen", !form.bankDropdownOpen)
              }
              className="flex items-center cursor-pointer mt-4 ml-5 hover:text-[#f3c12d] "
            >
              <span>
                <BsBank className="text-[16px] mr-2" />
              </span>
              <span className="mr-10 ">Bank Details </span>{" "}
              <span>
                {form.bankDropdownOpen ? (
                  <IoIosArrowUp className="text-white text-lg font-bold transition-transform duration-200 hover:text-[#f3c12d]" />
                ) : (
                  <IoIosArrowDown className="text-white text-lg font-bold transition-transform duration-200 hover:text-[#f3c12d]" />
                )}
              </span>
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

        {/* ✅ 3. Updated button section to show Save/Cancel in edit mode. */}
        <div className="edit-buttons-container">
          {editMode ? (
            <div className="flex gap-3 items-center justify-center">
              <button
                onClick={handleToggleEdit}
                className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 
                shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg 
                active:scale-95 active:shadow-inner 
                transition-all duration-200 ease-in-out"
              >
                Save
              </button>

              <button
                onClick={handleCancelEdit}
                className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 
                shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg 
                active:scale-95 active:shadow-inner 
                transition-all duration-200 ease-in-out ml-3"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              className="flex items-center ml-5 mt-4 cursor-pointer text-[16px] hover:text-[#f3c12d]"
              onClick={handleToggleEdit}
            >
              <span className="mr-2 text-lg">
                <MdOutlineEdit />
              </span>{" "}
              <span>Edit</span>
            </div>
          )}
        </div>
      </div>
      {vendor?.profilePicture && (
        <button
          className={`flex items-center justify-center gap-2 bg-gradient-to-br from-[#FFD93D] to-[#E6B800] text-[#2D004D] px-4 py-2 rounded-[30px] cursor-pointer text-[13px] font-semibold text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-0 shadow-[0_4px_15px_rgba(255,107,107,0.3)] relative overflow-hidden mt-3 font-montserrat tracking-[0.5px] ml-8 remove-photo-btn ${
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
  );
}

export default DashBoardSideBar;
