import { BankDetails } from "../model/bankDetails.model.js";

// Creating new bank details
export const createBankDetails = async (req, res) => {
  try {
    const {
      vendorid,
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
    } = req.body;

    const panCardPic = req.file?.path;

    if (!panCardPic) {
      return res.status(400).json({
        success: false,
        message: "Pan Card image is required please upload it",
      });
    }

    const newDetails = await BankDetails.create({
      vendorid,
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panCardPic,
    });

    res.status(201).json({
      success: true,
      message: "Bank details Created Successfully",
      data: newDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Getting bank details by vendor ID
export const getBankDetailsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const details = await BankDetails.findOne({ vendorid: vendorId });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Bank Details Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Updating bank details by vendor ID
export const updateBankDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.panCardPic = req.file.path;
    }

    const updated = await BankDetails.findOneAndUpdate(
      { vendorid: vendorId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found to update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Deleting bank details by vendor ID
export const deleteBankDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const deleted = await BankDetails.findOneAndDelete({ vendorid: vendorId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bank details deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
