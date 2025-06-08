import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import Footer from './Footer';
import Nav from './Nav';
import StepProgress from './StepProgress';
import LegalButton from './LegalButton';
import './VendorLegalConsent.css';
import './Nav.css';
import './Footer.css';
import './StepProgress.css';
import './LegalButton.css';

export default function VendorLegalConsent() {
  const [signatureFile, setSignatureFile] = React.useState(null);
  const fileInputRef = React.useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const currentStepIndex = location.state?.currentStep || 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/vendor/thank-you');
  };

  return (
    <div className="legal-consent-page">
      <Nav />

      <StepProgress currentStepIndex={currentStepIndex} />

      <div className="checkbox-section">
        <p className="consent-heading">
          Before submitting your registration, please review and agree to the following terms and authorizations.
        </p>

        <form className="checkbox-form" onSubmit={handleSubmit}>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>I agree to the Terms and Conditions</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>I agree to the Commission and Payment Terms</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>I authorize KYC Verification using PAN/Aadhaar</span>
            <FiAlertCircle className="info-icon" />
          </label>

          <div className="signature-upload">
            <label className="signature-label">Signature (digital) or Name as e-sign</label>
            <div
              className="upload-box"
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: 'pointer' }}
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
                  <img src="/Upload.png" alt="Upload Icon" className="upload-icon" />
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => setSignatureFile(e.target.files[0])}
              />
            </div>
          </div>

          <LegalButton />
        </form>
      </div>

      <Footer />
    </div>
  );
}
