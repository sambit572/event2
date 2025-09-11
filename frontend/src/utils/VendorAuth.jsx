// utils/vendorAuthUtils.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const attemptVendorSilentLogin = async () => {
  console.log("Attempting silent login for vendor...");
  try {
    const response = await axios.get(`${BACKEND_URL}/vendors/silent-login`, {
      withCredentials: true,
    });
    console.log("Silent login response for vendor:", response.data);
    return { success: true, vendor: response.data.data.vendor };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || "Failed" };
  }
};

export const checkVendorEmailStatus = async (email) => {
  console.log("inside check vendor email status ..");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/vendors/check-email`,
      { email },
      { withCredentials: true }
    );
    console.log("response of email status of vendor :", response.data);
    return response.data;
  } catch (err) {
    return { error: err.response?.data?.message || "Email check failed" };
  }
};
