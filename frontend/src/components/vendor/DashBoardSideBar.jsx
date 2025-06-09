import React, { useState } from "react";
import "./DashBoardSideBar.css";

function DashBoardSideBar({ isOpen }) {
  const [fullName, setFullName] = useState("Rudransh Dash");
  const [email, setEmail] = useState("rudransh7381@gmail.com");
  const [contact, setContact] = useState("+91 9692486267");
  const [eventsHosted, setEventsHosted] = useState("3");
  const [upiId, setUpiId] = useState("fake@sbi");
  const [accountNumber, setAccountNumber] = useState("123456789");
  const [ifscCode, setIfscCode] = useState("SBIN0001234");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [active, setActive] = useState(true);

  const [editMode, setEditMode] = useState(false);

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="dasgboardHeading">DASHBOARD</h2>
      <div className="sidebar-content">
        <svg
          className="profile-pic"
          xmlns="http://www.w3.org/2000/svg"
          width="140"
          height="130"
          viewBox="0 0 166 156"
          fill="none"
        >
          <g filter="url(#filter0_d_449_1852)">
            <ellipse cx="87.5" cy="73.5" rx="78.5" ry="73.5" fill="#7B80E2" />
          </g>
          <defs>
            <filter
              id="filter0_d_449_1852"
              x="0"
              y="0"
              width="166"
              height="156"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-5" dy="5" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_449_1852"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_449_1852"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

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
              fullName
            )}
          </li>
          {/* <li className="typography custom-font-active">
            {editMode ? (
              <input
                type="text"
                value={active}
                className="custom-li"
                onChange={(e) => setActive(e.target.value)}
              />
            ) : (
              active
            )}
          </li> */}
          {editMode ? (
            <label className="status-edit-toggle">
              <input
                type="checkbox"
                checked={active}
                onChange={() => setActive(!active)}
              />
              <span>{active ? "Active" : "Inactive"}</span>
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
                  <strong>Account Number:</strong>{" "}
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
                  <strong>IFSC Code:</strong>{" "}
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

        <button className="edit-button" onClick={handleToggleEdit}>
          {editMode ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default DashBoardSideBar;
