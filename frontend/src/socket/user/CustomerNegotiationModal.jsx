import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socketClient.js";

const CustomerNegotiationModal = () => {
  const { userDetailsId } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [groupedServices, setGroupedServices] = useState([]); // ✅ NEW: Services grouped by serviceId
  const [venueInput, setVenueInput] = useState("");
  const [proposedPrices, setProposedPrices] = useState({}); // ✅ NEW: Map of itemId -> price
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [proceededWithoutNegotiation, setProceededWithoutNegotiation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const updateUserBookingHistory = async (userDetailsId, venueInput) => {
    const payload = {
      userDetailsId,
      reDirectTo: 2,
      venueInput,
    };

    console.log("Updating user booking history with payload:", payload);

    try {
      await axios.put(`${BACKEND}/user-bookings/update-history`, payload, {
        withCredentials: true,
      });

      return true;
    } catch (error) {
      console.error("Error updating user booking history:", error);
      return false;
    }
  };

  // ✅ NEW: Get current service group
  const getCurrentServiceGroup = () =>
    groupedServices[selectedServiceIndex] || null;
  const isMultipleServiceGroups = () => groupedServices.length > 1;

  //time Date display function
  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "N/A";

    // Handle MongoDB $date object
    if (dateValue.$date) {
      dateValue = dateValue.$date;
    }

    // ✅ CRITICAL FIX: Parse ISO string directly without Date object
    let dateStr =
      typeof dateValue === "string"
        ? dateValue
        : new Date(dateValue).toISOString();

    // Extract YYYY-MM-DD from the ISO string
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return "N/A";

    const [_, year, month, day] = match;

    // Return in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  };

  // Socket listeners
  useEffect(() => {
    socket.on("negotiation_to_vendor", (payload) => {
      console.log("negotiation_to_vendor:", payload);
    });

    return () => {
      socket.off("negotiation_to_vendor");
    };
  }, []);

  // ✅ NEW: Fetch and group services by serviceId
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setDataLoading(true);

        const bookingRes = await axios.get(
          `${BACKEND}/user/bookings/${userDetailsId}`,
          { withCredentials: true }
        );

        const result = bookingRes?.data?.data ?? bookingRes?.data ?? null;
        const details = Array.isArray(result) ? result[0] : result;

        if (!details) {
          throw new Error("No booking details found");
        }

        console.log("📦 Fetched booking details:", details);
        setBookingDetails(details);
        setVenueInput(details.address || "");

        // ✅ NEW: Group items by service
        const serviceGroups = new Map();

        if (details.cartItems && details.cartItems.length > 0) {
          console.log(`✅ Found ${details.cartItems.length} cart items`);

          details.serviceDetails.forEach((service) => {
            const matchingCartItems = details.cartItems.filter(
              (item) => item.serviceId.toString() === service._id.toString()
            );

            if (matchingCartItems.length > 0) {
              const items = matchingCartItems.map((cartItem) => ({
                cartItemId: cartItem._id,
                isCateringService: cartItem.isCateringService,
                cateringDetails: cartItem.cateringDetails,
              }));

              // ✅ CRITICAL FIX: Use service.vendorDetails directly
              const vendorData = service.vendorDetails || {};

              console.log(`📋 Service: ${service.serviceName}`, {
                vendorId: vendorData._id,
                vendorName: vendorData.fullName,
                vendorBusinessName: vendorData.businessName,
              });

              serviceGroups.set(service._id.toString(), {
                service: service,
                vendor: vendorData, // ✅ FIXED: Use vendorDetails directly
                items: items,
              });
            } else {
              // Regular service without cart details
              serviceGroups.set(service._id.toString(), {
                service: service,
                vendor: service.vendorDetails || {}, // ✅ FIXED
                items: [
                  {
                    cartItemId: null,
                    isCateringService: false,
                    cateringDetails: null,
                  },
                ],
              });
            }
          });
        } else {
          // Fallback: use service details only
          console.log("⚠️ No cart items found, using service details");
          details.serviceDetails.forEach((service) => {
            serviceGroups.set(service._id.toString(), {
              service: service,
              vendor: service.vendorDetails || {}, // ✅ FIXED
              items: [
                {
                  cartItemId: null,
                  isCateringService: false,
                  cateringDetails: null,
                },
              ],
            });
          });
        }

        const groupedArray = Array.from(serviceGroups.values());

        // ✅ ADD DEBUGGING
        console.log(`✅ Grouped into ${groupedArray.length} services`);
        groupedArray.forEach((group, index) => {
          console.log(`Service ${index}:`, {
            serviceName: group.service.serviceName,
            vendorName: group.vendor?.fullName,
            vendorBusinessName: group.vendor?.businessName,
            itemCount: group.items.length,
          });
        });

        setGroupedServices(groupedArray);

        // Initialize proposed prices
        const initialPrices = {};
        groupedArray.forEach((group) => {
          group.items.forEach((item) => {
            if (item.cartItemId) {
              initialPrices[item.cartItemId] = "";
            } else {
              // ✅ MODIFIED: Use service ID as key for non-cart items (regular services)
              initialPrices[group.service._id] = "";
            }
          });
        });
        setProposedPrices(initialPrices);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("❗ Failed to load booking details. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    if (userDetailsId) fetchAllData();
  }, [userDetailsId, BACKEND]);

  // Timer functions
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const emitNegotiation = (negotiationData) => {
    return new Promise((resolve, reject) => {
      if (!socket.connected) {
        console.log("Socket not connected");
        reject("Socket not connected");
      }

      console.log("Preparing to send negotiation data:", negotiationData);

      const requiredFields = [
        "vendorId",
        "vendorName",
        "vendorEmail",
        "vendorPhoneNumber",
        "vendorLocation",
        "serviceName",
        "serviceId",
        "bookedByUserId",
        "bookedByUser",
        "bookedByUserEmail",
        "bookedByUserPhoneNumber",
        "bookedByUserAltPhoneNumber",
        "venueLocation",
        "date.startDate",
        "date.endDate",
        "originalPriceRange.min",
        "originalPriceRange.max",
      ];

      const getValue = (obj, path) =>
        path.split(".").reduce((acc, key) => acc?.[key], obj);

      const missingFields = requiredFields.filter((field) => {
        const value = getValue(negotiationData, field);
        return (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        );
      });

      if (missingFields.length > 0) {
        console.error("❌ Missing required negotiation data:", missingFields);
        reject("Missing required negotiation data");
        return;
      }

      // ✅ Emit only if all required fields are valid
      socket.emit("new-negotiation-request", negotiationData);
      console.log("✅ Negotiation data sent:", negotiationData);
      resolve("Negotiation data sent successfully");
    });
  };

  // ✅ NEW: Handle service group selection
  const handleServiceGroupChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setSelectedServiceIndex(newIndex);
    setErrorMsg("");
  };

  // ✅ NEW: Handle price change for specific item
  const handlePriceChange = (itemId, value) => {
    setProposedPrices((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  // ✅ NEW: Negotiate all items in current service group
  const handleNegotiateServiceGroup = async () => {
    const currentGroup = getCurrentServiceGroup();
    if (!currentGroup) {
      setErrorMsg("❗ Service information not found.");
      return;
    }

    const { service, vendor, items } = currentGroup;
    if (!service || !vendor) {
      setErrorMsg("❗ Service or vendor information not found.");
      return;
    }

    // Validate all items have prices
    const itemsToNegotiate = items.filter((item) => item.cateringDetails);
    const allHavePrices = itemsToNegotiate.every((item) => {
      const price = proposedPrices[item.cartItemId];
      return price && Number(price) > 0;
    });

    if (itemsToNegotiate.length > 0 && !allHavePrices) {
      setErrorMsg("❗ Please enter a valid price for all selected packages.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Collect promises for all emits
      const negotiationPromises = items.map((item) => {
        let negotiationData = null;
        let proposedPrice = 0;

        if (item.cateringDetails) {
          const { packageName, plateCount, pricePerPlate, totalPrice } =
            item.cateringDetails;
          proposedPrice = proposedPrices[item.cartItemId];

          const minValidation = totalPrice * 0.5;
          if (proposedPrice < minValidation) {
            throw new Error(
              `❗ Price for ${packageName} too low. Minimum: ₹${Math.floor(
                minValidation
              )}`
            );
          }

          console.log("Service data for negotiation data11111:", service);

          negotiationData = {
            vendorId: vendor._id,
            vendorName: vendor.fullName,
            vendorEmail: vendor.email,
            vendorPhoneNumber: vendor.phone,
            vendorLocation: service?.stateLocationOffered,
            serviceId: service._id,
            serviceType: service.serviceCategory,

            serviceName: service.serviceName,
            bookedByUserId: bookingDetails.bookedById,
            bookedByUser: bookingDetails.bookedBy,
            bookedByUserEmail: bookingDetails.userEmail,
            bookedByUserPhoneNumber: bookingDetails.phone,
            bookedByUserAltPhoneNumber: bookingDetails.altPhone,
            venueLocation: venueInput,
            proposedPrice,
            date: {
              startDate: new Date(bookingDetails.startDate),
              endDate: new Date(bookingDetails.endDate),
            },
            originalPriceRange: { min: totalPrice, max: totalPrice },
            packageName,
            plateCount,
            pricePerPlate,
            totalPrice,
          };
        } else {
          proposedPrice = proposedPrices[service._id] || 0;

          if (!proposedPrice || Number(proposedPrice) <= 0)
            throw new Error("❗ Please enter a valid price for this service.");

          const minValidation = (service.minPrice || 0) * 0.5;
          if (Number(proposedPrice) < minValidation)
            throw new Error(
              `❗ Price for ${
                service.serviceName
              } too low. Minimum: ₹${Math.floor(minValidation)}`
            );

          console.log("Service data for negotiation data:", service);
          negotiationData = {
            vendorId: vendor._id,
            vendorName: vendor.fullName,
            vendorEmail: vendor.email,
            vendorPhoneNumber: vendor.phone,
            vendorLocation: service?.stateLocationOffered,
            serviceId: service._id,
            serviceType: service.serviceCategory,

            serviceName: service.serviceName,
            bookedByUserId: bookingDetails.bookedById,
            bookedByUser: bookingDetails.bookedBy,
            bookedByUserEmail: bookingDetails.userEmail,
            bookedByUserPhoneNumber: bookingDetails.phone,
            bookedByUserAltPhoneNumber: bookingDetails.altPhone,
            venueLocation: venueInput,
            proposedPrice,
            date: {
              startDate: new Date(bookingDetails.startDate),
              endDate: new Date(bookingDetails.endDate),
            },
            originalPriceRange: {
              min: service.minPrice || 0,
              max: service.maxPrice || 0,
            },
          };
        }

        return emitNegotiation(negotiationData);
      });

      // Wait for all negotiations to complete
      await Promise.all(negotiationPromises);

      const packageCount = itemsToNegotiate.length;
      const message =
        packageCount > 1
          ? `✅ Your prices for ${packageCount} packages have been sent to ${vendor.fullName}!`
          : `✅ Your price has been sent to ${vendor.fullName}!`;

      alert(message);
      console.log("Venueinput:", venueInput);
      const update = await updateUserBookingHistory(userDetailsId, venueInput);
      if (update) {
        navigate(`/order-summary/${userDetailsId}`);
      }
    } catch (error) {
      console.error("Negotiation error:", error);
      setErrorMsg(
        error.message || "❗ Something went wrong, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Proceed without negotiation for all services
  const handleProceedWithoutNegotiation = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const negotiationPromises = [];

      for (const group of groupedServices) {
        const { service, vendor, items } = group;

        if (!service || !vendor) {
          console.warn("❗ Missing service or vendor data, skipping group.");
          continue;
        }

        for (const item of items) {
          let minPrice = 0;
          let maxPrice = 0;
          let cateringInfo = {};

          if (item.cateringDetails) {
            const { totalPrice, packageName, plateCount, pricePerPlate } =
              item.cateringDetails;
            minPrice = totalPrice;
            maxPrice = totalPrice;
            cateringInfo = {
              packageName,
              plateCount,
              pricePerPlate,
              totalPrice,
            };
          } else {
            minPrice = service.minPrice || 0;
            maxPrice = service.maxPrice || 0;
          }

          const negotiationData = {
            vendorId: vendor._id,
            vendorName: vendor.fullName,
            vendorEmail: vendor.email,
            vendorPhoneNumber: vendor.phone,
            vendorLocation: service?.stateLocationOffered || "Not Specified",
            serviceId: service._id,
            serviceType: service.serviceCategory,

            serviceName: service.serviceName,
            bookedByUserId: bookingDetails.bookedById,
            bookedByUser: bookingDetails.bookedBy,
            bookedByUserEmail: bookingDetails.userEmail,
            bookedByUserPhoneNumber: bookingDetails.phone,
            bookedByUserAltPhoneNumber: bookingDetails.altPhone,
            venueLocation: venueInput,
            proposedPrice: 0,
            date: {
              startDate: new Date(bookingDetails.startDate),
              endDate: new Date(bookingDetails.endDate),
            },
            originalPriceRange: {
              min: minPrice,
              max: maxPrice,
            },
            type: "No Negotiation Requested",
            ...cateringInfo,
          };

          // push each emit promise
          negotiationPromises.push(emitNegotiation(negotiationData));
        }
      }

      // Wait for all emits to finish
      await Promise.all(negotiationPromises);

      alert("🚀 Proceeding with the listed prices for all items...");
      setProceededWithoutNegotiation(true);
      const updateResult = await updateUserBookingHistory(
        userDetailsId,
        venueInput
      );
      if (updateResult) {
        navigate(`/order-summary/${userDetailsId}`);
      }
    } catch (error) {
      console.error("❌ Proceed without negotiation failed:", error);
      setErrorMsg(error.message || "Something went wrong while sending data.");
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => navigate("/userdetails");

  // Timer effect
  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    if (timeLeft === 0 && showTimer) {
      console.log("⏳ Time expired!");
      onClose();
    }
    return () => clearTimeout(timer);
  }, [showTimer, timeLeft]);

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

  if (!bookingDetails || groupedServices.length === 0) {
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

  const currentGroup = getCurrentServiceGroup();
  const currentService = currentGroup?.service;
  const currentVendor = currentGroup?.vendor;
  const currentItems = currentGroup?.items || [];

  // Calculate total for current service group
  const groupTotal = currentItems.reduce((sum, item) => {
    if (item.cateringDetails) {
      return sum + item.cateringDetails.totalPrice;
    }
    return sum + (currentService?.minPrice || 0);
  }, 0);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-100 flex justify-center items-start font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 border-t-8 border-t-blue-600">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-slate-800">
          Propose Your Negotiated Price
        </h2>

        {/* ✅ NEW: Service Group Selection */}
        {isMultipleServiceGroups() && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label
              htmlFor="service-group-select"
              className="block mb-2 font-semibold text-blue-800"
            >
              Select Service to Negotiate:
            </label>
            <select
              id="service-group-select"
              value={selectedServiceIndex}
              onChange={handleServiceGroupChange}
              className="w-full p-3 bg-white border-2 border-blue-300 rounded-xl text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              {groupedServices.map((group, index) => {
                const itemCount = group.items.filter(
                  (i) => i.cateringDetails
                ).length;
                const label =
                  itemCount > 1
                    ? `${group.service.serviceName} (${itemCount} packages)`
                    : group.service.serviceName;

                return (
                  <option key={index} value={index}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* ✅ NEW: Service Details Header */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            {currentService?.serviceName || "Service"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600 font-medium">Vendor:</span>
              <span className="ml-2 font-semibold text-slate-800">
                {/* ✅ FIXED: Try multiple vendor name fields */}
                {currentVendor?.businessName ||
                  currentVendor?.fullName ||
                  currentVendor?.name ||
                  "Unknown Vendor"}
              </span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Date:</span>
              <span className="ml-2 font-semibold text-slate-800">
                {formatDateForDisplay(bookingDetails.startDate)} -{" "}
                {formatDateForDisplay(bookingDetails.endDate)}
              </span>
            </div>
          </div>
        </div>
        {/* ✅ NEW: Show all packages for current service */}
        {currentItems.some((item) => item.cateringDetails) && (
          <div className="mb-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-800 mb-3">
              🍽️ Selected Packages (
              {currentItems.filter((i) => i.cateringDetails).length})
            </h4>

            {currentItems.map((item, itemIndex) => {
              if (!item.cateringDetails) return null;

              const { packageName, plateCount, pricePerPlate, totalPrice } =
                item.cateringDetails;
              const itemId = item.cartItemId;

              return (
                <div
                  key={itemIndex}
                  className="bg-green-50 rounded-xl border-2 border-green-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-green-800 text-lg">
                        {packageName}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {plateCount} plates @ ₹{pricePerPlate}/plate
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">
                        Listed Price
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{totalPrice}/-
                      </span>
                    </div>
                  </div>

                  {/* Price Input for this package */}
                  <div className="mt-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Negotiated Price for this package:
                    </label>
                    <input
                      type="number"
                      placeholder={`e.g., ${Math.floor(totalPrice * 0.9)}`}
                      value={proposedPrices[itemId] || ""}
                      onChange={(e) =>
                        handlePriceChange(itemId, e.target.value)
                      }
                      className="w-full p-3 bg-white border-2 border-green-300 rounded-lg text-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Minimum acceptable: ₹{Math.floor(totalPrice * 0.5)}
                    </p> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ Regular Service Display */}
        {!currentItems.some((item) => item.cateringDetails) && (
          <>
            {/* ✅ MODIFIED: Wrap in fragment and handle undefined */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">
                  Listed Price:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{currentService?.minPrice || 0}-₹
                  {currentService?.maxPrice || 0}
                </span>
              </div>
            </div>

            {/* ✅ NEW: Input for Regular Service (as requested) */}
            <div className="mb-6">
              <label
                htmlFor="proposed-price-regular"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Enter Your Price for This Service (INR):
              </label>
              <input
                id="proposed-price-regular"
                type="number"
                placeholder={`e.g., ${Math.floor(
                  (currentService?.maxPrice || 0) * 0.8
                )}`}
                value={proposedPrices[currentService._id] || ""}
                onChange={(e) =>
                  handlePriceChange(currentService._id, e.target.value)
                }
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </>
        )}

        {/* Venue Location */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-slate-700">
            Venue Location:
          </label>
          <input
            type="text"
            placeholder="Enter Your Venue Location"
            value={venueInput}
            onChange={(e) => setVenueInput(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* ✅ Summary Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600 font-medium">Total Items:</span>
            <span className="font-semibold text-slate-800">
              {currentItems.filter((i) => i.cateringDetails).length || 1}{" "}
              item(s)
            </span>
          </div>
          {currentItems.some((item) => item.cateringDetails) && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">
                Group Total (Listed):
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{groupTotal}/-
              </span>
            </div>
          )}
        </div>

        {!showTimer && (
          <>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 py-4 px-6 text-base rounded-xl border-none cursor-pointer font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none"
                onClick={handleNegotiateServiceGroup}
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending..."
                  : `Send to ${currentVendor?.fullName}`}
              </button>

              <button
                className="flex-1 py-4 px-6 text-base rounded-xl border-none cursor-pointer font-bold uppercase tracking-wider transition-colors duration-300 bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:bg-slate-400"
                onClick={handleProceedWithoutNegotiation}
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : `Proceed Without Negotiation${
                      isMultipleServiceGroups() ? " (All)" : ""
                    }`}
              </button>
            </div>

            {isMultipleServiceGroups() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  📝 <strong>Note:</strong> "Send to Vendor" negotiates all
                  packages in the selected service. "Proceed Without
                  Negotiation" confirms all services at listed prices.
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
                ? "Proceeding..."
                : "Waiting for response..."}
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
