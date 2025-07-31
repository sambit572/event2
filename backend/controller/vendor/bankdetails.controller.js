import { BankDetails } from "../../model/vendor/bankDetails.model.js";
import Vendor from "../../model/vendor/vendor.model.js";
import axios from "axios";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";

// Cashfree PAN validation function
async function verifyPanWithCashfree(panNumber) {
  const resp = await axios.post(
    "https://payout-api.cashfree.com/payout/v1/validatePan",
    { pan: panNumber },
    {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
      },
    }
  );
  return resp.data;
}

export const createBankDetails = async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panNumber,
    } = req.body;

    // Validate presence
    if (
      !accountHolderName ||
      !accountNumber ||
      !branchName ||
      !ifscCode ||
      !panNumber
    ) {
      return res.status(400).json(new ApiError(400, "Missing required fields"));
    }

    // Verify PAN via Cashfree with proper error handling
    let verifyResp;
    try {
      verifyResp = await verifyPanWithCashfree(panNumber);
    } catch (cashfreeError) {
      console.error("Cashfree PAN verification error:", cashfreeError.response?.data || cashfreeError.message);
      return res.status(400).json(new ApiError(400, "PAN verification failed. Please check your PAN number and try again."));
    }

    if (verifyResp.status !== "SUCCESS") {
      return res.status(400).json(new ApiError(400, "Invalid PAN number"));
    }

    // Optional: Use name from Cashfree
    const verifiedName = verifyResp.data?.full_name;

    // Save to DB
    const newDetails = await BankDetails.create({
      vendorId: req.vendor._id, // from auth middleware
      accountHolderName: verifiedName || accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panNumber,
    });

    // Update vendor registration progress
    await Vendor.findByIdAndUpdate(req.vendor._id, {
      registrationProgress: 3,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, newDetails, "Bank details saved successfully")
      );
  } catch (err) {
    console.error("Error saving bank details:", err);
    res.status(500).json(new ApiError(500, err.message));
  }
};

export const deleteBankDetails = async (req, res) => {
  try {
    const bankDetail = await BankDetails.findOneAndDelete({
      vendorId: req.vendor._id,
    });

    if (!bankDetail) {
      return res.status(404).json(new ApiError(404, "Bank details not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Bank details deleted successfully"));
  } catch (error) {
    console.error("Error deleting bank details:", error);
    res.status(500).json(new ApiError(500, error.message));
  }
};

export const getBankDetailsByVendor = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({ vendorId: req.vendor._id });

    if (!bankDetails) {
      return res
        .status(404)
        .json(new ApiError(404, "Bank details not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, bankDetails, "Bank details retrieved successfully"));
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json(new ApiError(500, error.message));
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panNumber,
    } = req.body;

    // Optional: re-verify PAN if changed
    if (!panNumber) {
      return res.status(400).json(new ApiError(400, "PAN number is required"));
    }

    // Verify PAN via Cashfree with proper error handling
    let verifyResp;
    try {
      verifyResp = await verifyPanWithCashfree(panNumber);
    } catch (cashfreeError) {
      console.error("Cashfree PAN verification error:", cashfreeError.response?.data || cashfreeError.message);
      return res.status(400).json(new ApiError(400, "PAN verification failed. Please check your PAN number and try again."));
    }

    if (verifyResp.status !== "SUCCESS") {
      return res.status(400).json(new ApiError(400, "Invalid PAN number"));
    }

    const verifiedName = verifyResp.data?.full_name;

    const updatedDetails = await BankDetails.findOneAndUpdate(
      { vendorId: req.vendor._id },
      {
        accountHolderName: verifiedName || accountHolderName,
        accountNumber,
        branchName,
        ifscCode,
        gst,
        upiId,
        panNumber,
      },
      { new: true }
    );

    if (!updatedDetails) {
      return res.status(404).json(new ApiError(404, "Bank details not found"));
    }

    res.status(200).json(
      new ApiResponse(200, updatedDetails, "Bank details updated successfully")
    );
  } catch (err) {
    console.error("Error updating bank details:", err);
    res.status(500).json(new ApiError(500, err.message));
  }
};

// Verify PAN 

export const verifyPan = async (req, res) => {
  try {
    const { panNumber } = req.body;

    // Validate PAN format
    if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return res.status(400).json(new ApiError(400, "Invalid PAN format"));
    }

    // Verify PAN via Cashfree with proper error handling
    let verifyResp;
    try {
      verifyResp = await verifyPanWithCashfree(panNumber);
    } catch (cashfreeError) {
      console.error("Cashfree PAN verification error:", cashfreeError.response?.data || cashfreeError.message);
      return res.status(400).json(new ApiError(400, "PAN verification failed. Please check your PAN number and try again."));
    }

    if (verifyResp.status !== "SUCCESS") {
      return res.status(400).json(new ApiError(400, "Invalid PAN number"));
    }

    // Return success with verified data
    res.status(200).json(
      new ApiResponse(200, {
        full_name: verifyResp.data?.full_name,
        pan_status: verifyResp.status
      }, "PAN verified successfully")
    );
  } catch (err) {
    console.error("Error verifying PAN:", err);
    res.status(500).json(new ApiError(500, "PAN verification service temporarily unavailable"));
  }
};