import React from "react";
import { useSelector } from "react-redux";

const VendorAutoFillConfirmModal = ({ onAccept, onDecline }) => {
  const userInfo = useSelector((state) => state.user.user);
  if (!userInfo) {
    console.log("returning from auto fill modal as no userinfo :", userInfo);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-center">
        <h2 className="text-2xl font-bold text-[#001f3f] mb-2">
          Use Existing Information?
        </h2>
        <p className="text-gray-700 mb-4">
          We found these details from your user account:
        </p>

        <ul className="text-left text-sm text-gray-800 mb-4 space-y-1">
          <li>
            <strong>Name:</strong> {userInfo.fullName}
          </li>
          <li>
            <strong>Email:</strong> {userInfo.email}
          </li>
          <li>
            <strong>Phone:</strong> {userInfo.phoneNo || "N/A"}
          </li>
          {/* Add more fields if needed */}
        </ul>

        <p className="text-base font-medium text-gray-800 mb-6">
          Do you want to prefill your vendor form with this information?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            ✅ Yes, Autofill
          </button>
          <button
            onClick={onDecline}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            ❌ No, I'll Enter Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorAutoFillConfirmModal;
