import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";
import { MdReportGmailerrorred } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./DashboardServices.css";

const DashboardServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [editedData, setEditedData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState({});

  // Added states for enhanced UX
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileSizeError, setFileSizeError] = useState("");

  const toggleExpandLocation = (index) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  function formatDuration(totalMinutes) {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    const dStr = days > 0 ? `${days}d ` : "";
    const hStr = hours > 0 ? `${hours}h ` : "";
    const mStr = minutes > 0 ? `${minutes}m` : "";
    return [dStr, hStr, mStr].filter(Boolean).join(" : ") || "0m";
  }

  const toggleExpand = () => setExpanded(!expanded);

  const handleOpenAddService = () => {
    navigate("/vendor/services/addServices");
  };

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
    // Reset error states when entering edit mode
    setErrorMessage("");
    setFileSizeError("");
    setIsSaving(false);
  };

  // Added cancel handler
  const handleCancel = (index) => {
    if (!isSaving) {
      setEditingIndex(null);
      setEditedData({});
      setNewImages([]);
      setNewImagePreviews([]);
      setErrorMessage("");
      setFileSizeError("");
    }
  };

  const handleSave = async (index) => {
    // Set saving state and clear previous errors
    setIsSaving(true);
    setErrorMessage("");

    try {
      const serviceId = services[index]._id;
      const existingImages = editedData.serviceImage || [];
      const totalImages = existingImages.length + newImages.length;

      if (totalImages > 10) {
        setErrorMessage(
          `You can upload a maximum of 10 images. ` +
            `You already have ${existingImages.length} images. ` +
            `Please remove ${totalImages - 10} image(s) before saving.`
        );
        // This alert was redundant with the error message display, but kept to match the provided code
        alert(
          `You can upload a maximum of 10 images.\n` +
            `You already have ${existingImages.length} images.\n` +
            `Please remove ${totalImages - 10} image(s) before saving.`
        );
        setIsSaving(false);
        return;
      }

      // 🟢 [CHANGED] Step 1: Only upload new images to Cloudinary, DO NOT save to DB here
      let uploadedUrls = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("images", file));

        try {
          console.log("Uploading new service images to Cloudinary…"); // 🟢 [CHANGED] clearer log
          const res = await axios.post(
            `${BACKEND_URL}/vendors/upload-new-service-image/${serviceId}`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("Image upload response:", res.data);
          if (Array.isArray(res.data?.data)) {
            uploadedUrls = res.data.data;
          }
        } catch (error) {
          console.error("❌ Failed to upload images:", error);
          setErrorMessage(
            error.response?.data?.message ||
              "Failed to upload images. Please check your internet connection and try again."
          );
          setIsSaving(false);
          return; // Stop the save process if upload fails
        }
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const payload = {
        serviceName: editedData.serviceName,
        serviceDes: editedData.serviceDes,
        serviceCategory: editedData.serviceCategory,
        minPrice: Number(editedData.minPrice),
        maxPrice: Number(editedData.maxPrice),
        locationOffered: Array.isArray(editedData.locationOffered)
          ? editedData.locationOffered
          : [editedData.locationOffered],
        duration: Number(editedData.duration),
        serviceImage: allImages,
      };

      console.log("Sending final service update payload:", payload);
      const updateRes = await axios.put(
        `${BACKEND_URL}/vendors/update-service/${serviceId}`,
        payload,
        { withCredentials: true }
      );

      console.log("Update response from DB:", updateRes.data);

      const updatedService = updateRes.data.data;
      const updatedList = [...services];
      updatedList[index] = updatedService;

      setServices(updatedList);
      setEditingIndex(null);
      setNewImages([]);
      setErrorMessage("");
      setIsSaving(false);
    } catch (error) {
      console.error("❌ Failed to update service:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update service. Please check all fields and try again."
      );
      setIsSaving(false);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
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
      console.error("❌ Failed to delete service:", error);
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

    // Check file sizes (max 6MB per file)
    const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB in bytes
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      setFileSizeError(
        `The following file(s) exceed 5MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      setTimeout(() => setFileSizeError(""), 5000); // Clear error after 5 seconds
      return;
    }

    const totalSelected =
      editedData.serviceImage.length + newImages.length + files.length;
    if (totalSelected > 10) {
      alert(
        `You can only upload up to 10 images in total. Remove ${
          totalSelected - 10
        } image(s).`
      );
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    setFileSizeError(""); // Clear any previous file size errors
  };

  const handleToggleAvailability = async (index) => {
    const updatedList = [...services];
    const currentService = updatedList[index];
    const newAvailability = !currentService.available;
    if (!newAvailability) {
      const confirm = window.confirm(
        "Are you sure you want to mark this service as unavailable?"
      );
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
    <div className="flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[480px]">
      {services.length > 0 ? (
        services.map((service, index) => {
          const isEditing = editingIndex === index;
          const selectedImage =
            selectedImages[index] || service.serviceImage?.[0];

          return (
            <section
              key={index}
              className="relative flex flex-col xl:flex-row gap-6 shadow-lg w-[90%] mx-auto mb-6 p-4 bg-white rounded-md border-l-4 border-[#00897b]"
            >
              {/* Availability toggle */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <label
                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full cursor-pointer p-[2px] transition-colors duration-300 ${
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
                    className={`absolute top-[2px] left-[2px] w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      service.available
                        ? "translate-x-[24px] sm:translate-x-[28px]"
                        : ""
                    }`}
                  />
                </label>
                <span className="text-sm sm:text-base font-semibold text-[#001f3f]">
                  {service.available ? "Available" : "Unavailable"}
                </span>
              </div>
              {/* Image Slider Section */}
              <div className="relative w-full sm:w-[400px] lg:h-[190px] sm:h-[200px] mt-5 mx-auto group">
                {/* Big Image */}
                <img
                  src={selectedImages[index] || service.serviceImage?.[0]}
                  alt="Service"
                  className="w-full h-full object-cover rounded-md"
                />

                {/* Left Arrow */}
                {service.serviceImage?.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIndex = service.serviceImage.indexOf(
                        selectedImages[index] || service.serviceImage[0]
                      );
                      const prevIndex =
                        (currentIndex - 1 + service.serviceImage.length) %
                        service.serviceImage.length;
                      handleImageSelect(index, service.serviceImage[prevIndex]);
                    }}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ❮
                  </button>
                )}

                {/* Right Arrow */}
                {service.serviceImage?.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIndex = service.serviceImage.indexOf(
                        selectedImages[index] || service.serviceImage[0]
                      );
                      const nextIndex =
                        (currentIndex + 1) % service.serviceImage.length;
                      handleImageSelect(index, service.serviceImage[nextIndex]);
                    }}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ❯
                  </button>
                )}

                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {service.serviceImage?.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => handleImageSelect(index, img)}
                      className={`w-1 h-1 rounded-full px-1 py-1 ${
                        selectedImages[index] === img
                          ? "bg-white"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap mt-2 justify-center gap-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="flex items-center gap-2 px-3 py-1.5 text-white font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md hover:scale-105"
                  >
                    <FaEdit className="text-sm" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="flex items-center gap-2 px-3 py-1.5 text-white font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-md hover:scale-105"
                  >
                    <FaTrash className="text-sm" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate("/report", {
                        state: { selectedType: "vendor" },
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#001F3F] to-[#003366] shadow-md hover:scale-105"
                  >
                    <MdReportGmailerrorred className="text-lg" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Editing Mode */}
              {isEditing ? (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start sm:items-center px-4 py-6 overflow-y-auto">
                  <form className="dashboard-custom-form relative">
                    {/* Loading overlay */}
                    {isSaving && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center rounded-md">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-700 font-semibold">
                          Saving changes...
                        </p>
                      </div>
                    )}

                    {/* Error message display */}
                    {errorMessage && (
                      <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        <p className="text-sm font-medium">{errorMessage}</p>
                      </div>
                    )}

                    <div className="flex flex-col space-y-2">
                      {/* Service Name */}
                      <input
                        type="text"
                        name="serviceName"
                        value={editedData.serviceName}
                        onChange={handleChange}
                        placeholder="Service Name"
                        className="w-full p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                        disabled={isSaving}
                      />

                      {/* Locations */}
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
                        disabled={isSaving}
                      />

                      {/* Price Inputs */}
                      <div className="flex gap-3 w-full">
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
                          className="w-1/2 p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                          disabled={isSaving}
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
                          className="w-1/2 p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                          disabled={isSaving}
                        />
                      </div>

                      {/* Category */}
                      <input
                        type="text"
                        name="serviceCategory"
                        value={editedData.serviceCategory}
                        onChange={handleChange}
                        placeholder="Service Category"
                        className="w-full p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                        disabled={isSaving}
                      />

                      {/* Duration */}
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
                            disabled={isSaving}
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
                            disabled={isSaving}
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
                            disabled={isSaving}
                          />
                          <span>M</span>
                        </div>
                      </div>

                      {/* Description */}
                      <textarea
                        name="serviceDes"
                        value={editedData.serviceDes}
                        onChange={handleChange}
                        placeholder="Description"
                        maxLength={500}
                        className="w-full min-h-[90px] p-1 bg-[#f1f1f1] border border-[#001f3f] rounded-md"
                        disabled={isSaving}
                      />
                    </div>

                    {/* Image upload info and file size error */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">
                        Maximum file size: 5MB per photo. You can upload up to 10
                        photos total.
                      </p>
                      {fileSizeError && (
                        <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm mb-2">
                          {fileSizeError}
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="flex flex-nowrap overflow-x-auto items-center gap-1 pt-2">
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
                            disabled={isSaving}
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
                            disabled={isSaving}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {editedData.serviceImage.length +
                        newImagePreviews.length <
                        10 && (
                        <label
                          className={`w-14 h-14 border-2 border-dashed border-[#001f3f] rounded flex items-center justify-center shrink-0 ${
                            isSaving
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        >
                          <FaPlus className="text-gray-500 text-xs" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple // Allow multiple file selection
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isSaving}
                          />
                        </label>
                      )}
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => handleSave(index)}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(index)}
                        className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* View Mode */
                <div className="right-section xl:w-[600px] items-start xl:ml-3">
                  <div className="details">
                    <h2 className="details-h2 mt-6">{service.serviceName}</h2>
                    <div className="l">
                      <strong>Locations: </strong>
                      {Array.isArray(service.locationOffered) ? (
                        <>
                          {expandedLocations[index]
                            ? service.locationOffered.join(", ")
                            : service.locationOffered.slice(0, 3).join(", ") +
                              (service.locationOffered.length > 3 ? "..." : "")}
                          {service.locationOffered.length > 3 && (
                            <button
                              onClick={() => toggleExpandLocation(index)}
                              className="ml-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                              {expandedLocations[index]
                                ? "Read Less"
                                : "Read More"}
                            </button>
                          )}
                        </>
                      ) : (
                        service.locationOffered
                      )}
                    </div>

                    <div className="pr">
                      <strong>Price: </strong>₹ {service.minPrice} - ₹{" "}
                      {service.maxPrice}
                    </div>
                    <div className="c">
                      <strong>Category: </strong> {service.serviceCategory}
                    </div>
                    <div className="d">
                      <strong>Duration: </strong>{" "}
                      {formatDuration(service.duration)}
                    </div>

                    {/* Description with Read More */}
                    <div className="mt-2">
                      <div className="des font-semibold text-gray-800">
                        Description:
                      </div>
                      <div className="text-gray-700">
                        {expanded
                          ? service.serviceDes
                          : service.serviceDes.slice(0, 80) +
                            (service.serviceDes.length > 80 ? "..." : "")}
                        {service.serviceDes.length > 80 && (
                          <button
                            onClick={toggleExpand}
                            className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                          >
                            {expanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="u flex justify-between">
                      <strong>User Reviews: </strong> {service.userReviews}
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
      <div className="w-full flex justify-center items-center relative">
        <button
          onClick={handleOpenAddService}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 font-semibold text-white px-5 py-2.5 shadow-md hover:scale-105"
        >
          <span className="text-xl font-bold">+</span>
          <span className="text-base">Services</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardServices;
