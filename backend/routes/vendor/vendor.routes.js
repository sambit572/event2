import express from "express";
import { upload } from "../../middleware/multer.middleware.js";
import {
  createService,
  deleteService,
  getMyServices,
  updateAvailability,
  updateService,
  uploadServiceMedia,
  updateServiceImageFirst,
  getSubcategoryList,
} from "../../controller/vendor/service.controller.js";

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
  verifyConfirmPassword,
  getSearchSuggestions,
  getVendorDashboard,
  verifyVendorLogin,
  // updateTheBankDetails,
} from "../../controller/vendor/vendor.controller.js";

// Bank Details
import {
  beforeHandPanVerification,
  createBankDetails,
  deleteBankDetails,
  getBankDetailsByVendor,
  updateBankDetails,
} from "../../controller/vendor/bankdetails.controller.js";
// import { getServiceById } from './../../controller/vendor/service.controller';

// Legal Consent
import {
  createLegalConsent,
  getLegalConsentByVendor,
  updateLegalConsent,
  deleteLegalConsent,
} from "../../controller/vendor/legal.controller.js";
import {
  getServiceById,
  getServicesByCategory,
} from "../../controller/common/serviceList.controller.js";

// Why Choose Us
import {
  getWhyChooseUs,
  updateWhyChooseUs,
  resetWhyChooseUs,
} from "../../controller/vendor/whychooseus.controller.js";
import { getVendorBookings } from "../../controller/vendor/vendorBookingHistory.controller.js";

const vendor_router = express.Router();

// --- WHY CHOOSE US ROUTES --- //
vendor_router.get(
  "/service/:serviceId/why-choose-us",
  verifyVendorJwt,
  getWhyChooseUs
);
vendor_router.put(
  "/service/:serviceId/why-choose-us",
  verifyVendorJwt,
  updateWhyChooseUs
);
vendor_router.delete(
  "/service/:serviceId/why-choose-us",
  verifyVendorJwt,
  resetWhyChooseUs
);

// --- AUTH ROUTES --- //
vendor_router.post(
  "/register",
  upload.single("profilePicture"),
  registerVendor
);
vendor_router.post("/login", loginVendor);
vendor_router.post("/logout", verifyVendorJwt, vendorLogout);
vendor_router.post("/send-reset-link", sendVendorResetLink);
vendor_router.post("/reset-password/:resetToken", resetVendorPassword);
vendor_router.post("/change-password", verifyVendorJwt, changeVendorPassword);
vendor_router.get("/silent-login", verifyVendorJwt, vendorSilentLogin);
vendor_router.post("/check-email", checkVendorEmailStatus);
vendor_router.get("/me", verifyVendorJwt, getVendorProfile);
vendor_router.get("/category/:category", getServicesByCategory);
vendor_router.post("/verify-otp", verifyVendorLogin);

vendor_router.get("/service/:id", getServiceById); // --- PROFILE ROUTES --- //
vendor_router.put("/:id", upload.single("profilePicture"), updateVendor);

// --- SERVICE ROUTES --- //
vendor_router.post(
  "/create-service",
  verifyVendorJwt,
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

vendor_router.route("/my-services").get(verifyVendorJwt, getMyServices);
vendor_router.route("/update-service/:id").put(verifyVendorJwt, updateService);
vendor_router
  .route("/delete-service/:id")
  .delete(verifyVendorJwt, deleteService);

vendor_router
  .route("/update-availability/:id")
  .patch(verifyVendorJwt, updateAvailability);

vendor_router.post(
  "/upload-service-media",
  verifyVendorJwt,
  (req, res, next) => {
    upload.array("media", 10)(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadServiceMedia
);

// --- BANK DETAILS ROUTES --- //
vendor_router.post("/bank-details", verifyVendorJwt, createBankDetails);
vendor_router.get(
  "/bank-details/bankDetails",
  verifyVendorJwt,
  getBankDetailsByVendor
);
vendor_router.put("/bank-details/:vendorId", updateBankDetails);
vendor_router.delete("/bank-details/:vendorId", deleteBankDetails);

// --- PAN VERIFICATION ROUTE --- //
vendor_router.post("/verify-pan", verifyVendorJwt, beforeHandPanVerification);

// --- LEGAL CONSENT ROUTES --- //
vendor_router.post(
  "/legal-consent",
  upload.single("signature"),
  createLegalConsent
);
vendor_router.get(
  "/legal-consent/:vendorId",
  verifyVendorJwt,
  getLegalConsentByVendor
);
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
vendor_router.post("/verify-password", verifyVendorJwt, verifyConfirmPassword);

// --- DYNAMIC SEARCH SUGGESTIONS ROUTE --- //
vendor_router.get("/search-suggestions", getSearchSuggestions);

// --- DASHBOARD ROUTE --- //
vendor_router.get(
  "/currentStep-status",
  verifyVendorJwt, // existing auth check
  getVendorDashboard
);
// --- VENDOR BOOKING HISTORY ROUTE --- //
vendor_router.get("/vendor-booking/:vendorId", getVendorBookings);
// --- GET SUBCATEGORY LIST ROUTE --- //
vendor_router.get("/subcategory-list/:category", getSubcategoryList);

export { vendor_router };
