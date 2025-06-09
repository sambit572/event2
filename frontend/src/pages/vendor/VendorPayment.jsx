import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VendorPayment.css";

import StepProgress from "./StepProgress";
import "./StepProgress.css";
import Button from "./../../components/vendor/register/Button";

export default function VendorPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStepIndex = location.state?.currentStep || 2;

  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    branchName: "",
    ifsc: "",
    gstin: "",
    upi: "",
    panFile: null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    const { name, accountNumber, branchName, ifsc, panFile } = formData;

    if (!name || !accountNumber || !branchName || !ifsc || !panFile) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    navigate("/vendor/legal-consent", { state: { currentStep: 3 } });
  };

  return (
    <div className="vendor-payment-page">
      {showPopup && (
        <div className="popup-message">Please fill all required fields!</div>
      )}

      <StepProgress currentStepIndex={currentStepIndex} />

      <div className="payment-box">
        <h2 className="payment-box-title">Bank Details</h2>

        <label>
          Account Holder Name <span className="required-icon">*</span>
          <input
            type="text"
            name="name"
            value={formData.name}
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
              name="ifsc"
              value={formData.ifsc}
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
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            placeholder="Enter GSTIN if available"
          />
        </label>

        <div className="upi-wrapper">
          <label>
            UPI Id (Optional)
            <input
              type="text"
              name="upi"
              value={formData.upi}
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
            name="panFile"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
          />
        </div>
        <Button onBack={() => navigate(-1)} onNext={handleNext} />
      </div>
    </div>
  );
}
