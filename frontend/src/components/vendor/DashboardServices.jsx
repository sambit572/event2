import React, { useState } from "react";
import "./DashboardServices.css";
import { FaTrash, FaEdit } from "react-icons/fa";

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
    <section className="service-box  xl:ml-20">
      <div className="thumbnail-column-dashboard">
        {formData.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      <div className="main-image-and-buttons">
        <img
          src={selectedImage}
          alt="DJ Service"
          className="main-image-dashboard"
        />
        <div className="image-buttons-dashboard">
          <button
            className="edit flex gap-1"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit
          </button>
          <button className="delete flex gap-1">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="right-section">
        {isEditing ? (
          <form className="edit-form-dashboard">
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
          <div className="details xl:w-[500px] xl:ml-3">
            <h2 className="details-h2">{formData.title}</h2>
            <div className="l">{formData.location}</div>
            <div className="pr">{formData.priceRange}</div>
            <div className="c">
              <strong>Category: </strong>
              {formData.category}
            </div>
            <div className="d">
              <strong>Duration: </strong>
              {formData.duration}
            </div>
            <div className="des">
              <strong>Description: </strong>
            </div>
            <div>{formData.description}</div>
            <div className="u">
              <strong>User Reviews: </strong>
              {formData.userReviews}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardServices;
