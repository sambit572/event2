import React, { useState } from "react";
import "./UserSideBar.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant.js";

function UserSideBar({ isOpen, setShowPasswordModal }) {
  const [fullName, setFullName] = useState("Rudransh Dash");
  const [email, setEmail] = useState("rudransh7381@gmail.com");
  const [contact, setContact] = useState("+91 9692486267");
  const [eventsBooked, setEventsBooked] = useState("3");

  const [editMode, setEditMode] = useState(false);


  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  

  return (
    <div className={`user-sidebar ${isOpen ? "open" : "closed"}`}>
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

        <button className="edit-button flex gap-1" onClick={handleToggleEdit}>
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
    </div>
  );
}

export default UserSideBar;
