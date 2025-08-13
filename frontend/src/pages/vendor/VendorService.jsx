import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorService.css";
import StepProgress from "./StepProgress";
import Button from "../../components/vendor/register/VendorButton";
import axios from "axios";
import Spinner from "./../../components/common/Spinner";

function VendorService({ currentStep }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // All state variables
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [days, setDays] = useState("0");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [showStateLocationDropdown, setShowStateLocationDropdown] =
    useState(false);
  const [stateLocationSearchTerm, setStateLocationSearchTerm] = useState("");
  const fileInputRef = useRef(null);

  const categories = [
    "DJ Services and Brass Band",
    "Orchesta And Music Concert",
    "Food & Catering",
    "Floral Decor",
    "Venue Styling & Decor",
    "Photographer and Videographer",
    "Hindu Pandit",
    "Magic Shows",
    "Classical Music and Dance",
    "Islamic Maulbi",
    "Christian Priest",
    "Beauty Makeover",
    "Ceremonial Rides",
    "Fireworks",
    "Card Design & Printing",
  ];

  const allLocations = {
    Odisha: [
      "Angul",
      "Balangir",
      "Balasore",
      "Bargarh",
      "Bhadrak",
      "Boudh",
      "Cuttack",
      "Deogarh",
      "Dhenkanal",
      "Gajapati",
      "Ganjam",
      "Jagatsinghpur",
      "Jajpur",
      "Jharsuguda",
      "Kalahandi",
      "Kandhamal",
      "Kendrapara",
      "Kendujhar",
      "Khordha",
      "Koraput",
      "Malkangiri",
      "Mayurbhanj",
      "Nabarangpur",
      "Nayagarh",
      "Nuapada",
      "Puri",
      "Rayagada",
      "Sambalpur",
      "Sonepur",
      "Sundargarh",
    ],
    Karnataka: [
      "Bengaluru Urban",
      "Bengaluru Rural",
      "Mysuru",
      "Mangaluru",
      "Hubballi",
      "Belagavi",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
      "Aurangabad",
      "Kolhapur",
    ],
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Locations based on selected state
  const filteredLocations = selectedState
    ? allLocations[selectedState].filter((loc) =>
        loc.toLowerCase().includes(locationSearchTerm.toLowerCase())
      )
    : [];

  const filteredStates = Object.keys(allLocations).filter((state) =>
    state.toLowerCase().includes((stateLocationSearchTerm || "").toLowerCase())
  );

  // Enhanced image upload with validation
  const handleImageUpload = (e) => {
    try {
      const newFiles = Array.from(e.target.files);
      const valid = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
      ];
      const max = 50 * 1024 * 1024;

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
    setIsLoading(true);
    console.log("next button clicked");

    if (!validateForm()) {
      setIsLoading(false);
      console.log("form is not validated wrong");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("serviceName", serviceName);
      formData.append("serviceDes", serviceDescription);

      formData.append("minPrice", minPrice);
      formData.append("maxPrice", maxPrice);
      formData.append("serviceCategory", categorySearchTerm);
      formData.append("stateLocationOffered", selectedState);
      selectedLocations.forEach((loc) => {
        formData.append("locationOffered[]", loc);
      });

      // selectedLocations.forEach((loc) => {
      //   formData.append("locationOffered[]", loc);
      // });

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("days", days);
      formData.append("hrs", hours);
      formData.append("mins", minutes);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/create-service`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response);

      navigate("/vendor/payment-info");
    } catch (error) {
      console.error("Error submitting service:", error);
      alert("Failed to submit service. Please try again.");
    }
    setIsLoading(false);
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
    if (!minPrice || !maxPrice) {
      alert("Please enter both minimum and maximum prices");
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

    if (selectedState.length === 0) {
      alert("Please select at least one state location");
      return false;
    }

    // 8. Check location
    if (selectedLocations.length === 0) {
      alert("Please select at least one location");
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

  const locationDropdownRef = useRef(null);
  const stateLocationDropdownRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        stateLocationDropdownRef.current &&
        !stateLocationDropdownRef.current.contains(event.target)
      ) {
        setShowStateLocationDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <StepProgress currentStep={1} />
      {isLoading && <Spinner />}
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
              <label htmlFor="service-images">
                Upload Service Images/Videos *
              </label>
              <input
                type="file"
                id="service-images"
                accept="image/,video/"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                required
              />
              {previewImages.length > 0 && (
                <div className="preview-container">
                  <div className="main-preview">
                    {selectedFiles[selectedImageIndex]?.type?.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={previewImages[selectedImageIndex]}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    ) : (
                      <img
                        src={previewImages[selectedImageIndex]}
                        alt="Selected Preview"
                      />
                    )}
                  </div>
                  <div className="thumbnail-preview">
                    {previewImages.map((media, idx) => (
                      <div key={idx} className="thumbnail-wrapper">
                        {selectedFiles[idx]?.type?.startsWith("video/") ? (
                          <video
                            src={media}
                            className={
                              selectedImageIndex === idx ? "active" : ""
                            }
                            onClick={() => setSelectedImageIndex(idx)}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            muted
                          />
                        ) : (
                          <img
                            src={media}
                            alt={`Thumb-${idx}`}
                            className={
                              selectedImageIndex === idx ? "active" : ""
                            }
                            onClick={() => setSelectedImageIndex(idx)}
                          />
                        )}
                        <span
                          className="image-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(idx);
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

              <div className="flex items-center gap-2 mt-2">
                {/* Min Price */}
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  min="1"
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 rounded-md px-3 py-2 bg-[#f7f3ff] text-[#4b2bb3] border-2 border-[#c5b9f5] focus:outline-none focus:border-[2px] focus:border-[#4b2bb3] cursor-text caret-black"
                />
                <span className="text-gray-600 font-semibold">-</span>
                {/* Max Price */}
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  min="1"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 rounded-md px-3 py-2 bg-[#f7f3ff] text-[#4b2bb3] border-2 border-[#c5b9f5] focus:outline-none focus:border-[2px] focus:border-[#4b2bb3] cursor-text caret-black"
                />
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

            {/* Selected State */}
            <label htmlFor="state-location" className="state-location-label">
              State Locations Offered *
            </label>

            <div
              className="state-location-dropdown-wrapper"
              ref={stateLocationDropdownRef}
            >
              <div
                className="state-dropdown-input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "6px",
                  cursor: "text",
                }}
                onClick={() =>
                  document.getElementById("state-location-input").focus()
                }
              >
                <span className="icon-left">🔍</span>

                {/* Search input */}
                <input
                  id="state-location-input"
                  type="text"
                  placeholder="Search state location"
                  value={stateLocationSearchTerm}
                  onChange={(e) => setStateLocationSearchTerm(e.target.value)}
                  onFocus={() => setShowStateLocationDropdown(true)}
                  style={{
                    flex: "1",
                    minWidth: "120px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />

                {stateLocationSearchTerm && (
                  <img
                    src="/public/close.png"
                    alt="Clear"
                    className="cross-icon"
                    onClick={() => setStateLocationSearchTerm("")}
                  />
                )}
              </div>
              {/* Selected State */}
              {selectedState && (
                <span className="selected-chip">
                  {selectedState}
                  <button type="button" className="ml-2 mr-2" onClick={() => setSelectedState("")}>
                    ✕
                  </button>
                </span>
              )}
              {/* Dropdown */}
              {showStateLocationDropdown && (
                <ul className="state-location-dropdown-list">
                  {filteredStates.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedState(state);
                        setStateLocationSearchTerm(""); // reset search field
                        setShowStateLocationDropdown(false);
                        setSelectedLocations([]);
                      }}
                    >
                      {state}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label htmlFor="locations" className="location-label">
              Locations Offered *
            </label>
            <div
              className="location-dropdown-wrapper"
              ref={locationDropdownRef}
            >
              <div
                className="dropdown-input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "6px",
                  cursor: "text",
                }}
                onClick={() =>
                  document.getElementById("location-input").focus()
                }
              >
                <span className="icon-left">🔍</span>

                {/* Selected Locations (inside input area) */}
                {selectedLocations.map((loc, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f7f3ff",
                      color: "#4b2bb3",
                      border: "1px solid #4b2bb3",
                      borderRadius: "6px",
                      padding: "2px 6px",
                      fontSize: "14px",
                    }}
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedLocations(
                          selectedLocations.filter((l) => l !== loc)
                        )
                      }
                      style={{
                        marginLeft: "4px",
                        color: "#4b2bb3",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        fontSize: "14px",
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {/* Input field */}
                <input
                  id="location-input"
                  type="text"
                  placeholder="Search district/cities location"
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  style={{
                    flex: "1",
                    minWidth: "120px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
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
                        if (!selectedLocations.includes(loc)) {
                          setSelectedLocations([...selectedLocations, loc]);
                        }
                        setLocationSearchTerm("");
                        setShowLocationDropdown(false); // ✅ Close dropdown on selection
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
