import React, { useState } from "react";
import "./DashBoardSideBar.css";
import { FaEdit } from "react-icons/fa";

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
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="dasgboardHeading">DASHBOARD</h2>
      <div className="sidebar-content">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgDncc80LQVUNdxbfuSQwBxCFsyHOlQkG5zA&s"
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
              <span className="vendor-active">{active ? "Active" : "Inactive"}</span>
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

        <button className="edit-buttons flex gap-1 " onClick={handleToggleEdit}>
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
