import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVendor } from "../../redux/VendorSlice.js";
import axios from "axios";

export function UseVendorProfile() {
  const vendor = useSelector((state) => state.vendor.vendor);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    tempAccountNumber: "",
    tempIfscCode: "",
    active: true,
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ 1. The form population logic is extracted into a reusable function.
  // We wrap it in useCallback for optimization.
  const resetForm = useCallback(async () => {
    if (!vendor?._id) return; // Guard clause

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vendors/bank-details/bankDetails`,
        { withCredentials: true }
      );

      const details = res.data.data;

      setForm((prev) => ({
        ...prev,
        fullName: vendor.fullName || "",
        email: vendor.email || "",
        phoneNumber: vendor.phoneNumber || "",
        upiId: details.upiId || "",
        accountNumber: details.accountNumber || "",
        ifscCode: details.ifscCode || "",
        tempAccountNumber: details.accountNumber || "",
        tempIfscCode: details.ifscCode || "",
        active: vendor.active ?? true,
      }));
    } catch (err) {
      console.error(
        "Error fetching bank details:",
        err.response?.data || err.message
      );
    }
  }, [vendor]); // This function depends on the `vendor` object

  // ✅ 2. The useEffect hook is now cleaner. It just calls the reset function.
  useEffect(() => {
    resetForm();
  }, [resetForm]); // It runs whenever the memoized resetForm function changes

  const updateVendor = async () => {
    console.log("before updating the form data to be updated : ", form);

    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/vendors/${vendor._id}`,
      {
        vendorId: vendor._id,
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        active: form.active,
      },
      { withCredentials: true }
    );
    console.log("res from update vendor", res.data.data);
    dispatch(setVendor(res.data.data));
  };

  const updateBank = async () => {
    console.log("before updating bank:", form);
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/vendors/bank-details/${vendor._id}`,
      {
        upiId: form.upiId,
        accountNumber: form.tempAccountNumber,
        ifscCode: form.tempIfscCode,
      },
      { withCredentials: true }
    );
    console.log("updation done:", res.data.data);
    setForm((prev) => ({
      ...prev,
      upiId: res.data.data.upiId,
      accountNumber: res.data.data.accountNumber,
      ifscCode: res.data.data.ifscCode,
    }));
    console.log("after updating bank:", form);
  };

  // ✅ 3. Return the new `resetForm` function so your components can use it.
  return {
    form,
    updateField,
    updateVendor,
    updateBank,
    vendor,
    resetForm,
  };
}
