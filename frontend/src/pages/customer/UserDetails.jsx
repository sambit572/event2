import React, { useState } from "react";
import "./UserDetails.css";
import CustomerNegotiationModal from "../../components/customer/CustomerNegotiationModal";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    altPhone: "",
    startDate: "",
    endDate: "",
    address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    country: "India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit pincode to 6 digits only
    if (name === "pincode") {
      if (/^\d{0,6}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    if (name === "userName") {
      setUserName(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const { pincode } = formData;
    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(pincode)) {
      alert("Pincode must be exactly 6 digits.");
      return;
    }

    console.log("User Name:", userName);
    console.log("Form Data:", formData);
    const allFieldsFilled =
      userName.trim() !== "" &&
      Object.values(formData).every((value) => value.trim() !== "");

    if (allFieldsFilled) {
      navigate("/pop-up", {
        state: {
          userName,
          venueLocation: formData.address,
          eventDate: formData.startDate,
        },
      }); // Show the modal
    } else {
      alert("Please fill in all fields before saving.");
    }
  };

  const handleCancel = () => {
    alert("Cancelled");
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="user-details-container">
      <h3>Enter Your User Details</h3>
      <form className="user-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>User Name:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter full name"
            name="userName"
            value={userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="location-group">
          <div className="form-group small">
            <label>Phone Number:</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group small">
            <label>Alternate Number:</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Alternate number"
              name="altPhone"
              value={formData.altPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="date-group">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-input"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              className="form-input"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Event Address:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter event address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="location-group">
          <div className="form-group small">
            <label>State:</label>
            <select
              className="form-input"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">State</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          <div className="form-group small">
            <label>District:</label>
            <select
              className="form-input"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">District</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Mumbai Suburban">Mumbai Suburban</option>
              <option value="Bangalore Urban">Bangalore Urban</option>
              <option value="Chennai">Chennai</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>

          <div className="form-group small">
            <label>City:</label>
            <select
              className="form-input"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">City</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>

          <div className="form-group small">
            <label>Pincode:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn save-btn">
            Save
          </button>
          <button
            type="button"
            className="btn cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
