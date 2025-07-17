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
  const [newImages, setNewImages] = useState([]); // NEW: Hold images to upload
  const [newImagePreviews, setNewImagePreviews] = useState([]);

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
    setNewImages([]); // reset new images on each edit
  };

 const handleSave = async (index) => {
   try {
     const serviceId = services[index]._id;
     const existingImages = editedData.serviceImage || [];

     // ✅ Validate image count (old + new)
     const totalImages = existingImages.length + newImages.length;
     if (totalImages > 5) {
       alert(
         `You can upload a maximum of 5 images.\nYou already have ${
           existingImages.length
         } images.\nPlease remove ${totalImages - 5} image(s) before saving.`
       );
       return;
     }

     let uploadedUrls = [];

     // ✅ Only upload if new images exist
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

       // ✅ Handle response as array of URLs
       if (Array.isArray(res.data?.data)) {
         uploadedUrls = res.data.data;
       } else if (typeof res.data?.data === "string") {
         uploadedUrls.push(res.data.data); // fallback for single upload
       }
     }

     // ✅ Combine old and new image URLs
     const allImages = [...existingImages, ...uploadedUrls];

     // ✅ Construct payload for update
     const payload = {
       serviceName: editedData.serviceName,
       serviceDes: editedData.serviceDes,
       serviceCategory: editedData.serviceCategory,
       priceRange: editedData.priceRange,
       locationOffered: editedData.locationOffered,
       duration: editedData.duration,
       serviceImage: allImages,
     };

     const updateRes = await axios.put(
       `${BACKEND_URL}/vendors/update-service/${serviceId}`,
       payload,
       { withCredentials: true }
     );

     // ✅ Update frontend state
     const updatedService = updateRes.data.data;
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
      await axios.delete(`${BACKEND_URL}/vendors/delete-service/${serviceId}`, {
        withCredentials: true,
      });

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalSelected =
      editedData.serviceImage.length + newImages.length + files.length;
    if (totalSelected > 5) {
      alert(
        `You can only upload up to 5 images in total. Remove ${
          totalSelected - 5
        } image(s).`
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
    <div>
      {services.length > 0 ? (
        services.map((service, index) => {
          const isEditing = editingIndex === index;
          const selectedImage =
            selectedImages[index] || service.serviceImage?.[0];

          return (
            <section key={index} className="service-box xl:ml-20 mb-10">
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

                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="flex flex-wrap gap-3 mt-2">
                        {/* Existing Images */}
                        {editedData.serviceImage?.map((img, i) => (
                          <div
                            key={`existing-${i}`}
                            className="relative w-20 h-20"
                          >
                            <img
                              src={img}
                              alt={`thumb-${i}`}
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 !text-red-600 !p-[5px] !text-xs !w-fit !bg-white !rounded-full"
                              onClick={() => {
                                const updatedImgs = [
                                  ...editedData.serviceImage,
                                ];
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

                        {/* New Image Previews */}
                        {newImagePreviews.map((url, i) => (
                          <div key={`new-${i}`} className="relative w-20 h-20">
                            <img
                              src={url}
                              alt={`new-preview-${i}`}
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 !text-red-600 !p-[5px] !text-xs !w-fit !bg-white !rounded-full"
                              onClick={() => {
                                // Remove both preview + actual file
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
                      </div>

                      <label className="w-20 h-20 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer">
                        <FaPlus className="text-gray-500" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    <button type="button" onClick={() => handleSave(index)}>
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="details">
                    <h2 className="details-h2">{service.serviceName}</h2>
                    <div className="l">{service.locationOffered}</div>
                    <div className="pr">
                      <strong>Price Range: </strong>₹ {service.priceRange}
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

              <div className="flex relative xl:top-[-175px] items-center gap-3 mt-4">
                <label
                  className={`relative w-[60px] h-[30px] rounded-full cursor-pointer transition-colors duration-300 ${
                    service.available
                      ? "bg-green-500"
                      : "border-2 border-gray-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={service.available}
                    onChange={() => handleToggleAvailability(index)}
                    className="sr-only"
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-300 ${
                      service.available ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    ON
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-gray-700 text-xs font-semibold transition-opacity duration-300 ${
                      service.available ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    OFF
                  </span>
                  <span
                    className={`absolute top-[3px] left-[3px] w-[24px] h-[24px] bg-white rounded-full transition-transform duration-300 ${
                      service.available ? "translate-x-[30px]" : "translate-x-0"
                    }`}
                  />
                </label>
                <span className="text-sm font-medium">
                  {service.available
                    ? "Service Available"
                    : "Service Not Available"}
                </span>
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
