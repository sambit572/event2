// frontend/src/components/shared/ReportForm.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ReportForm = ({ onClose, onSuccess }) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const { selectedType } = location.state || {};
  // console.log("Target Model:", selectedType);
  const currentUser = user?._id;
  // console.log("From ReportForm", currentUser);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      reporterId: currentUser,
      selectedType,
      description: formData.description.trim(),
      reason: formData.reason.trim(),
      status: "pending",
    };
    // console.log(payload);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reports`, payload);
      // console.log("Report submitted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  // };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">File a New Report</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Report Type</label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="Service Issue">Service Issue</option>
            <option value="Vendor Misconduct">Vendor Misconduct</option>
            <option value="User Abuse">User Abuse</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded resize-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 hover:bg-stone-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-stone-900 text-white hover:bg-stone-700"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
