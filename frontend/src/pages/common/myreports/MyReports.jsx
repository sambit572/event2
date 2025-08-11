// frontend/src/pages/customer/MyReport.jsx
import React, { useState } from "react";
import ReportForm from "../../../components/common/report/ReportForm";
import ReportCard from "./ReportCard";
import Spinner from "./../../../components/common/Spinner";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";

const MyReport = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  console.log("User ID from MyReport:", userId);

  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) return;

    const fetchReports = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/${userId}`
        );

        console.log("Backend raw response:", res.data);
        setReports(res.data.data);
        // console.log("Fetched reports:", reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]); //Runs only when userId changes
  useEffect(() => {
    console.log("Updated reports state:", reports);
  }, [reports]);
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
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyReport;
