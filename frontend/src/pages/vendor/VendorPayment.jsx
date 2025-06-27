import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VendorPayment.css";
import StepProgress from "./StepProgress";
import "./StepProgress.css";
import Button from "./../../components/vendor/register/VendorButton";
import Spinner from "./../../components/common/Spinner";

import axios from "axios";

export default function VendorPayment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    branchName: "",
    ifscCode: "",
    gst: "",
    upiId: "",
    panCardPic: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // <<<<<<< HEAD
  //   const handleNext = () => {
  //     navigate("/vendor/legal-consent");
  //   };
  const handleBack = () => {
    navigate("/category/VendorService");
  };
  const handleNext = async () => {
    setIsLoading(true);
    const {
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panCardPic,
    } = formData;

    if (
      !accountHolderName ||
      !accountNumber ||
      !branchName ||
      !ifscCode ||
      !panCardPic
    ) {
      setIsLoading(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("accountHolderName", accountHolderName);
      fd.append("accountNumber", accountNumber);
      fd.append("branchName", branchName);
      fd.append("ifscCode", ifscCode);
      fd.append("gst", gst);
      fd.append("upiId", upiId);
      fd.append("panCardPic", panCardPic);

      const res = await axios.post(
        "http://localhost:8000/vendors/bank-details",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", res.data);
      navigate("/vendor/legal-consent", { state: { currentStep: 3 } });
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      setShowPopup(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="vendor-payment-page">
      {showPopup && (
        <div className="popup-message">Please fill all required fields!</div>
      )}

      <StepProgress currentStep={2} />
      {isLoading && <Spinner />}
      <div className="payment-box">
        <h2 className="payment-box-title">Bank Details</h2>

        <label>
          Account Holder Name <span className="required-icon">*</span>
          <input
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            placeholder="Enter account name"
          />
        </label>

        <label>
          Bank Account number <span className="required-icon">*</span>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter account number"
          />
        </label>

        <label>
          Bank Branch Name <span className="required-icon">*</span>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="Enter bank branch name"
          />
        </label>

        <div className="input-wrapper">
          <label>
            IFSC Code <span className="required-icon">*</span>
          </label>
          <div className="input-with-icon">
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
            />
            <img
              src="/question.png"
              alt="info"
              title="You can find this on your cheque or bank passbook."
            />
          </div>
        </div>

        <label>
          GSTIN (Optional)
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            placeholder="Enter GSTIN if available"
          />
        </label>

        <div className="upi-wrapper">
          <label>
            UPI Id (Optional)
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="Enter UPI Id"
            />
          </label>
          <div className="upi-input-with-icon">
            <img
              src="/question.png"
              alt="info"
              title="You can find your UPI ID using your banking app or UPI-enabled apps like PhonePe, Google Pay, Paytm, etc."
            />
          </div>
        </div>

        <div className="pan-upload-box">
          <div className="title">
            Upload PAN Card <span className="required-icon">*</span>
          </div>
          <div className="note">Accepted formats: JPG, PNG, PDF up to 2MB</div>
          <img src="/Upload.png" alt="Upload Icon" />
          <input
            type="file"
            name="panCardPic"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
          />
        </div>
        <Button handleBack={handleBack} handleNext={handleNext} />
      </div>
    </div>
  );
}
