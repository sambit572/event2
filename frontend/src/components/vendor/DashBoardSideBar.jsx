import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaCamera, FaUpload, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { UseVendorProfile } from "./UseVendorProfile.jsx";
import axios from "axios";
import { setVendor } from "../../redux/VendorSlice.js";
import { IoKey } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import {
  MdDashboard,
  MdBookOnline,
  MdAnalytics,
  MdPeople,
} from "react-icons/md";

const NAV_ITEMS = [
  { key: "services",  label: "My Services",  icon: MdDashboard },
  { key: "bookings",  label: "My Bookings",  icon: MdBookOnline },
  { key: "analytics", label: "My Analytics", icon: MdAnalytics },
  { key: "customers", label: "My Customers", icon: MdPeople },
];

function DashBoardSideBar({
  isOpen,
  isVerified,
  setConfirmPasswordModal,
  setIsVerified,
  setVendorShowPasswordModal,
  activeTab,
  setActiveTab,
}) {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.vendor.vendor);

  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(false);

  const { form, updateField, updateVendor, updateBank, resetForm } = UseVendorProfile();

  useEffect(() => {
    if (!isVerified) return;
    if (editMode) {
      (async () => {
        await updateVendor();
        await updateBank();
        setEditMode(false);
        setIsVerified(false);
      })();
    }
  }, [isVerified, editMode]);

  const handleToggleEdit = () => {
    if (editMode) setConfirmPasswordModal(true);
    else setEditMode(true);
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditMode(false);
  };

  const getInitialsAvatar = (name) => {
    if (!name) return "NA";
    return name.split(" ").map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
    if (file.size > 9 * 1024 * 1024) { alert("File size should be less than 9MB"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("vendorId", vendor._id);
      formData.append("profilePicture", file);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/upload-profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      dispatch(setVendor(res.data.data));
    } catch (err) {
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
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      dispatch(setVendor(res.data.data));
    } catch (err) {
      alert("Failed to remove photo.");
    } finally {
      setRemoving(false);
      setShowRemoveConfirm(false);
    }
  };

  return (
    <aside className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      {/* Replaced Logo with Profile Card at the top */}
      <div className="sb-avatar-card" style={{ margin: "20px 16px 30px 16px", padding: "20px 16px", borderRadius: "16px" }}>
        <div className="sb-avatar-wrap" onClick={() => document.getElementById("vendor-photo").click()}>
          {vendor?.profilePicture ? (
            <img src={vendor.profilePicture} alt="Profile" className="sb-avatar-img" />
          ) : (
            <div className="sb-avatar-initials">{getInitialsAvatar(form.fullName)}</div>
          )}
          <div className="sb-camera-badge">
            {uploading ? <FaUpload className="spinning" size={12} /> : <FaCamera size={12} />}
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

        <div className="sb-vendor-name" style={{ fontSize: "18px", marginTop: "12px" }}>
          {editMode ? (
            <input 
              type="text" 
              value={form.fullName} 
              className="sb-edit-input"
              onChange={(e) => updateField("fullName", e.target.value)} 
            />
          ) : (
            <span>{form.fullName?.toUpperCase()}</span>
          )}
        </div>
        <div className={`sb-status-badge ${form.active ? "sb-active" : "sb-inactive"}`}>
          <span className="sb-status-dot" />
          {form.active ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="sb-body">
        {/* Navigation */}
        <nav className="sb-nav">
          <div className="sb-nav-label">Navigation</div>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sb-nav-item ${activeTab === key ? "sb-nav-active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={18} className="sb-nav-icon" />
              <span>{label}</span>
              {activeTab === key && <span className="sb-nav-pip" />}
            </button>
          ))}
        </nav>

        {/* Profile Details (collapsible) */}
        <div className="sb-section">
          <button className="sb-section-toggle" onClick={() => setShowProfileSection(!showProfileSection)}>
            <span className="sb-nav-label" style={{ margin: 0 }}>Profile Details</span>
            <span className="text-gray-400">{showProfileSection ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </button>

          {showProfileSection && (
            <div className="sb-profile-details">
              <div className="sb-detail-row">
                <span className="sb-detail-label">Email</span>
                {editMode ? (
                  <input type="email" value={form.email} className="sb-edit-input"
                    onChange={(e) => updateField("email", e.target.value)} />
                ) : (
                  <span className="sb-detail-val">{form.email}</span>
                )}
              </div>
              <div className="sb-detail-row">
                <span className="sb-detail-label">Phone</span>
                {editMode ? (
                  <input type="text" value={form.phoneNumber} className="sb-edit-input"
                    onChange={(e) => updateField("phoneNumber", e.target.value)} />
                ) : (
                  <span className="sb-detail-val">{form.phoneNumber}</span>
                )}
              </div>
              <div className="sb-detail-row">
                <span className="sb-detail-label">Events Hosted</span>
                <span className="sb-events-badge">{vendor?.eventsHosted ?? 0}</span>
              </div>
              {editMode && (
                <div className="sb-detail-row" style={{ alignItems: "center" }}>
                  <span className="sb-detail-label">Status</span>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <div style={{ position: "relative", width: 44, height: 24 }}>
                      <input type="checkbox" checked={form.active}
                        onChange={() => updateField("active", !form.active)}
                        style={{ opacity: 0, width: 0, height: 0 }} />
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: 12,
                        background: form.active ? "#22c55e" : "#6b7280", transition: "background 0.3s"
                      }} />
                      <div style={{
                        position: "absolute", top: 3, left: form.active ? 23 : 3,
                        width: 18, height: 18, borderRadius: "50%", background: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)", transition: "left 0.3s"
                      }} />
                    </div>
                    <span style={{ color: "#fff", fontSize: 13 }}>{form.active ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account actions */}
        <div className="sb-section">
          <div className="sb-nav-label">Account</div>
          <button className="sb-action-btn" onClick={() => setVendorShowPasswordModal(true)}>
            <IoKey size={15} /> Change Password
          </button>
          <button className="sb-action-btn"
            onClick={() => updateField("bankDropdownOpen", !form.bankDropdownOpen)}>
            <BsBank size={14} />
            <span>Bank Details</span>
            <span style={{ marginLeft: "auto" }}>{form.bankDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </button>

          {form.bankDropdownOpen && (
            <div className="sb-bank-panel">
              <div className="sb-bank-row">
                <span>Account No.</span>
                {editMode ? (
                  <input type="text" value={form.tempAccountNumber} className="sb-edit-input"
                    style={{ color: "#000" }}
                    onChange={(e) => updateField("tempAccountNumber", e.target.value)} />
                ) : (
                  <span>****{form.accountNumber?.slice(-4)}</span>
                )}
              </div>
              <div className="sb-bank-row">
                <span>IFSC</span>
                {editMode ? (
                  <input type="text" value={form.tempIfscCode} className="sb-edit-input"
                    style={{ color: "#000" }}
                    onChange={(e) => updateField("tempIfscCode", e.target.value)} />
                ) : (
                  <span>{form.ifscCode}</span>
                )}
              </div>
            </div>
          )}

          {editMode ? (
            <div className="sb-edit-actions">
              <button onClick={handleToggleEdit} className="sb-btn-save"><MdSave size={14} /> Save</button>
              <button onClick={handleCancelEdit} className="sb-btn-cancel"><MdCancel size={14} /> Cancel</button>
            </div>
          ) : (
            <button className="sb-action-btn" onClick={handleToggleEdit}>
              <MdOutlineEdit size={15} /> Edit Profile
            </button>
          )}

          {vendor?.profilePicture && (
            <button className="sb-action-btn sb-action-danger"
              onClick={() => setShowRemoveConfirm(true)} disabled={uploading || removing}>
              <FaTrash size={12} />
              {removing ? "Removing..." : "Remove Photo"}
            </button>
          )}
        </div>
      </div>

      {/* Remove confirm modal */}
      {showRemoveConfirm && (
        <div className="sb-overlay">
          <div className="sb-confirm-box">
            <h3 style={{ fontWeight: 700, color: "#001f3f", marginBottom: 8 }}>Remove Profile Photo?</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="sb-btn-save" style={{ flex: 1 }} onClick={handleImageRemove} disabled={removing}>
                {removing ? "Removing..." : "Yes, Remove"}
              </button>
              <button className="sb-btn-cancel" style={{ flex: 1 }} onClick={() => setShowRemoveConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default DashBoardSideBar;