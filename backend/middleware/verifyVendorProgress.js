import Vendor from "../model/vendor/vendor.model.js";

export const verifyVendorRegistrationComplete = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.registrationProgress < 4) {
      return res.status(403).json({
        message: "Complete all steps of registration to access the dashboard.",
        currentStep: vendor.registrationProgress,
      });
    }

    // All checks passed
    req.vendor = vendor; // optionally forward vendor for downstream use
    next();
  } catch (err) {
    console.error("Vendor verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
