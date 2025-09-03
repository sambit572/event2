import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";

// Import your separate components
import StepProgress from "./StepProgress";
import Spinner from "./../../components/common/Spinner";
import LegalButton from "./LegalButton"; // Correctly importing your button component
import "./LegalButton.css"; // Importing the CSS for the buttons

export default function VendorLegalConsent() {
  const [signatureFile, setSignatureFile] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const vendor = useSelector((state) => state.vendor.vendor);

  const fileInputRef = React.useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [consents, setConsents] = useState({
    iAgreeTC: false,
    iAgreeCP: false,
    iAgreeKYCVerifyUsingPanAndAdhar: false,
  });

  const currentStepIndex = location.state?.currentStep || 3;

  // --- All the validation logic remains the same ---
  const validateSignatureImage = (file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (!validTypes.includes(file.type)) {
        reject("Please upload only PNG or JPEG images.");
        return;
      }
      if (file.size > maxSize) {
        reject("Signature file is too large (max 2MB).");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          let backgroundPixels = 0;
          const totalPixels = pixels.length / 4;
          const colorSet = new Set();

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            const isBackground = a < 128 || (r > 240 && g > 240 && b > 240);

            if (isBackground) {
              backgroundPixels++;
            } else {
              const simplifiedColor = `rgb(${Math.floor(r / 16) * 16},${
                Math.floor(g / 16) * 16
              },${Math.floor(b / 16) * 16})`;
              colorSet.add(simplifiedColor);
            }
          }

          const backgroundRatio = backgroundPixels / totalPixels;
          if (backgroundRatio < 0.75) {
            reject(
              "This does not appear to be a signature. Please use an image with a clear white or transparent background."
            );
            return;
          }

          const contentRatio = 1 - backgroundRatio;
          if (contentRatio < 0.01) {
            reject(
              "Image appears empty or too faint. Please upload a clearer signature."
            );
            return;
          }

          if (colorSet.size > 20) {
            reject(
              "Image is too colorful for a signature. Please use a monochrome signature (like black or blue)."
            );
            return;
          }

          resolve("Signature validation passed");
        } catch (error) {
          console.warn("Pixel analysis failed, using basic validation:", error);
          resolve("Basic validation passed");
        }
      };
      img.onerror = () => reject("Unable to load image file.");
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsValidating(true);
    setValidationError("");
    try {
      await validateSignatureImage(file);
      setSignatureFile(file);
    } catch (error) {
      setValidationError(error);
      setSignatureFile(null);
      e.target.value = "";
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validationError) {
      alert("Please fix the signature upload error before submitting.");
      return;
    }

    if (
      !signatureFile ||
      !consents.iAgreeTC ||
      !consents.iAgreeCP ||
      !consents.iAgreeKYCVerifyUsingPanAndAdhar
    ) {
      alert(
        "Please agree to all terms and upload a valid signature before submitting."
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("iAgreeTC", consents.iAgreeTC);
      formData.append("iAgreeCP", consents.iAgreeCP);
      formData.append(
        "iAgreeKYCVerifyUsingPanAndAdhar",
        consents.iAgreeKYCVerifyUsingPanAndAdhar
      );
      formData.append("signature", signatureFile);
      formData.append("vendorId", vendor?._id || "");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/legal-consent`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      navigate("/vendor/thank-you");
    } catch (error) {
      console.error(
        "Consent submission failed:",
        error?.response?.data || error.message
      );
      alert("Failed to submit consent. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="legal-consent-page">
      <StepProgress currentStep={currentStepIndex} />
      {isLoading && <Spinner />}

      <div className="bg-[#e5e5de] rounded-[10px] max-w-[600px] h-[600px] my-[90px] mx-auto p-[30px] shadow-sm flex flex-col max-lg:max-w-[95%] max-lg:h-auto max-lg:p-[25px] max-lg:my-[70px] max-md:max-w-[95%] max-md:p-5 max-md:my-[60px] max-[480px]:max-w-[94%] max-[480px]:p-4 max-[480px]:h-auto max-[480px]:my-10 max-[480px]:overflow-x-hidden">
        <p className="text-base mb-5 leading-[1.8] text-black max-md:text-[15px] max-[480px]:text-sm max-[480px]:leading-[1.6]">
          Before submitting your registration, please review and agree to the
          following terms and authorizations.
        </p>

        <form
          className="flex flex-col gap-[20px] flex-grow"
          onSubmit={handleSubmit}
        >
          {/* Labels and Signature sections remain the same */}
          <label className="flex items-start gap-3 cursor-pointer text-[15px] max-md:text-sm">
            <input
              type="checkbox"
              checked={consents.iAgreeTC}
              onChange={(e) =>
                setConsents((prev) => ({ ...prev, iAgreeTC: e.target.checked }))
              }
              required
              className="mt-1 flex-shrink-0"
            />
            <span>
              I agree to the Terms and Conditions
              <FiAlertCircle className="inline-block align-middle ml-1" />
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-[15px] max-md:text-sm">
            <input
              type="checkbox"
              checked={consents.iAgreeCP}
              onChange={(e) =>
                setConsents((prev) => ({ ...prev, iAgreeCP: e.target.checked }))
              }
              required
              className="mt-1 flex-shrink-0"
            />
            <span>
              I agree to the Commission and Payment Terms
              <FiAlertCircle className="inline-block align-middle ml-1" />
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-[15px] max-md:text-sm">
            <input
              type="checkbox"
              checked={consents.iAgreeKYCVerifyUsingPanAndAdhar}
              onChange={(e) =>
                setConsents((prev) => ({
                  ...prev,
                  iAgreeKYCVerifyUsingPanAndAdhar: e.target.checked,
                }))
              }
              required
              className="mt-1 flex-shrink-0"
            />
            <span>
              I authorize KYC Verification using PAN/Aadhaar
              <FiAlertCircle className="inline-block align-middle ml-1" />
            </span>
          </label>
          <div className="mt-7 text-center">
            <label className="block text-base font-medium mb-2.5">
              Signature (digital) or Name as e-sign
            </label>
            <div className="text-xs text-gray-600 mb-2.5 text-center leading-relaxed">
              Upload your signature or written name (PNG/JPEG only, max 2MB)
              <br />
              Ensure good contrast with white/transparent background
            </div>
            <div
              className={`cursor-pointer bg-white border-[1.5px] rounded-[10px] p-5 w-[280px] mx-auto flex items-center justify-between text-base shadow-sm transition-colors ${
                validationError
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              } max-lg:w-[260px] max-lg:p-[18px] max-lg:text-[15px] max-md:w-[240px] max-md:p-4 max-md:text-sm max-[480px]:w-full max-[480px]:p-[14px] max-[480px]:text-[13px]`}
              onClick={() => fileInputRef.current.click()}
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Validating...</span>
                </div>
              ) : signatureFile ? (
                <div className="flex flex-col items-center gap-1 w-full">
                  <img
                    src={URL.createObjectURL(signatureFile)}
                    alt="Uploaded Signature"
                    className="max-h-[60px] max-w-[220px] object-contain"
                  />
                  <span className="text-xs text-emerald-500 font-medium">
                    ✓ Signature accepted
                  </span>
                </div>
              ) : (
                <>
                  <span>Upload Signature</span>
                  <img
                    src="/Upload.png"
                    alt="Upload Icon"
                    className="h-6 w-6 max-lg:h-[22px] max-lg:w-[22px] max-md:h-5 max-md:w-5 max-[480px]:h-[18px] max-[480px]:w-[18px]"
                  />
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
            </div>
            {validationError && (
              <div className="mt-2.5 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs text-center max-w-[280px] mx-auto max-[480px]:max-w-full">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FiAlertCircle className="text-sm" />
                  <span className="font-medium">Upload Error</span>
                </div>
                <div className="text-xs">{validationError}</div>
              </div>
            )}
          </div>

          {/* ✅ The buttons are now correctly imported and used as a separate component */}
          <div className="mt-1">
            <LegalButton />
          </div>
        </form>
      </div>
    </div>
  );
}
