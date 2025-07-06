import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setVendor } from "../../redux/VendorSlice"; // If you update vendor in Redux
import axios from "axios";

function DashBoardSideBar({ isOpen }) {
  const vendor = useSelector((state) => state.vendor.vendor);
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [eventsHosted, setEventsHosted] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [active, setActive] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (vendor) {
      setFullName(vendor.fullName || "");
      setEmail(vendor.email || "");
      setContact(vendor.contact || "");
      setEventsHosted(vendor.eventsHosted?.toString() || "0");
      setUpiId(vendor.upiId || "");
      setAccountNumber(vendor.accountNumber || "");
      setIfscCode(vendor.ifscCode || "");
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
      handleSaveChanges();
    }
    setEditMode((prev) => !prev);
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
          "${BACKEND_URL}/vendors/upload-profile",
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
        `http://localhost:8000/vendors/${vendor._id}`,
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

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/vendors/${vendor._id}`,
        {
          vendorId: vendor._id,
          fullName,
          email,
          contact,
          upiId,
          accountNumber,
          ifscCode,
          active,
        }
      );
      dispatch(setVendor(res.data.updatedVendor));
      console.log("Changes saved.");
    } catch (err) {
      console.error("Error saving changes:", err);
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
                value={contact}
                className="custom-li"
                onChange={(e) => setContact(e.target.value)}
              />
            ) : (
              contact
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
                      value={accountNumber}
                      className="custom-li"
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  ) : (
                    accountNumber
                  )}
                </div>
                <div>
                  <strong className="vendor-ifsc">IFSC Code:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={ifscCode}
                      className="custom-li"
                      onChange={(e) => setIfscCode(e.target.value)}
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
