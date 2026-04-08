import React, { useState, useEffect } from "react";
import UserSideBar from "./UserSideBar.jsx";
import PasswordInput from "../../../utils/PasswordInput.jsx";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant.js";
import { MdReportGmailerrorred } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  /* -------------------- STATE HOOKS -------------------- */

  // Sidebar state for mobile view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Booking states
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Filter & sorting states
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [filterDate, setFilterDate] = useState("All");
  const [sortOption, setSortOption] = useState("Newest First");

  /* -------------------- RESPONSIVE SIDEBAR -------------------- */
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------- FETCH BOOKINGS -------------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/user-bookings/my-bookings`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) setBookingHistory(res.data.data);
      } catch (err) {
        console.error("Booking fetch failed", err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  /* -------------------- PASSWORD UPDATE -------------------- */
  const handlePasswordChangeSubmit = async () => {
    if (newPassword !== confirmPassword)
      return setErrorMsg("Passwords do not match");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
        setShowPasswordModal(false);
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  /* -------------------- FORMAT DATE -------------------- */
  /* -------------------- FORMAT DATE -------------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* -------------------- DATE FILTER FUNCTION -------------------- */
  const filterByDate = (date) => {
    const d = new Date(date);
    const today = new Date();

    if (filterDate === "This Week") {
      const weekAhead = new Date();
      weekAhead.setDate(today.getDate() + 7);
      return d >= today && d <= weekAhead;
    }
    if (filterDate === "This Month") {
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }
    if (filterDate === "This Year") {
      return d.getFullYear() === today.getFullYear();
    }
    return true;
  };

  /* -------------------- APPLY FILTERS & SORT -------------------- */
  const filteredBookings = bookingHistory
    .filter((b) => filterStatus === "All" || b?.bookingStatus === filterStatus)
    .filter(
      (b) => filterPayment === "All" || b?.paymentStatus === filterPayment
    )
    .filter((b) => filterByDate(b?.userDetailsId?.startDate || b?.startDate))
    .sort((a, b) => {
      const aDate = a?.userDetailsId?.startDate || a?.startDate;
      const bDate = b?.userDetailsId?.startDate || b?.startDate;

      if (sortOption === "Newest First")
        return new Date(bDate) - new Date(aDate);
      if (sortOption === "Oldest First")
        return new Date(aDate) - new Date(bDate);
      if (sortOption === "Highest Amount") return b.amount - a.amount;
      if (sortOption === "Lowest Amount") return a.amount - b.amount;
      return 0;
    });

  /* -------------------- HANDLE BOOKING CLICK -------------------- */
  const handleBookingClick = (booking) => {
    const { reDirectTo, userDetailsId } = booking;
    console.log("Booking clicked:", booking);

    switch (reDirectTo) {
      case 1:
        // Navigate to negotiation modal
        navigate(`/pop-up/${userDetailsId?._id}`);
        break;
      case 2:
        // Navigate to order summary page
        navigate(`/order-summary/${userDetailsId?._id}`);
        break;
      default:
        console.error("Invalid reDirectTo value:", reDirectTo);
    }
  };

  return (
    <div className="profile_section relative w-full flex bg-white">
      {/* ✅ Password Success Notification */}
      {showSuccessPopup && (
        <div className="fixed top-[115px] left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg bg-green-600 text-white font-semibold z-[9999]">
          ✅ Password updated successfully!
        </div>
      )}

      {/* ✅ Sidebar */}
      <div className="profile-sidebar-fixed">
        <button
          className="profile-hamburger lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md"
          onClick={() => setIsSidebarOpen((p) => !p)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
        <UserSideBar
          isOpen={isSidebarOpen}
          setShowPasswordModal={setShowPasswordModal}
        />
      </div>

      {/* ✅ Main Content */}
      <div className="profile-scrollable-content ml-0 lg:ml-8 w-full p-4">
        <h2 className="text-3xl font-bold text-center mb-6">My Bookings</h2>

        {/* ================= Filter + Sort UI ================= */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4 ">
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "Booking",
                value: filterStatus,
                setter: setFilterStatus,
                options: [
                  "All",
                  "CONFIRMED",
                  "COMPLETED",
                  "CANCELLED",
                  "PENDING",
                ],
              },
              {
                label: "Payment",
                value: filterPayment,
                setter: setFilterPayment,
                options: ["All", "PAID", "PENDING", "FAILED"],
              },
              {
                label: "Event",
                value: filterDate,
                setter: setFilterDate,
                options: ["All", "This Week", "This Month", "This Year"],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="filter-sort-box flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="text-sm font-semibold text-amber-700">
                  {item.label}:
                </span>
                <select
                  className="text-sm bg-transparent text-gray-800 font-medium outline-none cursor-pointer pr-4 border-none focus:ring-0"
                  style={{ appearance: "none" }}
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                >
                  {item.options.map((o) => (
                    <option key={o} className="text-gray-800 bg-white">
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* ✅ Sort Dropdown */}
          <div className="filter-sort-box flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-50 border border-blue-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-sm font-semibold text-blue-700">Sort:</span>
            <select
              className="text-sm bg-transparent text-gray-800 font-medium outline-none cursor-pointer pr-4 border-none focus:ring-0"
              style={{ appearance: "none" }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option className="text-gray-800 bg-white">Newest First</option>
              <option className="text-gray-800 bg-white">Oldest First</option>
              <option className="text-gray-800 bg-white">Highest Amount</option>
              <option className="text-gray-800 bg-white">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* ✅ Booking Cards */}
        <div className="h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {loadingBookings ? (
            <p className="text-center text-lg font-semibold">
              Loading bookings...
            </p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-center text-lg font-semibold">
              No bookings found
            </p>
          ) : (
            filteredBookings.map((b, i) => (
              <div
                key={i}
                onClick={() => handleBookingClick(b)}
                className="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row gap-6 p-6 mb-6 bg-[#F8FAFD] rounded-2xl shadow-md border border-gray-400 hover:shadow-xl transition-all hover:scale-[0.98] cursor-pointer"
              >
                {/* Booking Icon/Visual */}
                <div className="w-full md:w-40 h-40 md:h-36 rounded-xl overflow-hidden shrink-0 mx-auto md:mx-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-4xl font-bold">
                      {b?.totalServices || 0}
                    </p>
                    <p className="text-sm mt-1">
                      Service{b?.totalServices !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-lg md:text-xl font-bold text-[#001F3F] mb-2">
                    Booking Session
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-[15px]">
                    {/* Left info */}
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {b?.userDetailsId?.address || b?.location}
                      </p>
                      <p className="font-semibold">Event Period:</p>
                      <p>
                        Start:{" "}
                        {formatDate(
                          b?.userDetailsId?.startDate || b?.startDate
                        )}
                      </p>
                      <p>
                        End:{" "}
                        {formatDate(b?.userDetailsId?.endDate || b?.endDate)}
                      </p>
                      <p>
                        <span className="font-semibold">Total Services:</span>{" "}
                        <span className="text-blue-700 font-bold">
                          {b?.totalServices || 0}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span className="text-blue-700 font-bold">
                          {b?.bookingStatus}
                        </span>
                      </p>
                    </div>

                    {/* Right info */}
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">Total Amount:</span> ₹
                        {b?.amount?.toLocaleString("en-IN") || 0}
                      </p>
                      <p>
                        <span className="font-semibold">Payment Mode:</span>{" "}
                        {b?.paymentMode}
                      </p>
                      <p className="font-semibold">
                        Payment:
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-bold rounded-lg 
                ${
                  b?.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : b?.paymentStatus === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                        >
                          {b?.paymentStatus}
                        </span>
                      </p>
                      {b?.transactionId && (
                        <p className="text-xs text-gray-600">
                          Txn: {b.transactionId.substring(0, 12)}...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500">
                      Click to view details
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        navigate("/report", {
                          state: { selectedType: "user" },
                        });
                      }}
                      className="bg-[#001F3F] hover:bg-[#003165] text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <MdReportGmailerrorred size={20} /> Report
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>

            <PasswordInput
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <PasswordInput
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errorMsg && (
              <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            )}

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handlePasswordChangeSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
