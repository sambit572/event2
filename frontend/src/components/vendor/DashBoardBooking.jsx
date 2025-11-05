import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant.js";
import BookingPopup from "./BookingPopup.jsx";
import { FaChevronDown } from "react-icons/fa";

const DashBoardBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const vendorId = localStorage.getItem("vendorId") || "";

  useEffect(() => {
    if (!vendorId || !BACKEND_URL) {
      setError("Missing vendor information.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/vendors/vendor-booking/${vendorId}`,
          { withCredentials: true }
        );
        setBookings(res.data?.bookings || []);
      } catch (err) {
        setError("Failed to fetch booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [vendorId]);

  const handleRowClick = (booking) =>
    setClickedRow(clickedRow?._id === booking._id ? null : booking);

  const handleClose = () => setClickedRow(null);

  const sortedBookings = useMemo(() => {
    let sorted = [...bookings];
    const now = new Date();

    switch (sortOption) {
      case "pending":
        sorted = sorted.filter((b) => b.bookingStatus === "PENDING");
        break;
      case "confirmed":
        sorted = sorted.filter((b) => b.bookingStatus === "CONFIRMED");
        break;
      case "completed":
        sorted = sorted.filter((b) => b.bookingStatus === "COMPLETED");
        break;
      case "cancelled":
        sorted = sorted.filter((b) => b.bookingStatus === "CANCELLED");
        break;
      case "last3": {
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        sorted = sorted.filter((b) => new Date(b.startDate) >= threeMonthsAgo);
        break;
      }
      case "last6": {
        const sixMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        );
        sorted = sorted.filter((b) => new Date(b.startDate) >= sixMonthsAgo);
        break;
      }
      default:
        break;
    }

    return sorted;
  }, [bookings, sortOption]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 text-lg font-medium">
        Loading bookings...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 text-lg font-semibold">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen px-4 sm:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start mt-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
          <p className="text-gray-700 text-base sm:text-lg font-medium tracking-wide">
            Track, manage, and review all your bookings in one place.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="mt-5 sm:mt-0 flex justify-center sm:justify-end w-full sm:w-auto relative">
          <div className="relative w-50">
            <select
              className="
        w-full rounded-xl px-4 py-2 border border-transparent
        bg-blue-600 text-white font-medium
        shadow-md cursor-pointer appearance-none
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
        hover:bg-blue-700 hover:shadow-lg
        transition-all duration-300
      "
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option
                className="bg-white text-black hover:bg-gray-100"
                value=""
              >
                All Bookings
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="pending"
              >
                Pending
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="confirmed"
              >
                Confirmed
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="completed"
              >
                Completed
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="cancelled"
              >
                Cancelled
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="last3"
              >
                Last 3 months
              </option>
              <option
                className="bg-white text-black hover:bg-gray-100"
                value="last6"
              >
                Last 6 months
              </option>
            </select>

            {/* Mobile arrow INSIDE the box */}
            <FaChevronDown
              className="
        absolute right-4 top-1/2 -translate-y-1/2 text-white 
        sm:hidden pointer-events-none transition-transform duration-300
      "
            />
          </div>
        </div>
      </div>
      {/* Booking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedBookings.length > 0 ? (
          sortedBookings.map((booking) => (
            <div
              key={booking._id}
              onClick={() => handleRowClick(booking)}
              className="group relative bg-white rounded-2xl border-l-4 border-blue-500 shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 bg-blue-50 opacity-0 transition-opacity duration-300 pointer-events-none"></div>

              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 bg-blue-50 border-b border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.service?.serviceName || "Unnamed Service"}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${getStatusStyle(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              {/* Details */}
              <div className="relative p-5 space-y-3 text-gray-700 text-sm">
                <p>
                  <span className="font-semibold text-gray-800">Customer:</span>{" "}
                  {booking.user?.fullName || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {booking.location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  {new Date(booking.startDate).toLocaleDateString("en-IN")} –{" "}
                  {new Date(booking.endDate).toLocaleDateString("en-IN")}
                </p>
                <p className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-gray-800">Payment:</span>
                  <span className="text-gray-700 font-medium">
                    ₹{booking.amount}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full border transition-all duration-300 ${
                      booking.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : booking.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : booking.paymentStatus === "FAILED"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : booking.paymentStatus === "REFUNDED"
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {booking.paymentStatus || "N/A"}
                  </span>
                </p>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 flex justify-between items-center">
                <p>
                  <span className="font-medium">Txn ID:</span>{" "}
                  {booking.transactionId || "—"}
                </p>
                <p>
                  <span className="font-medium">Payment Mode:</span>{" "}
                  {booking.paymentMode || "N/A"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-12 col-span-3">
            No bookings found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashBoardBooking;
