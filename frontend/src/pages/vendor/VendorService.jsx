

import React, { useState } from 'react';

import './VendorService.css';
import Header from './Header';
import StepProgress from "./StepProgress";
import Footer from './Footer'; 
import Button from './Button';




function VendorService({ currentStep }) {
  const steps = [
    { label: 'Registration', subLabel: 'Step 1', icon: '/verify.png' },
    { label: 'Service Details', subLabel: 'Step 2', icon: '/service.png' },
    { label: 'Payment', subLabel: 'Step 3', icon: '/payment.png' },
    { label: 'Legal Consents', subLabel: 'Step 4', icon: '/legal.png' },
  ];

  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const categories = ['DJ', 'Orchestra', 'Food Catering', 'Florist', 'Tent House'];
  
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
 
  const [previewImages, setPreviewImages] = useState([]);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);   
  const imageUrls = files.map(file => URL.createObjectURL(file));
  setPreviewImages(imageUrls);           
  setSelectedImageIndex(0);              
};
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [activeField, setActiveField] = useState('min');
const [locationSearchTerm, setLocationSearchTerm] = useState('');
const [showLocationDropdown, setShowLocationDropdown] = useState(false);

const allLocations = ['Bhubaneswar', 'Balasore', 'Kendrapara', 'Dhenkanal', 'Cuttack'];

const filteredLocations = allLocations.filter(loc =>
  loc.toLowerCase().includes(locationSearchTerm.toLowerCase())
);

const handleBack = () => {
  if (typeof props.onBack === 'function') {
    props.onBack();
  } else {
    console.log('Back clicked');
  }
};

const handleNext = () => {
  if (typeof props.onNext === 'function') {
    props.onNext();
  } else {
    console.log('Submit/Next clicked');
  }
};


  
  return (
    <>
    <Header />
     
    <StepProgress currentStep={currentStep} />
     
    {/*  added div */}
      <div className="form-container">
      <div className="form-wrapper">
  {/* Left Side: Form Column */}
  <div className="form-column">
    {/* Service Category */}
    <div className="ServiceCategory">
      <label htmlFor="category-search">Service Category</label>
      <div className="category-wrapper">
        <div className="category-input">
          <input
            type="text"
            id="category-search"
            placeholder="Search category"
            value={categorySearchTerm}
            onChange={(e) => setCategorySearchTerm(e.target.value)}
            onFocus={() => setShowCategoryDropdown(true)}
          />
         {categorySearchTerm && (
  <img
    src="/public/close.png"
    alt="Clear"
    className="clear-icon-img"
    onClick={() => setCategorySearchTerm('')}
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
      <label htmlFor="service-images">Upload Service Images</label>
      <input
        type="file"
        id="service-images"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      {previewImages.length > 0 && (
        <div className="preview-container">
          <div className="main-preview">
            <img src={previewImages[selectedImageIndex]} alt="Selected Preview" />
          </div>
          <div className="thumbnail-preview">
            {previewImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb-${idx}`}
                className={selectedImageIndex === idx ? "active" : ""}
                onClick={() => setSelectedImageIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Price Range */}
    <div className="price-range-container">
      <label className="section-label">Price Range</label>
      <select className="value-dropdown">
        <option>Value</option>
        <option>₹500 - ₹1000</option>
        <option>₹1000 - ₹2000</option>
        <option>₹2000 - ₹5000</option>
      </select>
      <div className="price-input-toggle">
        <button
          className={activeField === 'min' ? 'active' : ''}
          onClick={() => setActiveField('min')}
        >
          Min
        </button>
        <button
          className={activeField === 'max' ? 'active' : ''}
          onClick={() => setActiveField('max')}
        >
          Max
        </button>
      </div>
      <div className="price-input-fields">
        {activeField === 'min' ? (
          <input
            type="number"
            placeholder="Enter Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        ) : (
          <input
            type="number"
            placeholder="Enter Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        )}
      </div>
    </div>

    {/* Service Name Field */}
    <label htmlFor="serviceName" className="ServiceName">
     
    </label>
    <input
      type="text"
      id="serviceName"
      name="serviceName"
      placeholder="Enter service name"
      className="input-field"
    />
  </div>
{/* Vertical Line */}
  <div className="form-divider"></div>

{/* Right Side: Placeholder content */}
<div className="form-right">
  <h3 style={{ color: "#4b2bb3", fontWeight: "600" }}>Estimated Duration</h3>
  <div className="duration-inputs">
    <input type="number" min="0" placeholder="DAYS" className="duration-field" />
    <span>:</span>
    <input type="number" min="0" max="59" placeholder="HRS" className="duration-field" />
    <span>:</span>
    <input type="number" min="0" max="59" placeholder="MINS" className="duration-field" />
  </div>
  <label htmlFor="locations" className="location-label">Locations Offered</label>
<div className="location-dropdown-wrapper">
<div className="dropdown-input">
  <span className="icon-left">🔍</span>
  <input
    type="text"
    placeholder="Search location"
    value={locationSearchTerm}
    onChange={(e) => setLocationSearchTerm(e.target.value)}
    onFocus={() => setShowLocationDropdown(true)}
  />
  {locationSearchTerm && (
    <img
      src="/public/close.png" 
      alt="Clear"
      className="cross-icon"
      onClick={() => setLocationSearchTerm('')}
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
    Service Description
  </label>
  <textarea
    id="serviceDescription"
    name="serviceDescription"
    placeholder="Write a short description about the service..."
    className="description-textarea"
  />
</div> 
</div>
<Button 
  handleBack={handleBack} 
  handleNext={handleNext} 
  currentStep={currentStep} 
  steps={steps} 
/>
  </div>
      
<Footer />
    </>
  );
}
export default VendorService;