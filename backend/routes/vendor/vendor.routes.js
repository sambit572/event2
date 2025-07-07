import express from "express";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyVendorJwt } from "../../middleware/VendorAuth.middleware.js";

// Vendor Core Controllers
import {
  registerVendor,
  updateVendor,
  loginVendor,
  vendorLogout,
  sendVendorResetLink,
  resetVendorPassword,
  changeVendorPassword,
  vendorSilentLogin,
  checkVendorEmailStatus,
  getVendorProfile,
  updateVendorProfilePicture,
  
} from "../../controller/vendor/vendor.controller.js";

// Service Controller
import { createService } from "../../controller/vendor/service.controller.js";

// Bank Details
import {
  createBankDetails,
  deleteBankDetails,
  getBankDetailsByVendor,
  updateBankDetails,
} from "../../controller/vendor/bankdetails.controller.js";

// Legal Consent
import {
  createLegalConsent,
  getLegalConsentByVendor,
  updateLegalConsent,
  deleteLegalConsent,
} from "../../controller/vendor/legal.controller.js";

const vendor_router = express.Router();

// --- AUTH ROUTES --- //
vendor_router.post(
  "/register",
  upload.single("profilePicture"),
  registerVendor
);
vendor_router.post("/login", loginVendor);
vendor_router.post("/logout",verifyVendorJwt, vendorLogout);
vendor_router.post("/send-reset-link", sendVendorResetLink);
vendor_router.post("/reset-password/:resetToken", resetVendorPassword);
vendor_router.post("/change-password",verifyVendorJwt, changeVendorPassword);
vendor_router.get("/silent-login",verifyVendorJwt, vendorSilentLogin);
vendor_router.post("/check-email", checkVendorEmailStatus);
vendor_router.get("/me", verifyVendorJwt, getVendorProfile);


// --- PROFILE ROUTES --- //
vendor_router.put("/:id", upload.single("profilePicture"), updateVendor);

// --- SERVICE ROUTES --- //
vendor_router.post(
  "/create-service",
  (req, res, next) => {
    upload.array("images", 10)(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  createService
);

// --- BANK DETAILS ROUTES --- //
vendor_router.post(
  "/bank-details",
  upload.single("panCardPic"),
  createBankDetails
);
vendor_router.get("/bank-details/:vendorId", getBankDetailsByVendor);
vendor_router.put("/bank-details/:vendorId", updateBankDetails);
vendor_router.delete("/bank-details/:vendorId", deleteBankDetails);

// --- LEGAL CONSENT ROUTES --- //
vendor_router.post(
  "/legal-consent",
  upload.single("signature"),
  createLegalConsent
);
vendor_router.get("/legal-consent/:vendorId", getLegalConsentByVendor);
vendor_router.put(
  "/legal-consent/:vendorId",
  upload.single("signature"),
  updateLegalConsent
);
vendor_router.delete("/legal-consent/:vendorId", deleteLegalConsent);

// --- UPLOAD PROFILE PICTURE ROUTE (NEW) --- //
vendor_router.post(
  "/upload-profile",
  verifyVendorJwt,
  upload.single("profilePicture"),
  updateVendorProfilePicture
  
);



export { vendor_router };
