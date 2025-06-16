import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

import StepProgress from "./StepProgress";
import LegalButton from "./LegalButton";
import "./VendorLegalConsent.css";

import "./StepProgress.css";
import "./LegalButton.css";
import axios from "axios";
import Spinner from "./../../components/common/Spinner";

export default function VendorLegalConsent() {
  const [signatureFile, setSignatureFile] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = React.useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [consents, setConsents] = React.useState({
    iAgreeTC: true,
    iAgreeCP: true,
    iAgreeKYCVerifyUsingPanAndAdhar: true,
  });

  const currentStepIndex = location.state?.currentStep || 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!signatureFile) {
      alert("Please upload your signature before submitting.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("iAgreeTC", true); // or get from state if checkboxes are dynamic
      formData.append("iAgreeCP", true);
      formData.append("iAgreeKYCVerifyUsingPanAndAdhar", true);

      formData.append("signature", signatureFile); // required by multer

      const res = await axios.post(
        "http://localhost:8000/vendors/legal-consent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Consent submitted:", res.data);
      navigate("/vendor/thank-you");
    } catch (error) {
      console.error(
        "Consent submission failed:",
        error?.response?.data || error.message
      );
      setIsLoading(false);
      alert("Failed to submit consent. Please try again.");
    }
  };

  return (
    <div className="legal-consent-page">
      <StepProgress currentStep={currentStepIndex} />

      {isLoading && <Spinner />}
      {/* {isLoading ? "true" : "false"} */}
      <div className="checkbox-section">
        <p className="consent-heading">
          Before submitting your registration, please review and agree to the
          following terms and authorizations.
        </p>

        <form className="checkbox-form" onSubmit={handleSubmit}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consents.iAgreeTC}
              onChange={(e) =>
                setConsents((prev) => ({ ...prev, iAgreeTC: e.target.checked }))
              }
            />
            <span>I agree to the Terms and Conditions</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consents.iAgreeCP}
              onChange={(e) =>
                setConsents((prev) => ({ ...prev, iAgreeCP: e.target.checked }))
              }
            />
            <span>I agree to the Commission and Payment Terms</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consents.iAgreeKYCVerifyUsingPanAndAdhar}
              onChange={(e) =>
                setConsents((prev) => ({
                  ...prev,
                  iAgreeKYCVerifyUsingPanAndAdhar: e.target.checked,
                }))
              }
            />
            <span>I authorize KYC Verification using PAN/Aadhaar</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <div className="signature-upload">
            <label className="signature-label">
              Signature (digital) or Name as e-sign
            </label>
            <div
              className="upload-box"
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer" }}
            >
              {signatureFile ? (
                <img
                  src={URL.createObjectURL(signatureFile)}
                  alt="Uploaded Signature"
                  className="uploaded-signature"
                />
              ) : (
                <>
                  <span>Upload</span>
                  <img
                    src="/Upload.png"
                    alt="Upload Icon"
                    className="upload-icon"
                  />
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => setSignatureFile(e.target.files[0])}
              />
            </div>
          </div>

          <LegalButton />
        </form>
      </div>
    </div>
  );
}
