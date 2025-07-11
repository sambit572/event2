import React, { useState, useEffect } from "react";
import "./DashboardServices.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";

const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [editedData, setEditedData] = useState({});

  function formatDuration(totalMinutes) {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const dStr = days > 0 ? `${days} ${days === 1 ? "day" : "days"} ` : "";
    const hStr = `${hours} ${hours === 1 ? "hour" : "hours"} `;
    const mStr = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;

    return `${dStr} : ${hStr} : ${mStr}`;
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/vendors/my-services`, {
          withCredentials: true,
        });

        console.log("res data of dashboard services :", res.data);
        if (res.data?.data?.length > 0) {
          setServices(res.data.data);

          // Initialize selected image per service
          const initialImages = {};
          res.data.data.forEach((service, index) => {
            initialImages[index] = service.serviceImage?.[0] || "";
          });
          setSelectedImages(initialImages);
        }
      } catch (err) {
        console.error("Failed to fetch vendor services", err);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedData(services[index]); // copy current service data
  };

  const handleSave = async (index) => {
    try {
      const serviceId = services[index]._id;

      const payload = {
        serviceName: editedData.serviceName,
        serviceDes: editedData.serviceDes,
        serviceCategory: editedData.serviceCategory,
        priceRange: editedData.priceRange,
        locationOffered: editedData.locationOffered,
        duration: editedData.duration,
        serviceImage:
          editedData.serviceImage?.length > 0
            ? editedData.serviceImage
            : services[index].serviceImage,
      };

      const res = await axios.put(
        `${BACKEND_URL}/vendors/update-service/${serviceId}`,
        payload,
        { withCredentials: true }
      );

      console.log("✅ Service updated:", res.data);

      // Replace updated service in local state
      const updatedService = res.data.data;
      const updatedList = [...services];
      updatedList[index] = updatedService;
      setServices(updatedList);

      setEditingIndex(null);
    } catch (error) {
      console.error(
        "❌ Failed to update service:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;

    try {
      const serviceId = services[index]._id;

      const res = await axios.delete(
        `${BACKEND_URL}/vendors/delete-service/${serviceId}`,
        { withCredentials: true }
      );

      console.log("✅ Service deleted:", res.data);

      const updatedList = [...services];
      updatedList.splice(index, 1);
      setServices(updatedList);
    } catch (error) {
      console.error(
        "❌ Failed to delete service:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (index, imgUrl) => {
    setSelectedImages((prev) => ({
      ...prev,
      [index]: imgUrl,
    }));
  };

  return (
    <div>
      {services.length > 0 ? (
        services.map((service, index) => {
          const isEditing = editingIndex === index;
          const selectedImage =
            selectedImages[index] || service.serviceImage?.[0];

          return (
            <section key={index} className="service-box xl:ml-20  mb-10">
              <div className="both_images_section">
                {/* Image Thumbnails */}
                <div className="thumbnail-column-dashboard">
                  {service.serviceImage?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      className={`thumbnail ${
                        selectedImage === img ? "selected" : ""
                      }`}
                      onClick={() => handleImageSelect(index, img)}
                    />
                  ))}
                </div>

                {/* Main Image and Action Buttons */}
                <div className="main-image-and-buttons">
                  <img
                    src={selectedImage}
                    alt="Service"
                    className="main-image-dashboard"
                  />
                  <div className="image-buttons-dashboard">
                    <button
                      className="vendor-edit-btn flex gap-1"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit className="mt-[2.9px]" /> Edit
                    </button>
                    <button
                      className="vendor-delete-btn flex gap-1"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash className="mt-[2.9px]" /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Section - Editable or ReadOnly */}
              <div className="right-section xl:w-[500px] xl:ml-3">
                {isEditing ? (
                  <form className="edit-form-dashboard">
                    <input
                      type="text"
                      name="serviceName"
                      value={editedData.serviceName}
                      onChange={handleChange}
                      placeholder="Service Name"
                    />
                    <input
                      type="text"
                      name="locationOffered"
                      value={editedData.locationOffered}
                      onChange={handleChange}
                      placeholder="Location Offered"
                    />
                    <input
                      type="text"
                      name="priceRange"
                      value={editedData.priceRange}
                      onChange={handleChange}
                      placeholder="Price Range"
                    />
                    <input
                      type="text"
                      name="serviceCategory"
                      value={editedData.serviceCategory}
                      onChange={handleChange}
                      placeholder="Service Category"
                    />
                    <input
                      type="text"
                      name="duration"
                      value={editedData.duration}
                      onChange={handleChange}
                      placeholder="Duration"
                    />
                    <textarea
                      name="serviceDes"
                      value={editedData.serviceDes}
                      onChange={handleChange}
                      placeholder="Description"
                    />
                    <button type="button" onClick={() => handleSave(index)}>
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="details">
                    <h2 className="details-h2">{service.serviceName}</h2>
                    <div className="l">{service.locationOffered}</div>
                    <div className="pr">
                      <strong>Price Range: </strong>
                      {`₹ ${service.priceRange}`}
                    </div>
                    <div className="c">
                      <strong>Category: </strong>
                      {service.serviceCategory}
                    </div>
                    <div className="d">
                      <strong>Duration: </strong>
                      {formatDuration(service.duration)}
                    </div>
                    <div className="des">
                      <strong>Description: </strong>
                    </div>
                    <div>{service.serviceDes}</div>
                    <div className="u">
                      <strong>User Reviews: </strong>
                      {service.userReviews}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-center text-gray-600 mt-20">No services found.</p>
      )}
    </div>
  );
};

export default DashboardServices;
