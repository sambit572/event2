import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socketClient.js";

const CustomerNegotiationModal = () => {
  const { userDetailsId } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [venueInput, setVenueInput] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [proceededWithoutNegotiation, setProceededWithoutNegotiation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // Get current selected service and vendor
  const getCurrentService = () => serviceDetails[selectedServiceIndex] || null;
  const getCurrentVendor = () => vendorDetails[selectedServiceIndex] || null;
  const isMultipleServices = () => serviceDetails.length > 1;

  // Socket listeners
  useEffect(() => {
    socket.on("negotiation_to_vendor", (payload) => {
      console.log("negotiation_to_vendor:", payload);
    });

    return () => {
      socket.off("negotiation_to_vendor");
    };
  }, []);

  // Fetch booking details with embedded service/vendor data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setDataLoading(true);

        // Single API call to get booking with all services and vendors
        const bookingRes = await axios.get(
          `${BACKEND}/user/bookings/${userDetailsId}`,
          { withCredentials: true }
        );

        const result = bookingRes?.data?.data ?? bookingRes?.data ?? null;
        // console.log("Fetched  result1111:", result);
        const details = Array.isArray(result) ? result[0] : result;
        // console.log("Fetched details:", details);
        if (!details) {
          throw new Error("No booking details found");
        }

        setBookingDetails(details);
        setVenueInput(details.address || "");

        // Extract services and vendors from the optimized response
        const services = details.serviceDetails || [];
        const vendors = services
          .map((service) => service.vendorDetails)
          .filter(Boolean);

        // console.log("Extracted services:", services);
        // console.log("Extracted vendors:", vendors);

        setServiceDetails(services);
        setVendorDetails(vendors);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("❗ Failed to load booking details. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    if (userDetailsId) fetchAllData();
  }, [userDetailsId, BACKEND]);
  // console.log("Fetched booking details:", bookingDetails);

  // Timer functions
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

  // Handle service selection change
  const handleServiceChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setSelectedServiceIndex(newIndex);
    setProposedPrice(""); // Clear proposed price when switching services
    setErrorMsg(""); // Clear any error messages
  };

  // Send negotiation for current selected service
  const handleNegotiate = () => {
    const currentService = getCurrentService();
    const currentVendor = getCurrentVendor();

    if (!currentService || !currentVendor) {
      setErrorMsg("❗ Service or vendor information not found.");
      return;
    }

    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setErrorMsg("❗ Please enter a valid price.");
      return;
    }

    if (proposedPrice < currentService.minPrice) {
      setErrorMsg("❗ Please enter a price higher than the minimum price.");
      return;
    }
    // console.log("Current service:", currentService);
    // console.log("Current vendor:", currentVendor);
    // console.log("Booking details:", bookingDetails);
    const negotiationData = {
      vendorId: currentVendor._id,
      vendorName: currentVendor.fullName,
      vendorEmail: currentVendor.email,
      vendorPhoneNumber: currentVendor.phone,
      vendorLocation: currentService?.stateLocationOffered,

      serviceId: currentService._id,
      serviceType: currentService.serviceCategory,
      serviceName: currentService.serviceName,

      bookedByUserId: bookingDetails.bookedById,
      bookedByUser: bookingDetails.bookedBy,
      bookedByUserEmail: bookingDetails.userEmail,
      bookedByUserPhoneNumber: bookingDetails.phone,
      bookedByUserAltPhoneNumber: bookingDetails.altPhone,

      venueLocation: venueInput,
      proposedPrice: proposedPrice,

      date: {
        startDate: new Date(bookingDetails.startDate),
        endDate: new Date(bookingDetails.endDate),
      },

      originalPriceRange: {
        min: currentService.minPrice,
        max: currentService.maxPrice,
      },
    };

    setIsLoading(true);
    setTimeout(() => {
      emitNegotiation(negotiationData);
      alert(
        `✅ Your price ₹${proposedPrice} has been sent to ${
          currentVendor.fullName || currentVendor.name
        } for ${currentService.serviceName || currentService.name}!`
      );
      setErrorMsg("");
      setIsLoading(false);
      navigate(`/order-summary/${userDetailsId}`);
    }, 500);
  };
  // console.log("NegotiationData", negotiationData);
  // Send all services without negotiation
  const handleProceedWithoutNegotiation = () => {
    setIsLoading(true);

    // Send negotiation data for each service
    serviceDetails.forEach((service, index) => {
      const vendor = vendorDetails[index];

      if (!service || !vendor) {
        console.warn(`Missing service or vendor data at index ${index}`);
        return;
      }

      const negotiationData = {
        vendorName: vendor.fullName || vendor.name,
        serviceName: service.serviceName || service.name,
        serviceId: service._id?.$oid || service._id,
        vendorId: vendor._id?.$oid || vendor._id,
        bookedBy: bookingDetails.bookedBy,
        bookedById:
          bookingDetails.bookedById?.$oid || bookingDetails.bookedById,
        venueLocation: venueInput,

        vendorLocation: service?.stateLocationOffered,
        proposedPrice: 0,
        date: {
          startDate:
            bookingDetails.startDate?.$date || bookingDetails.startDate,
          endDate: bookingDetails.endDate?.$date || bookingDetails.endDate,
        },
        originalPriceRange: {
          min: service.minPrice,
          max: service.maxPrice,
        },
        type: "No Negotiation Requested",
      };

      // Add small delay between emissions for multiple services
      setTimeout(() => {
        emitNegotiation(negotiationData);
      }, index * 100);
    });

    setTimeout(() => {
      alert("🚀 Proceeding with the listed prices for all services...");
      setProceededWithoutNegotiation(true);
      setErrorMsg("");
      setIsLoading(false);
      navigate(`/order-summary/${userDetailsId}`);
    }, 500);
  };

  const onClose = () => navigate("/userdetails");

  // Timer effect
  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    if (timeLeft === 0 && showTimer) {
      console.log("⏳ Time expired! Closing the negotiation window.");
      onClose();
    }
    return () => clearTimeout(timer);
  }, [showTimer, timeLeft, onClose]);

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-xl text-slate-600 mb-4">
            Loading booking details...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!bookingDetails || serviceDetails.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-xl text-red-600 mb-4">
            ❗ Unable to load booking details
          </div>
          <button
            onClick={() => navigate("/userdetails")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentService = getCurrentService();
  const currentVendor = getCurrentVendor();

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-100 flex justify-center items-start font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 border-t-8 border-t-blue-600">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-slate-800">
          Propose Your Negotiated Price
        </h2>

        {/* Service Selection Dropdown - Only show if multiple services */}
        {isMultipleServices() && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label
              htmlFor="service-select"
              className="block mb-2 font-semibold text-blue-800"
            >
              Select Service to Negotiate:
            </label>
            <select
              id="service-select"
              value={selectedServiceIndex}
              onChange={handleServiceChange}
              className="w-full p-3 bg-white border-2 border-blue-300 rounded-xl text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              {serviceDetails.map((service, index) => (
                <option
                  key={service._id?.$oid || service._id || index}
                  value={index}
                >
                  {service.serviceName || service.name} - ₹{service.minPrice}-₹
                  {service.maxPrice}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Booking Details */}
        <div className="space-y-4 border-b border-slate-200 pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              {isMultipleServices() ? "Selected Service:" : "Service:"}
            </strong>
            <span className="font-semibold text-slate-800 text-right">
              {(
                currentService?.serviceName ||
                currentService?.name ||
                "N/A"
              ).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">Vendor:</strong>
            <span className="font-semibold text-slate-800 text-right">
              {(
                currentVendor?.fullName ||
                currentVendor?.name ||
                "N/A"
              ).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              Venue Location:
            </strong>
            <div className="relative flex items-center group w-full sm:w-auto flex-grow">
              <input
                type="text"
                placeholder="Enter Your Venue Location"
                value={venueInput}
                onChange={(e) => setVenueInput(e.target.value)}
                className="sm:ml-4 p-2 w-full bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-center text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible pointer-events-none">
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
                bookingDetails.startDate?.$date || bookingDetails.startDate
              ).toLocaleDateString()} - ${new Date(
                bookingDetails.endDate?.$date || bookingDetails.endDate
              ).toLocaleDateString()}`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
            <strong className="text-slate-500 mb-1 sm:mb-0">
              Listed Price:
            </strong>
            <span className="font-bold text-xl text-blue-600">
              {currentService
                ? `₹${currentService.minPrice}-₹${currentService.maxPrice}`
                : "N/A"}
            </span>
          </div>

          {/* Show total services count if multiple */}
          {isMultipleServices() && (
            <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2">
              <strong className="text-slate-500 mb-1 sm:mb-0">
                Total Services:
              </strong>
              <span className="font-semibold text-slate-800">
                {serviceDetails.length} services booked
              </span>
            </div>
          )}
        </div>

        {!showTimer && (
          <>
            <div className="mt-8">
              <label
                htmlFor="proposed-price"
                className="block mb-2 font-semibold text-slate-700"
              >
                Enter Your Price for{" "}
                {isMultipleServices() ? "Selected Service" : "This Service"}{" "}
                (INR):
              </label>
              <input
                id="proposed-price"
                type="number"
                placeholder={`e.g., ${Math.floor(
                  (currentService?.maxPrice || 100000) * 0.75
                )}`}
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              {isMultipleServices() && (
                <p className="text-sm text-slate-500 mt-2">
                  💡 You can negotiate each service individually. Use the
                  dropdown above to switch between services.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 py-3 px-4 text-base rounded-xl border-none cursor-pointer font-semibold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none"
                onClick={handleNegotiate}
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending..."
                  : `Send to ${
                      currentVendor?.fullName || currentVendor?.name || "Vendor"
                    }`}
              </button>

              <button
                className="flex-1 py-3 px-4 text-base rounded-xl border-none cursor-pointer font-semibold uppercase tracking-wider transition-colors duration-300 bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:bg-slate-400"
                onClick={handleProceedWithoutNegotiation}
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : `Proceed Without Negotiation${
                      isMultipleServices() ? " (All Services)" : ""
                    }`}
              </button>
            </div>

            {isMultipleServices() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  📝 <strong>Note:</strong> "Send to Vendor" will negotiate only
                  the selected service. "Proceed Without Negotiation" will
                  confirm all {serviceDetails.length} services at their listed
                  prices.
                </p>
              </div>
            )}
          </>
        )}

        {/* Timer Section */}
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

        {/* Error Messages */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNegotiationModal;
