import React, { useState, useEffect } from "react";
import "./DashBoardSideBar.css";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

function DashBoardSideBar({ isOpen }) {
  const vendor = useSelector((state) => state.vendor.vendor);

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

  // ✅ Fills local state from Redux vendor data
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

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="dasgboardHeading">DASHBOARD</h2>
      <div className="sidebar-content">
        <img
  src={
    vendor?.profilePicture
      ? vendor.profilePicture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor?.fullName || "NA")}&background=0D8ABC&color=fff`
  }
  alt="Profile"
  className="profile-pic"
/>


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
