// frontend/src/pages/customer/MyReport.jsx
import React, { useState } from "react";
import ReportForm from "../../../components/common/report/ReportForm";
import ReportCard from "./ReportCard";
import Spinner from "./../../../components/common/Spinner";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MyReport = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const location = useLocation();
  const { selectedType } = location.state || {};
  // console.log("User ID from MyReport:", userId);
  const capitalizedType =
    selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/reports/${userId}?targetType=${selectedType}`
      );

      // console.log("Backend raw response:", res.data);
      setReports(res.data.data);
      // console.log("Fetched reports:", reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchReports();
  }, [userId]); //Runs only when userId changes

  return (
    <div className="p-6">
      <div className="flex justify-between items-center ">
        <h1 className="max-[400px]:text-xl text -2xl sm:text-3xl black-900 font-semibold">
          {capitalizedType} Reports
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4  max-[400px]:px-2 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors duration-300 "
        >
          + File New Report
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <ReportForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchReports}
          />
        </div>
      )}

      {/* Existing/Ongoing reports list goes here */}
      <div className="mt-6">
        {isLoading && <Spinner />}
        {/* Map and show report cards later */}
        {/* <em className="text-red-500 italic">You have no ongoing reports.</em> */}

        {reports.length === 0 ? (
          <em className="text-red-500 italic">You have no ongoing reports.</em>
        ) : (
          <ul>
            {reports.map((report) => (
              <ReportCard
                key={report._id}
                reason={report.reason}
                description={report.description}
                status={report.status}
                createdAt={report.createdAt}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyReport;
