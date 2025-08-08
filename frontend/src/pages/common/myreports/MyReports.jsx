// frontend/src/pages/customer/MyReport.jsx
import React, { useState } from "react";
import ReportForm from "../../../components/common/report/ReportForm";
const MyReport = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl black-900 font-semibold">My Reports</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-blue-700 font-medium"
        >
          + File New Report
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <ReportForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Existing/Ongoing reports list goes here */}
      <div className="mt-6">
        {/* Map and show report cards later */}
        <p className="text-red-500 italic">You have no ongoing reports.</p>
      </div>
    </div>
  );
};

export default MyReport;
