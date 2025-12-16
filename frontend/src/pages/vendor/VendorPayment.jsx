import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VendorPayment.css";
import StepProgress from "./StepProgress";

import Button from "./../../components/vendor/register/VendorButton";
import Spinner from "./../../components/common/Spinner";

import axios from "axios";
import toast from "react-hot-toast";

export default function VendorPayment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Add PAN verification states
  const [panVerification, setPanVerification] = useState({
    isVerifying: false,
    isVerified: false,
    verificationMessage: "",
    verifiedName: "",
  });

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    branchName: "",
    ifscCode: "",
    gst: "",
    upiId: "",
    panNumber: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isIFSCVerified, setIsIFSCVerified] = useState(false);
  const [bankData, setBankData] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // PAN verification function
  /*  const verifyPAN = async (panNumber) => {
    if (!panNumber || panNumber.length !== 10) {
      setPanVerification({
        isVerifying: false,
        isVerified: false,
        verificationMessage: "",
        verifiedName: "",
      });
      return;
    }

  //   setPanVerification((prev) => ({
  //     ...prev,
  //     isVerifying: true,
  //     verificationMessage: "Verifying PAN...",
  //   }));

  //   console.log(`🔍 [VendorPayment] Verifying PAN: ${panNumber}`);

    try {
      const response = await axios.post(
        ${import.meta.env.VITE_BACKEND_URL}/vendors/verify-pan,
        { panNumber, name: formData.accountHolderName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

  //     if (response.data.success) {
  //       const verifiedName = response.data.data?.full_name || "";
  //       setPanVerification({
  //         isVerifying: false,
  //         isVerified: true,
  //         verificationMessage: "PAN verified successfully!",
  //         verifiedName,
  //       });

        // Auto-fill account holder name if verified name is available
        if (verifiedName && !formData.accountHolderName) {
          setFormData((prev) => ({
            ...prev,
            accountHolderName: verifiedName,
          }));
        }
      }
    } catch (error) {
      setPanVerification({
        isVerifying: false,
        isVerified: false,
        verificationMessage:
          error.response?.data?.message || "PAN verification failed",
        verifiedName: "",
      });
    }
  }; */

  // Handle PAN input with auto-verification
  const handlePANChange = (e) => {
    const panValue = e.target.value.toUpperCase();
    setFormData((prev) => ({
      ...prev,
      panNumber: panValue,
    }));

    // Reset verification state when PAN changes
    /*  if (panVerification.isVerified && panValue !== formData.panNumber) {
      setPanVerification({
        isVerifying: false,
        isVerified: false,
        verificationMessage: "",
        verifiedName: "",
      });*/
  };

  // Auto-verify when PAN is 10 characters
  // if (panValue.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panValue)) {
  //   verifyPAN(panValue);

  const handleIFSCChange = async (e) => {
    const value = e.target.value.toUpperCase();

    setFormData((prev) => ({ ...prev, ifscCode: value }));
    setIsIFSCVerified(null);

    // Auto verify when IFSC length is 11
    if (value.length === 11) {
      try {
        setIsIFSCVerified("loading");

        const res = await axios.get(`https://ifsc.razorpay.com/${value}`);

        if (res.data) {
          setBankData(res.data);

          setFormData((prev) => ({
            ...prev,
            // branchName: res.data.BRANCH || prev.branchName,
            bankName: res.data.BANK,
          }));

          setIsIFSCVerified(true);
          toast.success("IFSC Verified Automatically");
        }
      } catch {
        setIsIFSCVerified(false);
        toast.error("Invalid IFSC Code");
      }
    }
  };

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
      panNumber,
    } = formData;

    // ❗ Field validations with toast message at each error place
    if (!accountHolderName) {
      toast.error("Please enter Account Holder Name");
      setIsLoading(false);
      return;
    }
    if (!accountNumber) {
      toast.error("Please enter Bank Account Number");
      setIsLoading(false);
      return;
    }
    if (!ifscCode) {
      toast.error("Please enter IFSC Code");
      setIsLoading(false);
      return;
    }
    // ❗ Block next if IFSC is not verified
    if (!isIFSCVerified) {
      toast.error("Please verify IFSC Code before continuing");
      setIsLoading(false);
      return;
    }
    if (!branchName) {
      toast.error("Please enter Bank Branch Name");
      setIsLoading(false);
      return;
    }
    if (!panNumber) {
      toast.error("Please enter PAN Number");
      setIsLoading(false);
      return;
    }

    try {
      const vendorId = localStorage.getItem("vendorId");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/bank-details`,
        {
          vendorId,
          accountHolderName,
          accountNumber,
          branchName,
          ifscCode,
          gst,
          upiId,
          panNumber,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      navigate("/vendor/legal-consent", { state: { currentStep: 3 } });
    } catch (err) {
      console.error("Error submitting bank details:", err);
      toast.error("Something went wrong, please try again");
    }

    setIsLoading(false);
  };

  // const handleNext = async () => {
  //   setIsLoading(true);
  //   const {
  //     accountHolderName,
  //     accountNumber,
  //     branchName,
  //     ifscCode,
  //     gst,
  //     upiId,
  //     panNumber,
  //   } = formData;

  //   // Check required fields
  //   if (
  //     !accountHolderName ||
  //     !accountNumber ||
  //     !branchName ||
  //     !ifscCode ||
  //     !panNumber
  //   ) {
  //     setIsLoading(false);
  //     setShowPopup(true);
  //     setTimeout(() => setShowPopup(false), 3000);
  //     return;
  //   }

  //   // Check PAN verification
  //   // if (!panVerification.isVerified) {
  //   //   setIsLoading(false);
  //   //   alert("Please verify your PAN number before proceeding.");
  //   //   return;
  //   // }

  //   try {
  //     const vendorId = localStorage.getItem("vendorId");

  //     await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/vendors/bank-details`,
  //       {
  //         vendorId,
  //         accountHolderName,
  //         accountNumber,
  //         branchName,
  //         ifscCode,
  //         gst,
  //         upiId,
  //         panNumber,
  //       },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );

  //     navigate("/vendor/legal-consent", { state: { currentStep: 3 } });
  //   } catch (err) {
  //     console.error(
  //       "Error submitting bank details:",
  //       err.response?.data || err.message
  //     );
  //     setShowPopup(true);
  //     setTimeout(() => setShowPopup(false), 3000);
  //   }

  //   setIsLoading(false);
  // };

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
          {panVerification.verifiedName && (
            <small style={{ color: "#28a745", fontSize: "12px" }}>
              Verified name: {panVerification.verifiedName}
            </small>
          )}
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

        <div className="input-wrapper">
          <label>
            IFSC Code <span className="required-icon">*</span>
          </label>

          <div className="ifsc-flex">
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleIFSCChange}
              placeholder="Enter IFSC code"
              maxLength="11"
              style={{
                borderColor:
                  isIFSCVerified === false
                    ? "red"
                    : isIFSCVerified === true
                    ? "green"
                    : "",
              }}
            />
          </div>
          {isIFSCVerified === true && (
            <div className="mt-2 flex items-center gap-2 animate-fade">
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                Verified
              </span>
              <p className="text-sm text-green-700 font-medium">
                IFSC Successfully Validated
              </p>
            </div>
          )}

          {isIFSCVerified === false && (
            <div className="mt-2 flex items-center gap-2 animate-fade">
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold">
                Error
              </span>
              <p className="text-sm text-red-700 font-medium">
                Invalid IFSC — Check Again
              </p>
            </div>
          )}

          {isIFSCVerified === "loading" && (
            <div className="mt-2 flex items-center gap-2 animate-pulse">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">
                Checking
              </span>
              <p className="text-sm text-blue-700 font-medium">
                Validating IFSC...
              </p>
            </div>
          )}
        </div>

        {/* <div className="input-wrapper">
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
            <img decoding="async"
 fetchPriority
="low"
loading="lazy"              src="/question.webp"
              alt="info"
              title="You can find this on your cheque or bank passbook."
            />
          </div>
        </div> */}

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
              decoding="async"
              loading="lazy"
              src="/question.webp"
              alt="info"
              title="You can find your UPI ID using your banking app or UPI-enabled apps like PhonePe, Google Pay, Paytm, etc."
            />
          </div>
        </div>

        <label>
          PAN Card Number <span className="required-icon">*</span>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handlePANChange}
              /* onBlur={() => {
                if (
                  formData.panNumber.length === 10 &&
                  !panVerification.isVerified
                ) {
                  verifyPAN(formData.panNumber);
                }
              }} */
              placeholder="ABCDE1234F"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              maxLength="10"
              required
              style={{
                borderColor: panVerification.isVerified
                  ? "#28a745"
                  : panVerification.verificationMessage &&
                    !panVerification.isVerified
                  ? "#dc3545"
                  : "#ccc",
              }}
            />

            {/* PAN Verification Status */}
            {panVerification.isVerifying && (
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #f3f3f3",
                    borderTop: "2px solid #007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
              </div>
            )}

            {panVerification.isVerified && (
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#28a745",
                  fontSize: "18px",
                }}
              >
                ✓
              </div>
            )}
          </div>
          {/* Verification Message */}
          {panVerification.verificationMessage && (
            <small
              style={{
                color: panVerification.isVerified ? "#28a745" : "#dc3545",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {panVerification.verificationMessage}
            </small>
          )}
        </label>

        <Button onBack={handleBack} onNext={handleNext} />
      </div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
         
    </div>
  );
}
