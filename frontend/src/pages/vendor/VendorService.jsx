import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorService.css";
import StepProgress from "./StepProgress";
import Button from "../../components/vendor/register/VendorButton";
import axios from "axios";

function VendorService({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { label: "Registration", subLabel: "Step 1", icon: "/verify.png" },
    { label: "Service Details", subLabel: "Step 2", icon: "/service.png" },
    { label: "Payment", subLabel: "Step 3", icon: "/payment.png" },
    { label: "Legal Consents", subLabel: "Step 4", icon: "/legal.png" },
  ];

  // All state variables
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeField, setActiveField] = useState("min");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);

  const categories = [
    "DJ",
    "Orchestra",
    "Food Catering",
    "Florist",
    "Tent House",
  ];
  const allLocations = [
    "Bhubaneswar",
    "Balasore",
    "Kendrapara",
    "Dhenkanal",
    "Cuttack",
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const filteredLocations = allLocations.filter((loc) =>
    loc.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  // Enhanced image upload with validation
  const handleImageUpload = (e) => {
    try {
      const newFiles = Array.from(e.target.files);
      const valid = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const max = 5 * 1024 * 1024;

      for (let f of newFiles) {
        if (!valid.includes(f.type)) return alert("JPEG/PNG/GIF only");
        if (f.size > max) return alert("Image < 5 MB, please");
      }

      const newUrls = newFiles.map((f) => URL.createObjectURL(f));

      setPreviewImages((prev) => [...prev, ...newUrls]);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setSelectedImageIndex((prev) => (prev === -1 ? 0 : prev));
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...previewImages];
    const updatedFiles = [...selectedFiles];

    updatedImages.splice(index, 1);
    updatedFiles.splice(index, 1);

    setPreviewImages(updatedImages);
    setSelectedFiles(updatedFiles);

    if (selectedImageIndex === index) {
      setSelectedImageIndex(updatedImages.length > 0 ? 0 : -1);
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1);
    }

    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    navigate("/vendor/register");
  };

  const handleNext = async () => {
    console.log("next button clicked");

    if (!validateForm()) {
      console.log("form is not validated wrong");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("serviceName", serviceName);
      formData.append("serviceDes", serviceDescription);

      if (selectedDropdownValue) {
        formData.append("priceRange", selectedDropdownValue);
      } else {
        formData.append("minPrice", minPrice);
        formData.append("maxPrice", maxPrice);
      }

      formData.append("serviceCategory", categorySearchTerm);
      formData.append("locationOffered", locationSearchTerm);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("days", days);
      formData.append("hrs", hours);
      formData.append("mins", minutes);

      const response = await axios.post(
        "http://localhost:8000/vendors/create-service",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      navigate("/vendor/payment-info");
    } catch (error) {
      console.error("Error submitting service:", error);
      alert("Failed to submit service. Please try again.");
    }
  };

  // Comprehensive validation function
  const validateForm = () => {
    // 1. Check service category
    if (!categorySearchTerm.trim()) {
      alert("Please select a service category");
      return false;
    }

    // 2. Check if at least one image is uploaded
    if (previewImages.length === 0) {
      alert("Please upload at least one service image");
      return false;
    }

    // 3. Check price range - either dropdown OR min/max prices
    if (!selectedDropdownValue && (!minPrice || !maxPrice)) {
      alert(
        "Please set price range either from dropdown or enter min/max prices"
      );
      return false;
    }

    // 4. If min/max prices are entered, validate them
    if (minPrice && maxPrice) {
      if (parseInt(minPrice) <= 0 || parseInt(maxPrice) <= 0) {
        alert("Price values must be greater than 0");
        return false;
      }
      if (parseInt(minPrice) >= parseInt(maxPrice)) {
        alert("Minimum price should be less than maximum price");
        return false;
      }
    }

    // 5. Check service name
    if (!serviceName.trim()) {
      alert("Please enter a service name");
      return false;
    }

    if (serviceName.trim().length < 3) {
      alert("Service name should be at least 3 characters long");
      return false;
    }

    // 6. Check duration - at least one field should have value
    if (!days && !hours && !minutes) {
      alert("Please set estimated duration (days, hours, or minutes)");
      return false;
    }

    // 7. Validate duration values
    if (hours && (parseInt(hours) < 0 || parseInt(hours) > 23)) {
      alert("Hours should be between 0 and 23");
      return false;
    }

    if (minutes && (parseInt(minutes) < 0 || parseInt(minutes) > 59)) {
      alert("Minutes should be between 0 and 59");
      return false;
    }

    if (days && parseInt(days) < 0) {
      alert("Days cannot be negative");
      return false;
    }

    // 8. Check location
    if (!locationSearchTerm.trim()) {
      alert("Please select a location");
      return false;
    }

    // 9. Check service description
    if (!serviceDescription.trim()) {
      alert("Please enter a service description");
      return false;
    }

    if (serviceDescription.trim().length < 10) {
      alert("Service description should be at least 10 characters long");
      return false;
    }

    // All validations passed
    return true;
  };

  return (
    <>
      <StepProgress currentStep={1} />

      <div className="form-container">
        <div className="form-wrapper">
          {/* Left Side: Form Column */}
          <div className="form-column">
            {/* Service Category */}
            <div className="ServiceCategory">
              <label htmlFor="category-search">Service Category *</label>
              <div className="category-wrapper">
                <div className="category-input">
                  <input
                    type="text"
                    id="category-search"
                    placeholder="Search category"
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    onFocus={() => setShowCategoryDropdown(true)}
                    required
                  />
                  {categorySearchTerm && (
                    <img
                      src="/public/close.png"
                      alt="Clear"
                      className="clear-icon-img"
                      onClick={() => setCategorySearchTerm("")}
                    />
                  )}
                </div>
                {showCategoryDropdown && (
                  <ul className="dropdown-list">
                    {filteredCategories.map((category, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setCategorySearchTerm(category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Service Image Upload */}
            <div className="ServiceImageUploadPreview">
              <label htmlFor="service-images">Upload Service Images *</label>
              <input
                type="file"
                id="service-images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                required
              />
              {previewImages.length > 0 && (
                <div className="preview-container">
                  <div className="main-preview">
                    <img
                      src={previewImages[selectedImageIndex]}
                      alt="Selected Preview"
                    />
                  </div>
                  <div className="thumbnail-preview">
                    {previewImages.map((img, idx) => (
                      <div key={idx} className="thumbnail-wrapper">
                        <img
                          src={img}
                          alt={`Thumb-${idx}`}
                          className={selectedImageIndex === idx ? "active" : ""}
                          onClick={() => setSelectedImageIndex(idx)}
                        />
                        <span
                          className="image-close"
                          onClick={(e) => {
                            e.stopPropagation(); // So thumbnail image click doesn't trigger
                            handleDeleteImage(idx);
                            const updatedPreviews = [...previewImages];
                            const updatedFiles = [...selectedFiles];

                            updatedPreviews.splice(idx, 1);
                            updatedFiles.splice(idx, 1);

                            let newSelectedIndex = selectedImageIndex;

                            if (selectedImageIndex === idx) {
                              newSelectedIndex =
                                updatedPreviews.length > 0 ? 0 : -1;
                            } else if (selectedImageIndex > idx) {
                              newSelectedIndex = selectedImageIndex - 1;
                            }

                            setPreviewImages(updatedPreviews);
                            setSelectedFiles(updatedFiles);
                            setSelectedImageIndex(newSelectedIndex);
                          }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="price-range-container">
              <label className="section-label">Price Range *</label>
              <select
                className="value-dropdown"
                value={selectedDropdownValue}
                onChange={(e) => {
                  setSelectedDropdownValue(e.target.value);
                  // Clear manual price inputs when dropdown is selected
                  if (e.target.value) {
                    setMinPrice("");
                    setMaxPrice("");
                  }
                }}
              >
                <option value="">Select Range</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-5000">₹2000 - ₹5000</option>
                <option value="5000+">₹5000+</option>
              </select>

              <div
                style={{ margin: "10px 0", textAlign: "center", color: "#666" }}
              >
                OR
              </div>

              <div className="price-input-toggle">
                <button
                  type="button"
                  className={activeField === "min" ? "active" : ""}
                  onClick={() => {
                    setActiveField("min");
                    // Clear dropdown when manual input is used
                    setSelectedDropdownValue("");
                  }}
                >
                  Min
                </button>
                <button
                  type="button"
                  className={activeField === "max" ? "active" : ""}
                  onClick={() => {
                    setActiveField("max");
                    // Clear dropdown when manual input is used
                    setSelectedDropdownValue("");
                  }}
                >
                  Max
                </button>
              </div>
              <div className="price-input-fields">
                {activeField === "min" ? (
                  <input
                    type="number"
                    placeholder="Enter Min Price"
                    value={minPrice}
                    min="1"
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setSelectedDropdownValue("");
                    }}
                  />
                ) : (
                  <input
                    type="number"
                    placeholder="Enter Max Price"
                    value={maxPrice}
                    min="1"
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setSelectedDropdownValue("");
                    }}
                  />
                )}
              </div>
            </div>

            {/* Service Name Field */}
            <label htmlFor="serviceName" className="ServiceName">
              Service Name *
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              placeholder="Enter service name"
              className="input-field"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              minLength="3"
            />
          </div>

          {/* Vertical Line */}
          <div className="form-divider"></div>

          {/* Right Side */}
          <div className="form-right">
            <h3 style={{ color: "#4b2bb3", fontWeight: "600" }}>
              Estimated Duration *
            </h3>
            <div className="duration-inputs">
              <input
                type="number"
                min="0"
                placeholder="DAYS"
                className="duration-field"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="23"
                placeholder="HRS"
                className="duration-field"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="MINS"
                className="duration-field"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>

            <label htmlFor="locations" className="location-label">
              Locations Offered *
            </label>
            <div className="location-dropdown-wrapper">
              <div className="dropdown-input">
                <span className="icon-left">🔍</span>
                <input
                  type="text"
                  placeholder="Search location"
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  required
                />
                {locationSearchTerm && (
                  <img
                    src="/public/close.png"
                    alt="Clear"
                    className="cross-icon"
                    onClick={() => setLocationSearchTerm("")}
                  />
                )}
              </div>

              {showLocationDropdown && (
                <ul className="location-dropdown-list">
                  {filteredLocations.map((loc, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setLocationSearchTerm(loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label htmlFor="serviceDescription" className="description-label">
              Service Description *
            </label>
            <textarea
              id="serviceDescription"
              name="serviceDescription"
              placeholder="Write a short description about the service..."
              className="description-textarea"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              required
              minLength="10"
              rows="4"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "750px" }}>
            <Button onBack={handleBack} onNext={handleNext} />
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorService;
