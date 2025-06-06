import React, { useState } from "react";
import "./DashboardServices.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import DashBoardBooking from "./DashBoardBooking.jsx";

const dummyService = {
  images: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1542628682-88321d2a4828?w=600&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1723874456091-9ce73850e566?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=600&auto=format&fit=crop&q=60",
  ],
  title: "Dj Wedding Service",
  location: "Patia, Bhubaneswar, Odisha, India",
  priceRange: "₹50,000 - ₹55,000",
  category: "Dj",
  duration: "1D : 06H : 30M",
  description:
    "Lorem ipsum dolour sit a met, connecter adipescnt elite, sed do temper incident ut labore et dolore magna aliquant.",
  userReviews: 300,
};

const DashboardServices = () => {
  const [selectedImage, setSelectedImage] = useState(dummyService.images[0]);
  const [activeTab, setActiveTab] = useState("services");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...dummyService });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optional: Save to backend here
  };

  return (
    <div className="dashboard-container">
      <main className="content-area">
        <div className="tab-buttons">
          <button
            className={activeTab === "services" ? "active" : ""}
            onClick={() => setActiveTab("services")}
          >
            My Services
          </button>
          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </div>

        {activeTab === "services" ? (
          <section className="service-card">
            <div className="thumbnail-column">
              {formData.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`thumbnail ${
                    selectedImage === img ? "selected" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            <div className="main-image-and-buttons">
              <img
                src={selectedImage}
                alt="DJ Service"
                className="main-image"
              />
              <div className="image-buttons">
                <button className="edit" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>

            <div className="right-section">
              {isEditing ? (
                <form className="edit-form">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    placeholder="Price Range"
                  />
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  <button type="button" onClick={handleSave}>
                    Save
                  </button>
                </form>
              ) : (
                <div className="details">
                  <h2 className="details-h2">{formData.title}</h2>
                  <p className="l">{formData.location}</p>
                  <p className="pr">{formData.priceRange}</p>
                  <p className="c">
                    <strong>Category: </strong>
                    {formData.category}
                  </p>
                  <p className="d">
                    <strong>Duration: </strong>
                    {formData.duration}
                  </p>
                  <p className="des">
                    <strong>Description: </strong>
                  </p>
                  <p>{formData.description}</p>
                  <p className="u">
                    <strong>User Reviews: </strong>
                    {formData.userReviews}
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <h2 className="booking-h2">Booking Details</h2>
            <DashBoardBooking />
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardServices;
