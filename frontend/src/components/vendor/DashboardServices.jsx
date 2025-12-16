import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaYoutube } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";
import { MdReportGmailerrorred } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./DashboardServices.css";
import ReactCrop, { centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRef } from "react";

const getYouTubeID = (url) => {
  // console.log("Extracting YouTube ID from URL:", url);
  if (typeof url !== "string") return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  // console.log("YouTube ID match result:", match);
  return match && match[2].length === 11 ? match[2] : null;
};

const DashboardServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  // ✅ MODIFIED: Renamed to handle both image and video URLs
  const [editedData, setEditedData] = useState({});

  // ✅ MODIFIED: States to manage new files before they are uploaded
  const [newImages, setNewImages] = useState([]);

  const [selectedMedia, setSelectedMedia] = useState({});
  const [newVideos, setNewVideos] = useState([]); // State for video files
  const [newMediaPreviews, setNewMediaPreviews] = useState([]); // Unified state for all previews

  const [expanded, setExpanded] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileSizeError, setFileSizeError] = useState("");
  const [expandedServiceType, setExpandedServiceType] = useState({});
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80, // default crop width
    height: 80,
  });
  const [cropSrc, setCropSrc] = useState(null);
  const imgRef = useRef(null);

  // ✅ Fixed getCroppedImg (now takes image + crop explicitly)
  const getCroppedImg = async (image, crop) => {
    if (!image || !crop?.width || !crop?.height) {
      throw new Error("Image or crop data is not available yet.");
    }

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;

    const croppedBlob = await getCroppedImg(imgRef.current, crop);
    const croppedFile = new File([croppedBlob], "cropped.webp", {
      type: "image/jpeg",
    });

    setNewImages((prev) => [...prev, croppedFile]);

    setNewMediaPreviews((prev) => [
      ...prev,
      {
        type: "image",
        url: URL.createObjectURL(croppedFile),
        file: croppedFile,
      },
    ]);

    // Close crop modal
    setCropSrc(null);
  };

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

  const ensureArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
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
            const media = service.serviceImage;
            initialImages[index] = media?.[0] || "";
          });
          setSelectedMedia(initialImages);
        }
      } catch (err) {
        console.error("Failed to fetch vendor services", err);
      }
    };
    fetchServices();
  }, [setNewMediaPreviews, setNewVideos]);

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
      setNewMediaPreviews([]);
      setErrorMessage("");
      setFileSizeError("");
    }
  };

  const handleSave = async (index) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const serviceId = services[index]._id;
      const existingMedia = editedData.serviceImage || [];

      // Total images (existing + new ones)
      const totalMedia =
        existingMedia.length + newImages.length + newVideos.length;

      if (totalMedia > 10) {
        setErrorMessage(
          `You can upload a maximum of 10 media items. ` +
            `You already have ${existingMedia.length}. ` +
            `Remove ${totalMedia - 10} item(s).`
        );
        setIsSaving(false);
        return;
      }

      let uploadedUrls = [];

      // -------------------------------------------
      // 1️⃣ Upload new media: image + video together
      // -------------------------------------------
      if (newImages.length > 0 || newVideos.length > 0) {
        const formData = new FormData();

        [...newImages, ...newVideos].forEach((file) =>
          formData.append("media", file)
        );

        formData.append("serviceName", editedData.serviceName);

        const uploadRes = await axios.post(
          `${BACKEND_URL}/vendors/upload-service-media`,
          formData,
          { withCredentials: true }
        );

        uploadedUrls = ensureArray(uploadRes.data.data);
      }

      // -------------------------------------------
      // 2️⃣ Merge old + new
      // -------------------------------------------
      const finalMedia = [...existingMedia, ...uploadedUrls];

      const payload = {
        ...editedData,
        serviceImage: finalMedia,
      };

      // -------------------------------------------
      // 3️⃣ Save full updated service
      // -------------------------------------------
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
      setNewImages([]);
      setNewVideos([]);
      setNewMediaPreviews([]);
      setErrorMessage("");
    } catch (error) {
      console.error("❌ Failed to update service:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update service."
      );
    } finally {
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

  const handleMediaSelect = (index, mediaUrl) => {
    setSelectedMedia((prev) => ({
      ...prev,
      [index]: mediaUrl,
    }));
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const MAX_IMAGE_SIZE_BYTES = 9 * 1024 * 1024; // 9MB

    // Step 1: Separate files and validate them first
    let imageFiles = [];
    let videoFiles = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          alert(`Image "${file.name}" is too large. The limit is 9MB.`);
          continue;
        }
        imageFiles.push(file);
      } else if (file.type.startsWith("video/")) {
        videoFiles.push(file);
      }
    }

    // Step 2: Check if adding the new media exceeds the total limit
    const currentMediaCount =
      (editedData.serviceImage || []).length +
      newImages.length +
      newVideos.length;
    if (currentMediaCount + imageFiles.length + videoFiles.length > 10) {
      alert(`You can only upload up to 10 media items in total.`);
      return;
    }

    // Step 3: Trigger cropper ONLY for the first image
    if (imageFiles.length > 0) {
      // Take the first image out of the array. It will be handled by the cropper.
      const imageToCrop = imageFiles.shift();

      const reader = new FileReader();
      reader.onload = () => setCropSrc(reader.result);
      reader.readAsDataURL(imageToCrop);
    }

    // Step 4: Add all videos and any remaining (uncropped) images to the preview
    const newImagePreviews = imageFiles.map((file) => ({
      type: "image",
      url: URL.createObjectURL(file),
      file,
    }));
    const newVideoPreviews = videoFiles.map((file) => ({
      type: "video",
      url: URL.createObjectURL(file),
      file,
    }));

    setNewImages((prev) => [...prev, ...imageFiles]);
    setNewVideos((prev) => [...prev, ...videoFiles]);
    setNewMediaPreviews((prev) => [
      ...prev,
      ...newImagePreviews,
      ...newVideoPreviews,
    ]);
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
      newMediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newMediaPreviews]);
  const toggleExpandServiceType = (index) => {
    setExpandedServiceType((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (!editedData.serviceCategory) return;

    axios
      .get(
        `${BACKEND_URL}/vendors/subcategory-list/${editedData.serviceCategory}`
      )
      .then((res) => {
        setAvailableSubcategories(res.data.data); // array of subcategories
      })
      .catch(() => setAvailableSubcategories([]));
  }, [editedData.serviceCategory]);

  return (
    <div className="flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[480px]">
      {services.length > 0 ? (
        services.map((service, index) => {
          const serviceTypeText = Array.isArray(service.subCategory)
            ? service.subCategory.join(", ")
            : service.subCategory;
          const isEditing = editingIndex === index;
          const currentServiceImages = service.serviceImage || [];
          const selectedMediaUrl =
            selectedMedia[index] || currentServiceImages[0];

          const isCatering = service.pricingType === "perPlate";

          return (
            <section
              key={index}
              className="relative flex flex-col xl:flex-row gap-6 shadow-lg w-[90%] mx-auto mb-6 p-4 bg-white rounded-md border-l-4 border-[#00897b] cursor-pointer hover:shadow-xl transition"
            >
              {/* Availability toggle */}
              <div className="absolute top-[0.5rem] right-3 flex items-center gap-2">
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
              <div className="relative w-full sm:w-[400px] sm:h-[190px] mt-5 mx-auto group">
                <Link
                  to={`/service/${service.serviceCategory}/${service._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {getYouTubeID(selectedMediaUrl) ? (
                    <iframe
                      className={`w-full h-full object-contain rounded-md transition-all duration-300 ${
                        !service.available ? "grayscale brightness-75" : ""
                      }`}
                      src={`https://www.youtube.com/embed/${getYouTubeID(
                        selectedMediaUrl
                      )}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeID(
                        selectedMediaUrl
                      )}&rel=0`}
                      title="Service Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img
                      src={selectedMediaUrl}
                      alt="Service"
                      className={`w-full h-full object-contain rounded-md transition-all duration-300 ${
                        !service.available ? "grayscale brightness-75" : ""
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x200/cccccc/ffffff?text=Image+Not+Found";
                      }}
                    />
                  )}
                </Link>
                {/* Overlay when unavailable */}
                {!service.available && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-md">
                    <span className="text-white font-bold text-sm sm:text-sm px-4 py-2 bg-red-600/80 rounded-lg shadow-lg">
                      Service Unavailable
                    </span>
                  </div>
                )}
                {currentServiceImages.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIndex =
                        currentServiceImages.indexOf(selectedMediaUrl);
                      const prevIndex =
                        (currentIndex - 1 + currentServiceImages.length) %
                        currentServiceImages.length;
                      handleMediaSelect(index, currentServiceImages[prevIndex]);
                    }}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ❮
                  </button>
                )}

                {currentServiceImages.length > 1 && (
                  <button
                    onClick={() => {
                      const currentIndex =
                        currentServiceImages.indexOf(selectedMediaUrl);
                      const nextIndex =
                        (currentIndex + 1) % currentServiceImages.length;
                      handleMediaSelect(index, currentServiceImages[nextIndex]);
                    }}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ❯
                  </button>
                )}
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {currentServiceImages.map((mediaUrl, i) => (
                    <button
                      key={i}
                      onClick={() => handleMediaSelect(index, mediaUrl)}
                      className={`w-2 h-2 p-0 flex items-center justify-center rounded-full ${
                        selectedMediaUrl === mediaUrl
                          ? "bg-white"
                          : "bg-gray-400"
                      }`}
                    >
                      {getYouTubeID(mediaUrl) && (
                        <FaYoutube className="text-red-500 text-xs" />
                      )}
                    </button>
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
                        className="w-full p-1 bg-[#fff] border border-[#001f3f] rounded-md"
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
                        className="w-full p-1 bg-[#fff] border border-[#001f3f] rounded-md"
                        disabled={isSaving}
                      />

                      {/* Price Inputs */}
                      {editedData.pricingType === "perPlate" ? (
                        /* Catering Pricing Section */
                        <div className="w-full flex flex-col gap-3">
                          {/* Base per-plate price */}
                          <input
                            type="number"
                            name="perPlatePrice"
                            value={editedData.perPlatePrice || ""}
                            onChange={(e) =>
                              setEditedData((prev) => ({
                                ...prev,
                                perPlatePrice: e.target.value,
                              }))
                            }
                            placeholder="Per Plate Price"
                            className="w-full p-1 bg-white border border-[#001f3f] rounded-md"
                            disabled={isSaving}
                          />

                          {/* Min & Max Plates */}
                          <div className="flex gap-3">
                            <input
                              type="number"
                              name="minPlates"
                              value={editedData.minPlates || ""}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  minPlates: e.target.value,
                                }))
                              }
                              placeholder="Min Plates"
                              className="w-1/2 p-1 bg-white border border-[#001f3f] rounded-md"
                              disabled={isSaving}
                            />

                            <input
                              type="number"
                              name="maxPlates"
                              value={editedData.maxPlates || ""}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  maxPlates: e.target.value,
                                }))
                              }
                              placeholder="Max Plates"
                              className="w-1/2 p-1 bg-white border border-[#001f3f] rounded-md"
                              disabled={isSaving}
                            />
                          </div>

                          {/* Catering Packages */}
                          <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">
                              Packages
                            </label>

                            {editedData.packages?.map((pkg, index) => (
                              <div
                                key={index}
                                className="flex gap-2 items-center"
                              >
                                <input
                                  type="text"
                                  placeholder="Package Name"
                                  value={pkg.packageName}
                                  onChange={(e) => {
                                    const updated = [...editedData.packages];
                                    updated[index].packageName = e.target.value;
                                    setEditedData({
                                      ...editedData,
                                      packages: updated,
                                    });
                                  }}
                                  className="w-1/3 p-1 bg-white border border-[#001f3f] rounded-md"
                                />

                                <input
                                  type="number"
                                  placeholder="Price"
                                  value={pkg.perPlatePrice}
                                  onChange={(e) => {
                                    const updated = [...editedData.packages];
                                    updated[index].perPlatePrice =
                                      e.target.value;
                                    setEditedData({
                                      ...editedData,
                                      packages: updated,
                                    });
                                  }}
                                  className="w-1/3 p-1 bg-white border border-[#001f3f] rounded-md"
                                />

                                <input
                                  type="number"
                                  placeholder="Min Plates"
                                  value={pkg.minPlates}
                                  onChange={(e) => {
                                    const updated = [...editedData.packages];
                                    updated[index].minPlates = e.target.value;
                                    setEditedData({
                                      ...editedData,
                                      packages: updated,
                                    });
                                  }}
                                  className="w-1/6 p-1 bg-white border border-[#001f3f] rounded-md"
                                />

                                <input
                                  type="number"
                                  placeholder="Max Plates"
                                  value={pkg.maxPlates}
                                  onChange={(e) => {
                                    const updated = [...editedData.packages];
                                    updated[index].maxPlates = e.target.value;
                                    setEditedData({
                                      ...editedData,
                                      packages: updated,
                                    });
                                  }}
                                  className="w-1/6 p-1 bg-white border border-[#001f3f] rounded-md"
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editedData.packages.filter(
                                      (_, i) => i !== index
                                    );
                                    setEditedData({
                                      ...editedData,
                                      packages: updated,
                                    });
                                  }}
                                  className="text-red-500 font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}

                            {/* Add Package Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  packages: [
                                    ...prev.packages,
                                    {
                                      packageName: "",
                                      perPlatePrice: "",
                                      minPlates: "",
                                      maxPlates: "",
                                    },
                                  ],
                                }))
                              }
                              className="px-3 py-1 bg-[#001f3f] text-white rounded-md w-fit"
                            >
                              + Add Package
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Services Price Section */
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
                            className="w-1/2 p-1 bg-[#fff] border border-[#001f3f] rounded-md"
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
                            className="w-1/2 p-1 bg-[#fff] border border-[#001f3f] rounded-md"
                            disabled={isSaving}
                          />
                        </div>
                      )}

                      {/* Subcategory Multi-Select Checkboxes */}
                      <div className="flex flex-col">
                        <label className="font-semibold">Service Type</label>

                        {availableSubcategories.length === 0 ? (
                          <p className="text-sm text-red-600">
                            No subcategories found
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 mt-2 p-2 border border-[#001f3f] rounded-md bg-[#fff]">
                            {availableSubcategories.map((sub, i) => (
                              <label
                                key={i}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  value={sub}
                                  checked={editedData.subCategory?.includes(
                                    sub
                                  )}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    setEditedData((prev) => {
                                      const selected = prev.subCategory || [];

                                      if (selected.includes(value)) {
                                        // remove
                                        return {
                                          ...prev,
                                          subCategory: selected.filter(
                                            (item) => item !== value
                                          ),
                                        };
                                      } else {
                                        // add
                                        return {
                                          ...prev,
                                          subCategory: [...selected, value],
                                        };
                                      }
                                    });
                                  }}
                                  disabled={isSaving}
                                />
                                <span>{sub}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-16 text-center p-1 bg-[#fff] border border-[#001f3f] rounded-md"
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
                            className="w-16 text-center p-1 bg-[#fff] border border-[#001f3f] rounded-md"
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
                            className="w-16 text-center p-1 bg-[#fff] border border-[#001f3f] rounded-md"
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
                        className="w-full min-h-[90px] p-1 bg-[#fff] border border-[#001f3f] rounded-md"
                        disabled={isSaving}
                      />
                    </div>

                    {/* Image upload info and file size error */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">
                        Maximum file size: 9MB per photo i.e image size must be
                        below 9MB. You can upload up to 10 photos or videos
                        combined in total.
                      </p>
                      {fileSizeError && (
                        <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm mb-2">
                          {fileSizeError}
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="flex flex-nowrap items-center gap-1 pt-2">
                      {(editedData.serviceImage || []).map((mediaUrl, i) => (
                        <div
                          key={`existing-${i}`}
                          className="relative w-10 h-10 shrink-0"
                        >
                          {getYouTubeID(mediaUrl) ? (
                            <div className="w-full h-full bg-black rounded flex items-center justify-center">
                              <FaYoutube className="text-red-500 text-xl" />
                            </div>
                          ) : (
                            <img
                              decoding="async"
                              loading="lazy"
                              src={mediaUrl}
                              alt={`thumb-${i}`}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                          <button
                            type="button"
                            className="absolute top-0 right-0 text-red-600 p-[3px] text-[10px] bg-white rounded-full"
                            onClick={() => {
                              const currentMedia = [...editedData.serviceImage];
                              currentMedia.splice(i, 1);
                              setEditedData((prev) => ({
                                ...prev,
                                serviceImage: currentMedia,
                              }));
                            }}
                            disabled={isSaving}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {newMediaPreviews.map((preview, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative w-10 h-10 shrink-0"
                        >
                          {preview.type === "image" ? (
                            <img
                              decoding="async"
                              loading="lazy"
                              src={preview.url}
                              alt={`new-preview-${i}`}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <video
                              src={preview.url}
                              className="w-full h-full object-cover rounded"
                              muted
                            />
                          )}
                          <button
                            type="button"
                            className="absolute top-0 right-0 text-red-600 p-[3px] text-[10px] bg-white rounded-full"
                            onClick={() => {
                              const updatedPreviews = [...newMediaPreviews];
                              const removedPreview = updatedPreviews.splice(
                                i,
                                1
                              )[0];
                              setNewMediaPreviews(updatedPreviews);

                              if (removedPreview.type === "image") {
                                setNewImages((prev) =>
                                  prev.filter((f) => f !== removedPreview.file)
                                );
                              } else {
                                setNewVideos((prev) =>
                                  prev.filter((f) => f !== removedPreview.file)
                                );
                              }
                            }}
                            disabled={isSaving}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {(editedData.serviceImage || []).length +
                        newMediaPreviews.length <
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
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleMediaUpload}
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
                    <Link
                      to={`/service/${service.serviceCategory}/${service._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h2 className="details-h2 mt-6">{service.serviceName}</h2>
                    </Link>
                    <div className="flex gap-2 flex-wrap">
                      <strong>Service Type: </strong>

                      <span className="text-sm">
                        {expandedServiceType[index]
                          ? serviceTypeText
                          : serviceTypeText.length > 22
                          ? serviceTypeText.substring(0, 22) + "..."
                          : serviceTypeText}
                      </span>

                      {serviceTypeText.length > 22 && (
                        <span
                          onClick={() => toggleExpandServiceType(index)}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          {expandedServiceType[index]
                            ? "Read Less"
                            : "Read More"}
                        </span>
                      )}
                    </div>

                    <div className="l">
                      <strong>Locations: </strong>
                      {Array.isArray(service.locationOffered) ? (
                        <>
                          <Link
                            to={`/service/${service.serviceCategory}/${service._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {expandedLocations[index]
                              ? service.locationOffered.join(", ")
                              : service.locationOffered.slice(0, 3).join(", ") +
                                (service.locationOffered.length > 3
                                  ? "..."
                                  : "")}
                          </Link>
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
                    <Link
                      to={`/service/${service.serviceCategory}/${service._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {/* PRICE SECTION */}
                      <div className="pr">
                        <strong>Price: </strong>

                        {/* Catering Service Price */}
                        {isCatering ? (
                          <div className="flex flex-col text-sm">
                            {/* Base per plate */}
                            <span className="font-semibold text-gray-800">
                              ₹ {service.perPlatePrice} / plate
                              <span className="text-gray-600 ml-1">
                                ({service.minPlates} - {service.maxPlates}{" "}
                                plates)
                              </span>
                            </span>

                            {/* Packages (if any) */}
                            {service.packages?.length > 0 && (
                              <div className="mt-1">
                                <strong>Packages:</strong>
                                <ul className="list-disc ml-5 text-gray-700">
                                  {service.packages.map((pkg, idx) => (
                                    <li key={idx}>
                                      {pkg.packageName}: ₹{pkg.perPlatePrice} /
                                      plate ({pkg.minPlates}-{pkg.maxPlates}{" "}
                                      plates)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Regular Services Price */
                          <span>
                            ₹ {service.minPrice} - ₹ {service.maxPrice}
                          </span>
                        )}
                      </div>

                      <div className="c">
                        <strong>Category: </strong> {service.serviceCategory}
                      </div>
                      <div className="d">
                        <strong>Duration: </strong>{" "}
                        {formatDuration(service.duration)}
                      </div>
                    </Link>
                    {/* Description with Read More */}
                    <div>
                      <div className="des font-semibold text-gray-800">
                        Description:
                      </div>
                      <div className="text-gray-700">
                        <Link
                          to={`/service/${service.serviceCategory}/${service._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {expanded
                            ? service.serviceDes
                            : service.serviceDes.slice(0, 80) +
                              (service.serviceDes.length > 80 ? "..." : "")}
                        </Link>
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
                    <Link
                      to={`/service/${service.serviceCategory}/${service._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="u flex justify-between">
                        <strong>User Reviews: </strong> {service.userReviews}
                      </div>
                    </Link>
                  </div>
                </div>
              )}
              {cropSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-lg font-semibold mb-3">Crop Image</h2>
                    <ReactCrop
                      crop={crop}
                      onChange={setCrop}
                      ruleOfThirds={true}
                    >
                      <img
                        decoding="async"
                        loading="lazy"
                        ref={imgRef}
                        src={cropSrc}
                        alt="Crop preview"
                        onLoad={(e) => (imgRef.current = e.currentTarget)}
                      />
                    </ReactCrop>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        onClick={() => setCropSrc(null)}
                        className="px-4 py-2 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCropSave}
                        className="relative px-6 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      >
                        Crop & Save
                      </button>
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
