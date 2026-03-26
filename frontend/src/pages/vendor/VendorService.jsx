import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorService.css";
import StepProgress from "./StepProgress";
import Button from "../../components/vendor/register/VendorButton";
import axios from "axios";
import Spinner from "./../../components/common/Spinner";
import ReactCrop, { centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";

const getCroppedImg = (image, crop) => {
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
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
};
const generateUniqueId = () => `pkg_${Math.random().toString(36).substr(2, 9)}`;

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

  // State variables for the image cropper
  const [cropQueue, setCropQueue] = useState([]);
  const [imageToCrop, setImageToCrop] = useState(undefined);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState("");
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const subCategoryDropdownRef = useRef(null);

  // ✅ FIXED: Added missing state variables
  const [imageError, setImageError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ FIXED: Category-aware pricing state
  const [isCatering, setIsCatering] = useState(false);
  const [perPlateData, setPerPlateData] = useState({
    price: "",
    minPlates: "",
    maxPlates: "",
  });
  const [packages, setPackages] = useState([
    {
      id: generateUniqueId(),
      packageName: "",
      perPlatePrice: "",
      minPlates: "",
      maxPlates: "",
      description: "",
    },
  ]);

  useEffect(() => {
    setIsCatering(categorySearchTerm === "Food & Catering");
  }, [categorySearchTerm]);

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        id: generateUniqueId(),
        packageName: "",
        perPlatePrice: "",
        minPlates: "",
        maxPlates: "",
        description: "",
      },
    ]);
  };

  const handleRemovePackage = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handlePackageChange = (id, field, value) => {
    setPackages(
      packages.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
    );
  };

  const categories = [
    "DJ Services & Brash Band",
    "Music Concert & Orchestra",
    "Decor & Tenthouse",
    "Photo & Videography",
    "Food & Catering",
    "Banquet Hall & Mandap",
    "Classical Music & Dance",
    "Islamic Maulbi",
    "Christian Priest",
    "Hindu Pandit",
    "Beauty Makeover",
    "Balloon Decor",
    "Floral Decor",
    "Ceremonial Ride",
    "Luxury Ride",
    "Fireworks",
    "Card Design & Printing",
    "Magic Shows",
    "Event Management Company",
    "Hotel & Resorts",
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
  // ✅ Define subcategories for each main category
  const subcategories = {
    "DJ Services & Brash Band": [
      "Wedding DJ",
      "Corporate Event DJ",
      "Private Party DJ",
    ],
    "Music Concert & Orchestra": [
      "Live Band Performance",
      "Qawwali Night",
      "Celebrity Concert",
    ],
    "Decor & Tenthouse": [
      "Wedding Decor & Tent",
      "Birthday Party Decor",
      "Reception Decor",
      "Engagement Decor ",
    ],
    "Photo & Videography": [
      "Wedding Photography & Videography",
      "Pre-Wedding Shoot",
      "Birthday",
      "Event Coverage",
    ],
    "Food & Catering": [
      "Wedding Catering",
      "Birthday Party Catering",
      "Corporate Catering",
    ],
    "Banquet Hall & Mandap": [
      "Wedding Banquet Hall",
      "Ring Ceremony ",
      "Birthday",
      "Anniversary",
    ],
    "Classical Music & Dance": [
      "Classical Vocal Performance",
      "Instrumental Performance",
      "Bharatanatyam Dance",
    ],
    "Islamic Maulbi": [
      "Religious Sermon",
      "Tilawat",
      "Marriage Ceremonies",
      "Funeral Services",
      "Special Event",
    ],
    "Christian Priest": [
      "All",
      "Christening",
      "Wedding Ceremony",
      "Funeral Service",
      "Blessings Prayers",
      "Church Program",
    ],
    "Hindu Pandit": [
      "Wedding Ceremony",
      "Puja Ceremony",
      "Housewarming",
      "Naming Ceremony",
      "Shraddh Ceremony",
      "Special Event",
    ],
    "Beauty Makeover": ["Bridal Makeup", "Unisex", "Mehendi Artist"],
    "Floral Decor": [
      "Wedding Decor",
      "Stage & Backdrop Floral Decor",
      "Birthday Party Decor",
    ],
    "Ceremonial Ride": ["Bridal Ride", "Luxury Ride", "Classic Ride"],
    "Luxury Ride": ["Bridal Ride", "Luxury Ride", "Classic Ride"],
    Fireworks: ["Wedding Fireworks", "Indoor Fireworks", "Outdoor Fireworks"],
    "Card Design & Printing": [
      "Wedding Invitations",
      "Birthday Party Invitations",
      "Corporate Cards",
    ],
    "Magic Shows": [
      "Children’s Magic Shows",
      "Stage Magic Shows",
      "Close-Up Magic",
    ],
    "Event Management Company": [
      "Wedding Full-Service Planner",
      "Corporate Event Management",
      "Birthday Party Planner",
    ],
    "Balloon Decor": [
      "Birthday Balloon Decoration",
      "Theme-Based Balloon Decoration",
      "Baby Shower Balloon Decoration",
    ],
    "Hotel & Resorts": [
      "Luxury Hotels",
      "Wedding Hotels & Resorts",
      "Resorts",
      "Beach Resorts",
    ],
  };

  const availableSubcategories = subcategories[categorySearchTerm] || [];
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
  useEffect(() => {
    if (cropQueue.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result?.toString() || "");
        setShowCropperModal(true);
      });
      reader.readAsDataURL(cropQueue[0]);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [cropQueue]);

  const handleImageUpload = (e) => {
    try {
      if (showCropperModal) return;

      // Clear any previous error messages
      setImageError("");

      const newFiles = Array.from(e.target.files);
      const totalFiles = selectedFiles.length + newFiles.length;

      // ✅ Limit total uploads to 10
      if (totalFiles > 10 || newFiles.length > 10) {
        toast.error("You cannot upload more than 10 files.");
        setImageError("You cannot upload more than 10 files.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      // File type validation
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      const validVideoTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
      ];
      const validTypes = [...validImageTypes, ...validVideoTypes];

      // Size limits
      const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
      const VIDEO_SIZE_LIMIT = 200 * 1024 * 1024; // 200MB

      const validatedFiles = [];
      const errors = [];

      for (let f of newFiles) {
        // Check file type
        if (!validTypes.includes(f.type)) {
          errors.push(
            `"${f.name}" - Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, AVI, MOV, WMV, FLV, WEBM) are allowed.`
          );
          continue;
        }

        // Check file size based on type
        const isImage = validImageTypes.includes(f.type);
        const isVideo = validVideoTypes.includes(f.type);

        if (isImage && f.size > IMAGE_SIZE_LIMIT) {
          const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
          errors.push(
            `"${f.name}" (${sizeMB}MB) - Image files must be 5MB or smaller.`
          );
          continue;
        }

        if (isVideo && f.size > VIDEO_SIZE_LIMIT) {
          const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
          errors.push(
            `"${f.name}" (${sizeMB}MB) - Video files must be 200MB or smaller.`
          );
          continue;
        }

        validatedFiles.push(f);
      }

      // Display all errors at once
      if (errors.length > 0) {
        setImageError(errors.join(" • "));
      }

      // If no valid files, clear input and return
      if (validatedFiles.length === 0) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const imageFiles = validatedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      const videoFiles = validatedFiles.filter((file) =>
        file.type.startsWith("video/")
      );

      if (videoFiles.length > 0) {
        const videoUrls = videoFiles.map((f) => URL.createObjectURL(f));
        setPreviewImages((prev) => [...prev, ...videoUrls]);
        setSelectedFiles((prev) => [...prev, ...videoFiles]);
        if (selectedImageIndex === -1) setSelectedImageIndex(0);
      }

      if (imageFiles.length > 0) {
        setCropQueue((prev) => [...prev, ...imageFiles]);
      } else {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Image selection error:", err);
      setImageError(
        "An error occurred while processing your files. Please try again."
      );
    }
  };

  const handleCropImage = async () => {
    if (!completedCrop || !imgRef.current || completedCrop.width === 0) {
      alert("Please select an area to crop.");
      return;
    }

    const originalFile = cropQueue[0];
    const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
    const croppedFile = new File([croppedImageBlob], originalFile.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    const newUrl = URL.createObjectURL(croppedFile);

    setPreviewImages((prev) => [...prev, newUrl]);
    setSelectedFiles((prev) => [...prev, croppedFile]);
    if (selectedImageIndex === -1) setSelectedImageIndex(0);

    setImageToCrop(undefined);
    setShowCropperModal(false);
    setCompletedCrop(null);
    setCrop(undefined);
    setCropQueue((prev) => prev.slice(1));
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
    setErrorMessage("");
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
      formData.append("serviceCategory", categorySearchTerm);
      formData.append("stateLocationOffered", selectedState);
      selectedSubcategories.forEach((sub) => {
        formData.append("subCategory", sub);
      });

      selectedLocations.forEach((loc) => {
        formData.append("locationOffered[]", loc);
      });

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("days", days);
      formData.append("hrs", hours);
      formData.append("mins", minutes);

      // ✅ FIXED: Send both base price AND packages
      if (isCatering) {
        formData.append("pricingType", "perPlate");

        if (perPlateData.price) {
          formData.append("perPlatePrice", perPlateData.price);
          formData.append("minPlates", perPlateData.minPlates);
          formData.append("maxPlates", perPlateData.maxPlates);
        }

        const validPackages = packages.filter(
          (p) => p.packageName && p.perPlatePrice
        );
        if (validPackages.length > 0) {
          const packagesToSend = validPackages.map(({ id, ...rest }) => rest);
          formData.append("packages", JSON.stringify(packagesToSend));
        }
      } else {
        formData.append("pricingType", "flat");
        formData.append("minPrice", minPrice);
        formData.append("maxPrice", maxPrice);
      }

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

      // Get backend message if available
      const backendMsg =
        error.response?.data?.message || // common backend format
        error.response?.data?.error || // another common field
        "Failed to submit service. Please try again.";

      setErrorMessage(backendMsg);
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
    if (selectedSubcategories.length === 0) {
      alert("Please select at least one service type");
      return false;
    }

    // 2. Check if at least one image is uploaded
    if (previewImages.length === 0) {
      alert("Please upload at least one service image");
      return false;
    }

    if (isCatering) {
      const hasBasePrice =
        perPlateData.price && perPlateData.minPlates && perPlateData.maxPlates;
      const hasPartialBasePrice =
        perPlateData.price || perPlateData.minPlates || perPlateData.maxPlates;
      const validPackages = packages.filter(
        (p) => p.packageName && p.perPlatePrice && p.minPlates && p.maxPlates
      );
      const hasPackages = validPackages.length > 0;

      if (!hasBasePrice && !hasPackages) {
        alert(
          "For catering, you must provide at least a complete base per-plate price or one complete package."
        );
        return false;
      }

      if (hasPartialBasePrice && !hasBasePrice) {
        alert(
          "Please fill all fields for the base per-plate price, or clear them if not used."
        );
        return false;
      }

      if (hasBasePrice) {
        if (+perPlateData.price <= 0) {
          alert("Base price per plate must be positive.");
          return false;
        }
        if (+perPlateData.minPlates >= +perPlateData.maxPlates) {
          alert(
            "For the base price, minimum plates must be less than maximum plates."
          );
          return false;
        }
      }

      for (const pkg of packages) {
        if (
          pkg.packageName ||
          pkg.perPlatePrice ||
          pkg.minPlates ||
          pkg.maxPlates
        ) {
          if (
            !pkg.packageName ||
            !pkg.perPlatePrice ||
            !pkg.minPlates ||
            !pkg.maxPlates
          ) {
            alert(
              `Please fill all fields for the package "${
                pkg.packageName || "Unnamed"
              }".`
            );
            return false;
          }
          if (+pkg.perPlatePrice <= 0) {
            alert(`Price for package "${pkg.packageName}" must be positive.`);
            return false;
          }
          if (+pkg.minPlates >= +pkg.maxPlates) {
            alert(
              `In package "${pkg.packageName}", minimum plates must be less than maximum.`
            );
            return false;
          }
        }
      }
    } else {
      if (!minPrice || !maxPrice) {
        alert("Please enter both minimum and maximum prices");
        return false;
      }
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

    // // 6. Check duration - at least one field should have value
    // if (!days && !hours && !minutes) {
    //   alert("Please set estimated duration (days, hours, or minutes)");
    //   return false;
    // }

    // // 7. Validate duration values
    // if (hours && (parseInt(hours) < 0 || parseInt(hours) > 23)) {
    //   alert("Hours should be between 0 and 23");
    //   return false;
    // }

    // if (minutes && (parseInt(minutes) < 0 || parseInt(minutes) > 59)) {
    //   alert("Minutes should be between 0 and 59");
    //   return false;
    // }

    // if (days && parseInt(days) < 0) {
    //   alert("Days cannot be negative");
    //   return false;
    // }
    // Duration Validation
    const d = parseInt(days);
    const h = parseInt(hours);
    const m = parseInt(minutes);

    // 1. If all are empty or zero -> invalid
    if ((!days && !hours && !minutes) || (d === 0 && h === 0 && m === 0)) {
      toast.error("Please set estimated duration (days, hours, or minutes)");
      return false;
    }

    // 2. Days validation
    if (days !== "" && (isNaN(d) || d < 0)) {
      toast.error("Days cannot be negative");
      return false;
    }

    // 3. Hours validation
    if (hours !== "" && (isNaN(h) || h < 0 || h > 23)) {
      toast.error("Hours should be between 0 and 23");
      return false;
    }

    // 4. Minutes validation
    if (minutes !== "" && (isNaN(m) || m < 0 || m > 59)) {
      toast.error("Minutes should be between 0 and 59");
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
  const handleSelectAllLocations = () => {
    if (selectedState && allLocations[selectedState]) {
      setSelectedLocations(allLocations[selectedState]);
      setShowLocationDropdown(false);
    }
  };

  const handleDeselectAllLocations = () => {
    setSelectedLocations([]);
  };

  const handleSelectAllSubcategories = () => {
    setSelectedSubcategories(availableSubcategories);
  };

  const handleDeselectAllSubcategories = () => {
    setSelectedSubcategories([]);
  };

  return (
    <>
      <StepProgress currentStep={1} />
      {isLoading && <Spinner />}

      {showCropperModal && (
        <div className="crop-modal-backdrop">
          <div className="crop-modal-content">
            <h2>Crop Your Image</h2>
            <p style={{ textAlign: "center", margin: 0, color: "#555" }}>
              Adjust the selection to crop
            </p>
            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                minWidth={100}
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  className="ReactCrop__image"
                  onLoad={(e) => {
                    const { width, height } = e.currentTarget;
                    const newCrop = centerCrop(
                      { unit: "px", width: width * 0.9, height: height * 0.9 },
                      width,
                      height
                    );
                    setCrop(newCrop);
                    setCompletedCrop(newCrop);
                  }}
                  alt="Crop preview"
                />
              </ReactCrop>
            </div>
            <div className="crop-modal-actions">
              <button
                onClick={() => {
                  setShowCropperModal(false);
                  setImageToCrop(undefined);
                  setCropQueue((prev) => prev.slice(1));
                }}
                className="crop-cancel-btn"
              >
                Skip
              </button>
              <button onClick={handleCropImage} className="crop-confirm-btn">
                Crop & Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: "linear-gradient(135deg, #001228 0%, #001f3f 45%, #0a2a4a 100%)",
        minHeight: "calc(100vh - 130px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 0 12px 0",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* bg orbs */}
      <div style={{position:"absolute",top:"-60px",left:"-60px",width:"280px",height:"280px",borderRadius:"50%",background:"radial-gradient(circle,rgba(249,200,35,0.15) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:"-40px",right:"-40px",width:"320px",height:"320px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,147,15,0.15) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}} />
      <div className="form-container" style={{position:"relative",zIndex:1}}>
        <div className="form-wrapper">
          <div className="form-column">
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
                      src="/close.webp"
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

            <div className="ServiceSubCategory">
              <label htmlFor="subcategory-search" className="location-label">
                Service Type *
              </label>

              <div
                className="location-dropdown-wrapper"
                ref={subCategoryDropdownRef}
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
                    document.getElementById("subcategory-input").focus()
                  }
                >
                  {/* Selected Subcategories as Chips */}
                  {selectedSubcategories.map((item, index) => (
                    <span
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#eef4ff",
                        color: "#001f3f",
                        border: "1px solid #001f3f",
                        borderRadius: "6px",
                        padding: "2px 6px",
                        fontSize: "14px",
                      }}
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSubcategories(
                            selectedSubcategories.filter((i) => i !== item)
                          )
                        }
                        style={{
                          marginLeft: "4px",
                          color: "#001f3f",
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

                  {/* Search Input */}
                  <input
                    id="subcategory-input"
                    type="text"
                    placeholder={
                      categorySearchTerm
                        ? "Search service type"
                        : "Please select category first"
                    }
                    value={subcategorySearchTerm}
                    onChange={(e) => setSubcategorySearchTerm(e.target.value)}
                    onFocus={() => {
                      if (categorySearchTerm) setShowSubcategoryDropdown(true);
                    }}
                    disabled={!categorySearchTerm}
                    style={{
                      flex: "1",
                      minWidth: "120px",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />

                  {subcategorySearchTerm && (
                    <img
                      src="/public/close.webp"
                      alt="Clear"
                      className="cross-icon"
                      onClick={() => setSubcategorySearchTerm("")}
                    />
                  )}
                  {availableSubcategories.length > 0 && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-start",
                      }}
                    >
                      {/* SELECT ALL BUTTON */}
                      <button
                        type="button"
                        onClick={handleSelectAllSubcategories}
                        disabled={
                          selectedSubcategories.length ===
                          availableSubcategories.length
                        }
                        style={{
                          padding: "4px 12px",
                          fontSize: "12px",
                          background:
                            selectedSubcategories.length ===
                            availableSubcategories.length
                              ? "#e0e0e0"
                              : "#4b2bb3",
                          color:
                            selectedSubcategories.length ===
                            availableSubcategories.length
                              ? "#999"
                              : "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor:
                            selectedSubcategories.length ===
                            availableSubcategories.length
                              ? "not-allowed"
                              : "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Select All ({availableSubcategories.length})
                      </button>

                      {/* DESELECT BUTTON */}
                      {selectedSubcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDeselectAllSubcategories}
                          style={{
                            padding: "4px 12px",
                            fontSize: "12px",
                            background: "transparent",
                            color: "#001f3f",
                            border: "1px solid #001f3f",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          Deselect All
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* DROPDOWN LIST */}
                {showSubcategoryDropdown && categorySearchTerm && (
                  <ul className="dropdown-list">
                    {/* SHOW SELECT ALL OPTION */}
                    {availableSubcategories.length > 0 && (
                      <li
                        onClick={handleSelectAllSubcategories}
                        style={{
                          fontWeight: "600",
                          color: "#001f3f",
                          borderBottom: "1px solid #e0e0e0",
                          background: "#f7f3ff",
                        }}
                      >
                        ✓ Select All ({availableSubcategories.length})
                      </li>
                    )}

                    {availableSubcategories
                      .filter((sub) =>
                        sub
                          .toLowerCase()
                          .includes(subcategorySearchTerm.toLowerCase())
                      )
                      .map((sub, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            if (!selectedSubcategories.includes(sub)) {
                              setSelectedSubcategories([
                                ...selectedSubcategories,
                                sub,
                              ]);
                            }
                            setSubcategorySearchTerm("");
                            setShowSubcategoryDropdown(false);
                          }}
                        >
                          {sub}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

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
                <div className="preview-container" style={{maxHeight:"170px",overflow:"hidden"}}>
                  <div className="main-preview">
                    {selectedFiles[selectedImageIndex]?.type?.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={previewImages[selectedImageIndex]}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "110px" }}
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
                              width: "48px",
                              height: "48px",
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

            {/* ✅ FIXED: Updated Pricing Section */}
            {!isCatering ? (
              <div className="price-range-container">
                <label className="section-label">Price Range *</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    min="1"
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 rounded-md px-3 py-2 bg-[#fff] text-[#001f3f] border-2 border-[#b8cce4] focus:outline-none focus:border-[2px] focus:border-[#001f3f] cursor-text caret-black"
                  />
                  <span className="text-gray-600 font-semibold">-</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    min="1"
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 rounded-md px-3 py-2 bg-[#f5f8ff] text-[#001f3f] border-2 border-[#b8cce4] focus:outline-none focus:border-[2px] focus:border-[#001f3f] cursor-text caret-black"
                  />
                </div>
              </div>
            ) : (
              <div className="catering-pricing-container">
                <div className="base-price-section">
                  <label className="section-label">
                    Base Per-Plate Price *
                  </label>
                  <p className="section-subtitle">
                    This will be shown as your "Starting from" price.
                  </p>
                  <div className="simple-pricing-form">
                    <input
                      type="number"
                      placeholder="Price per plate (₹)"
                      value={perPlateData.price}
                      onChange={(e) =>
                        setPerPlateData({
                          ...perPlateData,
                          price: e.target.value,
                        })
                      }
                      min="1"
                    />
                    <div className="plate-range">
                      <input
                        type="number"
                        placeholder="Min plates"
                        value={perPlateData.minPlates}
                        onChange={(e) =>
                          setPerPlateData({
                            ...perPlateData,
                            minPlates: e.target.value,
                          })
                        }
                        min="1"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max plates"
                        value={perPlateData.maxPlates}
                        onChange={(e) =>
                          setPerPlateData({
                            ...perPlateData,
                            maxPlates: e.target.value,
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <hr className="pricing-divider" />

                <div className="package-pricing-form">
                  <label className="section-label">
                    Add-on Packages (Optional)
                  </label>
                  <p className="section-subtitle">
                    Add different tiers like Veg, Non-Veg, or Premium.
                  </p>
                  {packages.map((pkg, index) => (
                    <div key={pkg.id} className="package-entry">
                      <div className="package-header">
                        <h4>Package {index + 1}</h4>
                        <button
                          type="button"
                          className="remove-package-btn"
                          onClick={() => handleRemovePackage(pkg.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Package Name (e.g., Veg Buffet)"
                        value={pkg.packageName}
                        onChange={(e) =>
                          handlePackageChange(
                            pkg.id,
                            "packageName",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Price per plate (₹)"
                        value={pkg.perPlatePrice}
                        onChange={(e) =>
                          handlePackageChange(
                            pkg.id,
                            "perPlatePrice",
                            e.target.value
                          )
                        }
                        min="1"
                      />
                      <div className="plate-range">
                        <input
                          type="number"
                          placeholder="Min plates"
                          value={pkg.minPlates}
                          onChange={(e) =>
                            handlePackageChange(
                              pkg.id,
                              "minPlates",
                              e.target.value
                            )
                          }
                          min="1"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max plates"
                          value={pkg.maxPlates}
                          onChange={(e) =>
                            handlePackageChange(
                              pkg.id,
                              "maxPlates",
                              e.target.value
                            )
                          }
                          min="1"
                        />
                      </div>
                      <textarea
                        placeholder="Short description (menu highlights)"
                        value={pkg.description}
                        onChange={(e) =>
                          handlePackageChange(
                            pkg.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-package-btn"
                    onClick={handleAddPackage}
                  >
                    + Add Another Package
                  </button>
                </div>
              </div>
            )}

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

          <div className="form-divider"></div>

          <div className="form-right">
            <h3 style={{ color: "#001f3f", fontWeight: "600" }}>
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
              <span>d :</span>
              <input
                type="number"
                min="0"
                max="23"
                placeholder="HRS"
                className="duration-field"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <span>h :</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="MINS"
                className="duration-field"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
              <span>m</span>
            </div>

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

                {selectedState && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#eef4ff",
                      color: "#001f3f",
                      border: "1px solid #001f3f",
                      borderRadius: "6px",
                      padding: "2px 6px",
                      fontSize: "14px",
                    }}
                  >
                    {selectedState}
                    <button
                      type="button"
                      onClick={() => setSelectedState("")}
                      style={{
                        marginLeft: "4px",
                        color: "#001f3f",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        fontSize: "14px",
                      }}
                    >
                      ✕
                    </button>
                  </span>
                )}

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
                    src="/public/close.webp"
                    alt="Clear"
                    className="cross-icon"
                    onClick={() => setStateLocationSearchTerm("")}
                  />
                )}
              </div>

              {showStateLocationDropdown && (
                <ul className="state-location-dropdown-list">
                  {filteredStates.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedState(state);
                        setStateLocationSearchTerm("");
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

                {selectedLocations.map((loc, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#eef4ff",
                      color: "#001f3f",
                      border: "1px solid #001f3f",
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
                        color: "#001f3f",
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
                    src="/public/close.webp"
                    alt="Clear"
                    className="cross-icon"
                    onClick={() => setLocationSearchTerm("")}
                  />
                )}
              </div>

              {selectedState && (
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSelectAllLocations}
                    disabled={
                      selectedLocations.length ===
                      allLocations[selectedState]?.length
                    }
                    style={{
                      padding: "4px 12px",
                      fontSize: "12px",
                      background:
                        selectedLocations.length ===
                        allLocations[selectedState]?.length
                          ? "#e0e0e0"
                          : "#4b2bb3",
                      color:
                        selectedLocations.length ===
                        allLocations[selectedState]?.length
                          ? "#999"
                          : "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        selectedLocations.length ===
                        allLocations[selectedState]?.length
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Select All ({allLocations[selectedState]?.length || 0})
                  </button>

                  {selectedLocations.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeselectAllLocations}
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        background: "transparent",
                        color: "#001f3f",
                        border: "1px solid #001f3f",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Deselect All
                    </button>
                  )}
                </div>
              )}

              {showLocationDropdown && (
                <ul className="location-dropdown-list">
                  {selectedState && filteredLocations.length > 0 && (
                    <li
                      onClick={handleSelectAllLocations}
                      style={{
                        fontWeight: "600",
                        color: "#001f3f",
                        borderBottom: "1px solid #e0e0e0",
                        background: "#f7f3ff",
                      }}
                    >
                      ✓ Select All Locations ({filteredLocations.length})
                    </li>
                  )}

                  {filteredLocations.map((loc, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (!selectedLocations.includes(loc)) {
                          setSelectedLocations([...selectedLocations, loc]);
                        }
                        setLocationSearchTerm("");
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
        {imageError && (
          <div
            style={{
              background: "#ffe6e6",
              color: "#d9534f",
              padding: "10px 15px",
              borderRadius: "6px",
              marginTop: "20px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {imageError}
          </div>
        )}

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
      </div>
    </>
  );
}

export default VendorService;
