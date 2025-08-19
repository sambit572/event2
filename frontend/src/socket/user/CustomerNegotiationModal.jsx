import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socketClient.js";



const CustomerNegotiationModal = () => {
  const { userDetailsId } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [venueInput, setVenueInput] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [callStarted, setCallStarted] = useState(false);
  const [callStatus, setCallStatus] = useState("Not Started");
  const [proceededWithoutNegotiation, setProceededWithoutNegotiation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // --- socket listeners
  useEffect(() => {
    // Listen for server-sent updates
    socket.on("negotiation_to_vendor", (payload) => {
      console.log("negotiation_to_vendor:", payload);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("negotiation_to_vendor");
    };
  }, []);

  // --- fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await axios.get(
          `${BACKEND}/user/bookings/${userDetailsId}`,
          {
            withCredentials: true,
          }
        );

        // backend might return data as object or [obj]; handle both
        const result = res?.data?.data ?? res?.data ?? null;
        console.log("Fetched booking details:", result);
        const details = Array.isArray(result) ? result[0] : result;

        setBookingDetails(details || null);
        setVenueInput((details && details.address) || "");
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    if (userDetailsId) fetchBookingDetails();
  }, [userDetailsId, BACKEND]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const startTimer = () => setShowTimer(true);

  const emitNegotiation = (negotiationData) => {
    if (!socket.connected) {
      console.log("Connecting to server...");
      console.log("Socket connection status:", socket.connected);
      setTimeout(() => {
        if (!socket.connected) {
          console.log("Still connecting...");
        }
      }, 1000);
      return;
    }

    socket.emit("new-negotiation-request", negotiationData);
    console.log("Negotiation data sent:", negotiationData);
  };

  const handleNegotiate = () => {
    if (!proposedPrice || Number(proposedPrice) <= 0) {
      // Replaces alert
      setErrorMsg("❗ Please enter a valid price.");
      return;
    }

    if (proposedPrice < bookingDetails.serviceDetails.minPrice) {
      setErrorMsg("❗ Please enter a price higher than the minimum price.");
      return;
    }

    const negotiationData = {
      vendorName: bookingDetails?.vendorDetails?.fullName,
      serviceName: bookingDetails?.serviceDetails?.serviceName,
      serviceId: bookingDetails?.serviceDetails?._id,
      vendorId: bookingDetails?.vendorDetails?._id,
      bookedBy: bookingDetails?.bookedBy,
      bookedById: bookingDetails?.bookedById,
      venueLocation: venueInput,
      proposedPrice,
      date: {
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
      },
      originalPriceRange: {
        min: bookingDetails?.serviceDetails?.minPrice,
        max: bookingDetails?.serviceDetails?.maxPrice,
      },
      type: "Negotiation Requested",
    };

    setIsLoading(true);
    setTimeout(() => {
      emitNegotiation(negotiationData);
      // Replaces alert
      alert(`✅ Your price ₹${proposedPrice} has been sent to the vendor!`);
      setErrorMsg("");
      startTimer();
      setIsLoading(false);
    }, 500);
  };

  const handleProceedWithoutNegotiation = () => {
    const negotiationData = {
      vendorName: bookingDetails?.vendorDetails?.fullName,
      serviceName: bookingDetails?.serviceDetails?.serviceName,
      serviceId: bookingDetails?.serviceDetails?._id,
      vendorId: bookingDetails?.vendorDetails?._id,
      bookedBy: bookingDetails?.bookedBy,
      bookedById: bookingDetails?.bookedById,
      venueLocation: venueInput,
      proposedPrice: 0,
      date: {
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
      },
      originalPriceRange: {
        min: bookingDetails?.serviceDetails?.minPrice,
        max: bookingDetails?.serviceDetails?.maxPrice,
      },
      type: "No Negotiation Requested",
    };

    setIsLoading(true);
    setTimeout(() => {
      emitNegotiation(negotiationData);
      // Replaces alert
      alert("🚀 Proceeding with the listed price...");
      setProceededWithoutNegotiation(true);
      setErrorMsg("");
      startTimer();
      setIsLoading(false);
    }, 500);
  };

  const onClose = () => navigate("/userdetails");

  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    if (timeLeft === 0 && showTimer) {
      // Replaces alert
      console.log("⏳ Time expired! Closing the negotiation window.");
      onClose();
    }
    return () => clearTimeout(timer);
  }, [showTimer, timeLeft, onClose]);

  const handleStartCall = () => {
    setCallStatus("Connecting...");
    setCallStarted(true);
    setTimeout(() => setCallStatus("Call Live"), 1500);
  };
  const handleEndCall = () => {
    setCallStatus("Call Ended");
    setCallStarted(false);
  };

  if (!bookingDetails) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-100 flex justify-center items-start font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 border-t-8 border-t-blue-600">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-slate-800">
          Propose Your Negotiated Price
        </h2>

        {/* Replaced individual backgrounds with bottom borders for a cleaner list format */}
        <div className="space-y-4 border-b border-slate-200 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">Agency:</strong>
            <span className="font-semibold text-slate-800 text-right">
              {bookingDetails.serviceDetails?.serviceName.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">Vendor:</strong>
            <span className="font-semibold text-slate-800 text-right">
              {bookingDetails.vendorDetails?.fullName.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              Venue Location:
            </strong>

            {/* We wrap the input and the icon in a container that will manage the tooltip */}
            <div className="relative flex items-center group w-full sm:w-auto flex-grow">
              <input
                type="text"
                placeholder="Enter Your Venue Location"
                value={venueInput}
                onChange={(e) => setVenueInput(e.target.value)}
                className="sm:ml-4 p-2 w-full bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />

              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64
                 bg-slate-800 text-white text-center text-sm rounded-lg p-3
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 invisible group-hover:visible pointer-events-none"
              >
                Please enter the location where you want to hold the event. The
                default location is your home location.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              Date Of Event:
            </strong>
            <span className="font-semibold text-slate-800">
              {`${new Date(
                bookingDetails.startDate
              ).toLocaleDateString()} - ${new Date(
                bookingDetails.endDate
              ).toLocaleDateString()}`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              Listed Price:
            </strong>
            <span className="font-bold text-xl text-blue-600">
              {`₹${bookingDetails.serviceDetails?.minPrice}-₹${bookingDetails.serviceDetails?.maxPrice}`}
            </span>
          </div>
        </div>

        {!showTimer && (
          <>
            <div className="mt-8">
              <label
                htmlFor="proposed-price"
                className="block mb-2 font-semibold text-slate-700"
              >
                Enter Your Price (INR):
              </label>
              <input
                id="proposed-price"
                type="number"
                placeholder={`e.g., ${
                  Math.floor(bookingDetails.serviceDetails?.maxPrice * 0.75) ||
                  "54,00,000"
                }`}
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Enhanced primary button with better colors and hover effects */}
              <button
                className="flex-1 py-3 px-4 text-base rounded-xl border-none cursor-pointer font-semibold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
                                 bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none"
                onClick={handleNegotiate}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send to Vendor"}
              </button>

              {/* Redesigned secondary button for clear visual hierarchy */}
              <button
                className="flex-1 py-3 px-4 text-base rounded-xl border-none cursor-pointer font-semibold uppercase tracking-wider transition-colors duration-300
                                 bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:bg-slate-400"
                onClick={handleProceedWithoutNegotiation}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed Without Negotiation"}
              </button>
            </div>
          </>
        )}

        {/* This timer section remains functionally the same but fits the new aesthetic */}
        {showTimer && (
          <div className="mt-8 text-center bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold mb-2 text-slate-800">
              ⏳{" "}
              {proceededWithoutNegotiation
                ? "Proceeding with listed price..."
                : "Waiting for vendor response..."}
            </h3>
            <p className="text-lg text-slate-600">
              Auto-closing in{" "}
              <strong className="font-bold text-slate-800">
                {formatTime(timeLeft)}
              </strong>
            </p>
            <div className="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000 linear"
                style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {errorMsg && <div className="mt-4 text-red-600">{errorMsg}</div>}
      </div>
    </div>
  );
};

export default CustomerNegotiationModal;
