import React, { useEffect, useState } from "react";
import "./UserDetails.css";

const UserDetails = () => {
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    altPhone: "",
    startDate: "",
    endDate: "",
    address: "",
    landmark: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(to right, #d946ef, #6366f1)";

    return () => {
      // Reset to default or transparent when this page is left
      document.body.style.background = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    const allFieldsFilled =
      userName.trim() !== "" &&
      Object.values(formData).every((value) => value.trim() !== "");

    if (allFieldsFilled) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else {
      alert("Please fill in all fields before saving.");
    }
  };

  const handleCancel = () => {
    alert("Cancelled");
  };

  return (
    <div className="user-details-page">
      <div className="user-details-container">
        <h3 className="form-title">Fill Out Your Event Details</h3>
        <form className="user-form" onSubmit={handleSave}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="userName"
              value={userName}
              onChange={handleChange}
              required
            />
            <label>User Name</label>
          </div>

          <div className="location-group">
            <div className="form-group small">
              <input
                type="tel"
                className="form-input"
                placeholder=" "
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label>Phone Number</label>
            </div>

            <div className="form-group small">
              <input
                type="tel"
                className="form-input"
                placeholder=" "
                name="altPhone"
                value={formData.altPhone}
                onChange={handleChange}
                required
              />
              <label>Alternate Number</label>
            </div>
          </div>

          <div className="date-group">
            <div className="form-group small">
              <input
                type="date"
                className="form-input"
                placeholder=" "
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <label>Start Date</label>
            </div>

            <div className="form-group small">
              <input
                type="date"
                className="form-input"
                placeholder=" "
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <label>End Date</label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Event Address</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
            <label>Landmark</label>
          </div>

          <div className="location-group">
            <div className="form-group small">
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
              <label>State</label>
            </div>

            <div className="form-group small">
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
              <label>District</label>
            </div>

            <div className="form-group small">
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
              <label>City</label>
            </div>

            <div className="form-group small">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
              <label>Pincode</label>
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

          {showPopup && (
            <div className="popup-inside">
              <strong>{userName},</strong>
              <br />
              <p>Your User Details Saved Successfully!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
