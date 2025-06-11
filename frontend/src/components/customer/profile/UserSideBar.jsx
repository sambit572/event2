import React, { useState } from "react";
import "./UserSideBar.css";
import { FaEdit } from "react-icons/fa";

function UserSideBar({ isOpen }) {
  const [fullName, setFullName] = useState("Rudransh Dash");
  const [email, setEmail] = useState("rudransh7381@gmail.com");
  const [contact, setContact] = useState("+91 9692486267");
  const [eventsBooked, setEventsBooked] = useState("3");

  const [editMode, setEditMode] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const handlePasswordChangeSubmit = () => {
    // TODO: Password validation logic
    console.log(
      "Old:",
      oldPassword,
      "New:",
      newPassword,
      "Confirm:",
      confirmPassword
    );
    setShowPasswordModal(false);
    // Reset fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={`user-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="profile-heading">PROFILE</h2>
      <div className="user-sidebar-content">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgDncc80LQVUNdxbfuSQwBxCFsyHOlQkG5zA&s"
          alt="Profile"
          className="user-profile-pic"
        />

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
          <li className="typography">Events Booked: {eventsBooked}</li>
        </ul>

        <button
          className="ch-password"
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>

        <button className="edit-button" onClick={handleToggleEdit}>
          {editMode ? (
            "Save"
          ) : (
            <>
              <FaEdit />
              Edit
            </>
          )}
        </button>
      </div>
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handlePasswordChangeSubmit}>Submit</button>
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSideBar;
