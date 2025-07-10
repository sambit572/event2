import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setVendor } from "../../redux/VendorSlice"; // If you update vendor in Redux
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";

function DashBoardSideBar({
  isOpen,
  isVerified,
  setConfirmPasswordModal,
  setTempAccountNumber,
  setTempIfscCode,
  setEditMode,
  tempAccountNumber,
  accountNumber,
  setAccountNumber,
  tempIfscCode,
  editMode,
  ifscCode,
  setIfscCode,
  handleSaveChanges,
  fullName,
  phoneNumber,
  upiId,
  email,
  setFullName,
  setPhoneNumber,
  setUpiId,
  setEmail,
  active,
  setActive,
}) {
  const vendor = useSelector((state) => state.vendor.vendor);
  const dispatch = useDispatch();

  const [eventsHosted, setEventsHosted] = useState("");

  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  // Temporary values shown while editing

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/vendors/bank-details/bankDetails`,
          {
            withCredentials: true,
          }
        );
        const details = res.data?.data;
        console.log("🟢 Vendor bank details:", details);

        setBankDetails(details);
        setUpiId(details?.upiId || "");
        setAccountNumber(details?.accountNumber || "");
        setIfscCode(details?.ifscCode || "");
      } catch (err) {
        console.error("Failed to fetch vendor bank details", err);
      }
    };

    fetchBankDetails();

    if (vendor) {
      setFullName(vendor.fullName || "");
      setEmail(vendor.email || "");
      setPhoneNumber(vendor.phoneNumber || "");
      setEventsHosted(vendor.eventsHosted?.toString() || "0");
      setActive(vendor.active ?? true);
    }
  }, [vendor]);

  const getInitialsAvatar = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;
  };
  const handleToggleEdit = () => {
    if (editMode) {
      // User clicked "Save" → verify password first
      setConfirmPasswordModal(true);

      if (isVerified) {
        // Password is verified → now update real state
        setAccountNumber(tempAccountNumber);
        setIfscCode(tempIfscCode);
        handleSaveChanges();
        setEditMode(false);
      }
    } else {
      // Entering edit mode → load temp state
      setTempAccountNumber(accountNumber);
      setTempIfscCode(ifscCode);
      setEditMode(true);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      const formData = new FormData();
      formData.append("vendorId", vendor._id); // Adjust as per your backend
      formData.append("profilePicture", file);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/vendors/upload-profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // Ensure cookies are sent for session management
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch(setVendor(res.data.data));
      setSelectedImage(null);
      console.log("Profile image removed successfully.");
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
              : getInitialsAvatar(fullName)
          }
          alt="Profile"
          className="profile-pic"
        />

        {/* Upload & Remove Buttons */}
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
                value={fullName}
                className="custom-li"
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              fullName
            )}
          </li>

          {editMode ? (
            <label className="status-edit-toggle">
              <input
                type="checkbox"
                checked={active}
                onChange={() => setActive(!active)}
              />
              <span className="vendor-active">
                {active ? "Active" : "Inactive"}
              </span>
            </label>
          ) : (
            <span className="status-indicator">
              <span
                className={`status-dot ${
                  active ? "active-dot" : "inactive-dot"
                }`}
              ></span>
              {active ? "Active" : "Inactive"}
            </span>
          )}

          <li className="typography">
            {editMode ? (
              <input
                type="email"
                value={email}
                className="custom-li"
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              email
            )}
          </li>

          <li className="typography">
            {editMode ? (
              <input
                type="text"
                value={phoneNumber}
                className="custom-li"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            ) : (
              phoneNumber
            )}
          </li>

          <li className="typography">Events Hosted: {eventsHosted}</li>

          <li className="typography">
            {editMode ? (
              <input
                type="text"
                value={upiId}
                className="custom-li"
                onChange={(e) => setUpiId(e.target.value)}
              />
            ) : (
              upiId
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
                      value={tempAccountNumber}
                      onChange={(e) => setTempAccountNumber(e.target.value)}
                    />
                  ) : (
                    `****${accountNumber?.slice(-4)}`
                  )}
                </div>
                <div>
                  <strong className="vendor-ifsc">IFSC Code:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      style={{ color: "black" }}
                      value={tempIfscCode}
                      onChange={(e) => setTempIfscCode(e.target.value)}
                    />
                  ) : (
                    ifscCode
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
