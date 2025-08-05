import React, { useState, useEffect } from "react";
import "./DashboardServices.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";

const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [editedData, setEditedData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  function formatDuration(totalMinutes) {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const dStr = days > 0 ? `${days}d ` : "";
    const hStr = hours > 0 ? `${hours}h ` : "";
    const mStr = minutes > 0 ? `${minutes}m` : "";

    return [dStr, hStr, mStr].filter(Boolean).join(" : ")|| "0m";
  }

  const updateDuration = (value, unit) => {
    const days =
      unit === "days" ? +value : Math.floor(editedData.duration / (24 * 60));
    const hours =
      unit === "hours"
        ? +value
        : Math.floor((editedData.duration % (24 * 60)) / 60);
    const minutes = unit === "minutes" ? +value : editedData.duration % 60;

    const totalMinutes = days * 24 * 60 + hours * 60 + minutes;

    setEditedData((prev) => ({
      ...prev,
      duration: totalMinutes,
    }));
  };


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/vendors/my-services`, {
          withCredentials: true,
        });

        if (res.data?.data?.length > 0) {
          setServices(res.data.data);
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
    setEditedData(services[index]);
    setNewImages([]);
  };

  const handleSave = async (index) => {
    try {
      const serviceId = services[index]._id;
      const existingImages = editedData.serviceImage || [];

      const totalImages = existingImages.length + newImages.length;
      if (totalImages > 5) {
        alert(
          `You can upload a maximum of 5 images.\nYou already have ${existingImages.length
          } images.\nPlease remove ${totalImages - 5} image(s) before saving.`
        );
        return;
      }

      let uploadedUrls = [];

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => {
          formData.append("images", file);
        });

        const res = await axios.post(
          `${BACKEND_URL}/vendors/upload-new-service-image/${serviceId}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (Array.isArray(res.data?.data)) {
          uploadedUrls = res.data.data;
        } else if (typeof res.data?.data === "string") {
          uploadedUrls.push(res.data.data);
        }
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const payload = {
        serviceName: editedData.serviceName,
        serviceDes: editedData.serviceDes,
        serviceCategory: editedData.serviceCategory,
        minPrice: editedData.minPrice,
        maxPrice: editedData.maxPrice,
        locationOffered: editedData.locationOffered,
        duration: editedData.duration,
        serviceImage: allImages,
      };

      const updateRes = await axios.put(
        `${BACKEND_URL}/vendors/update-service/${serviceId}`,
        payload,
        { withCredentials: true }
      );

      const updatedService = updateRes.data.data;
      const updatedList = [...services];
      updatedList[index] = updatedService;
      setServices(updatedList);
      setEditingIndex(null);
    } catch (error) {
      console.error("❌ Failed to update service:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
      const serviceId = services[index]._id;
      await axios.delete(`${BACKEND_URL}/vendors/delete-service/${serviceId}`, {
        withCredentials: true,
      });

      const updatedList = [...services];
      updatedList.splice(index, 1);
      setServices(updatedList);
    } catch (error) {
      console.error("❌ Failed to delete service:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceDes") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 500) return;
    }

    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (index, imgUrl) => {
    setSelectedImages((prev) => ({
      ...prev,
      [index]: imgUrl,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalSelected =
      editedData.serviceImage.length + newImages.length + files.length;
    if (totalSelected > 5) {
      alert(
        `You can only upload up to 5 images in total. Remove ${totalSelected - 5} image(s).`
      );
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleToggleAvailability = async (index) => {
    const updatedList = [...services];
    const currentService = updatedList[index];
    const newAvailability = !currentService.available;

    if (!newAvailability) {
      const confirm = window.confirm("Are you sure you want to mark this service as unavailable?");
      if (!confirm) return;
    }

    updatedList[index].available = newAvailability;
    setServices(updatedList);

    try {
      await axios.patch(
        `${BACKEND_URL}/vendors/update-availability/${currentService._id}`,
        { available: newAvailability },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("❌ Failed to update availability", err);
      updatedList[index].available = !newAvailability;
      setServices(updatedList);
      alert("Failed to update availability.");
    }
  };

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  return (
    <div className="service-container"> 
      {services.length > 0 ? (
        services.map((service, index) => {
          const isEditing = editingIndex === index;
          const selectedImage = selectedImages[index] || service.serviceImage?.[0];

          return (
            <section key={index} className="service-box xl:ml-20 mb-10">
              <div className="availability-toggle-wrapper">
                <label
                  className={`toggle-switch ${
                    service.available ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={service.available}
                    onChange={() => handleToggleAvailability(index)}
                    className="sr-only"
                  />
                  <span
                    className={`toggle-dot ${
                      service.available ? "active" : ""
                    }`}
                  />
                </label>
                <span className="availability-label">
                  {service.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="both_images_section">
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

                <div className="main-image-and-buttons">
                  <img
                    src={selectedImage}
                    alt="Service"
                    className="main-image-dashboard"
                  />
                  <div className="buttons-dashboard">
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

              {isEditing ? (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start sm:items-center px-4 py-6 overflow-y-auto">
                  <form className="dashboard-custom-form">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        name="serviceName"
                        value={editedData.serviceName}
                        onChange={handleChange}
                        placeholder="Service Name"
                        className="w-full p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                      />

                      <input
                        type="text"
                        name="locationOffered"
                        value={
                          Array.isArray(editedData.locationOffered)
                            ? editedData.locationOffered.join(", ")
                            : ""
                        }
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            locationOffered: e.target.value
                              .split(",")
                              .map((loc) => loc.trim()),
                          }))
                        }
                        placeholder="Locations (comma separated)"
                        className="w-full p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                      />

                      <div className="flex gap-3 -pt-6 w-full">
                        <input
                          type="number"
                          name="minPrice"
                          value={editedData.minPrice || ""}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              minPrice: e.target.value,
                            }))
                          }
                          placeholder="Min Price"
                          className="w-1/2 p-1  bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                        />
                        <input
                          type="number"
                          name="maxPrice"
                          value={editedData.maxPrice || ""}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              maxPrice: e.target.value,
                            }))
                          }
                          placeholder="Max Price"
                          className="w-1/2 p-1 bg-[#f1f1f1] text-black border border-[#001f3f] rounded-md"
                        />
                      </div>

                      <input
                        type="text"
                        name="serviceCategory"
                        value={editedData.serviceCategory}
                        onChange={handleChange}
                        placeholder="Service Category"
                        className="w-full p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                      />

                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-16 text-center p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                            value={Math.floor(editedData.duration / (24 * 60))}
                            onChange={(e) =>
                              updateDuration(e.target.value, "days")
                            }
                            placeholder="Days"
                          />
                          <span>D</span>
                        </div>

                        <span>:</span>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-16 text-center p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                            value={Math.floor(
                              (editedData.duration % (24 * 60)) / 60
                            )}
                            onChange={(e) =>
                              updateDuration(e.target.value, "hours")
                            }
                            placeholder="Hours"
                          />
                          <span>H</span>
                        </div>

                        <span>:</span>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-16 text-center p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                            value={editedData.duration % 60}
                            onChange={(e) =>
                              updateDuration(e.target.value, "minutes")
                            }
                            placeholder="Minutes"
                          />
                          <span>M</span>
                        </div>
                      </div>

                      <textarea
                        name="serviceDes"
                        value={editedData.serviceDes}
                        onChange={handleChange}
                        placeholder="Description"
                        maxLength={500}
                        className="w-full min-h-[90px] p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                      />
                    </div>

                    {/* Image Preview Area */}
                    <div className="flex flex-nowrap overflow-x-auto items-center gap-3 pt-2">
                      {editedData.serviceImage?.map((img, i) => (
                        <div
                          key={`existing-${i}`}
                          className="relative w-10 h-10 shrink-0"
                        >
                          <img
                            src={img}
                            alt={`thumb-${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 text-red-600 p-[3px] text-[10px] bg-white rounded-full"
                            onClick={() => {
                              const updatedImgs = [...editedData.serviceImage];
                              updatedImgs.splice(i, 1);
                              setEditedData((prev) => ({
                                ...prev,
                                serviceImage: updatedImgs,
                              }));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {newImagePreviews.map((url, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative w-10 h-10 shrink-0"
                        >
                          <img
                            src={url}
                            alt={`new-preview-${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 text-red-600 p-[3px] text-[10px] bg-white rounded-full"
                            onClick={() => {
                              const updatedPreviews = [...newImagePreviews];
                              const updatedFiles = [...newImages];
                              updatedPreviews.splice(i, 1);
                              updatedFiles.splice(i, 1);
                              setNewImages(updatedFiles);
                              setNewImagePreviews(updatedPreviews);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {editedData.serviceImage.length +
                        newImagePreviews.length <
                        5 && (
                        <label className="w-14 h-14 border-2 border-dashed border-[#001f3f] rounded flex items-center justify-center cursor-pointer shrink-0">
                          <FaPlus className="text-gray-500 text-xs" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => handleSave(index)}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="right-section xl:w-[500px] xl:ml-3">
                  <div className="details">
                    <h2 className="details-h2">{service.serviceName}</h2>
                    <div className="l">
                      <strong>Locations: </strong>
                      {Array.isArray(service.locationOffered)
                        ? service.locationOffered.join(", ")
                        : service.locationOffered}
                    </div>
                    <div className="pr">
                      <strong>Price: </strong>₹ {service.minPrice} - ₹{" "}
                      {service.maxPrice}
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
                </div>
              )}
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
