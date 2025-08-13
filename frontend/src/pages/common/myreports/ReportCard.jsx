import React from "react";

const ReportCard = ({ reason, description, status, createdAt }) => {
  // Status color logic
  const statusColor =
    status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "approved"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
      {/* Reason */}
      <div className="reason_date flex justify-between">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{reason}</h3>
        <p>
          <b>Created</b>: {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
};

export default ReportCard;
