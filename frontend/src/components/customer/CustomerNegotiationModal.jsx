import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./negotiationModal.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const CustomerNegotiationModal = () => {
  const { state } = useLocation();
  const { venueLocation = "", eventDate = "" } = state || {};
  const navigate = useNavigate(); // Initialize useNavigate

  const [proposedPrice, setProposedPrice] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [callStarted, setCallStarted] = useState(false);
  const [callStatus, setCallStatus] = useState("Not Started");
  const [proceededWithoutNegotiation, setProceededWithoutNegotiation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [venueInput, setVenueInput] = useState(venueLocation);

  const bookingDetails = {
    vendorName: "Horse-Carriage Odisha",
    CurrentAmount: "1500",
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = () => {
    setShowTimer(true);
  };

  const handleNegotiate = () => {
    if (!proposedPrice || proposedPrice <= 0) {
      alert("❗ Please enter a valid price.");
      return;
    }

    const negotiationData = {
      vendorName: bookingDetails.vendorName,
      venueLocation: venueInput,
      proposedPrice,
      date: eventDate,
      originalPrice: bookingDetails.CurrentAmount,
      type: "Negotiation Requested",
    };

    setIsLoading(true);

    setTimeout(() => {
      try {
        socket.emit("new-negotiation-request", negotiationData);
        console.log("Negotiation data sent:", negotiationData);
      } catch (error) {
        console.log("error:", error);
      }

      alert(`✅ Your price ₹${proposedPrice} has been sent to the vendor!`);
      startTimer();
      setIsLoading(false);
    }, 1000);
  };

  const handleProceedWithoutNegotiation = () => {
    const negotiationData = {
      vendorName: bookingDetails.vendorName,
      venueLocation: venueInput,
      proposedPrice: bookingDetails.CurrentAmount,
      date: eventDate,
      originalPrice: bookingDetails.CurrentAmount,
      type: "No Negotiation Requested",
    };

    setIsLoading(true);

    setTimeout(() => {
      try {
        socket.emit("new-negotiation-request", negotiationData);
      } catch (error) {
        console.log("error:", error);
      }
      alert("🚀 Proceeding with the listed price...");
      setProposedPrice(bookingDetails.CurrentAmount);
      setProceededWithoutNegotiation(true);
      startTimer();
      setIsLoading(false);
    }, 1000);
  };

  const onClose = () => {
    navigate("/userdetails"); // Navigate back to UserDetails
  };

  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0 && showTimer) {
      alert("⏳ Time expired! Closing the negotiation window.");
      onClose();
    }
    return () => clearTimeout(timer);
  }, [showTimer, timeLeft]);

  const handleStartCall = () => {
    setCallStatus("Connecting...");
    setCallStarted(true);
    setTimeout(() => setCallStatus("Call Live"), 1500);
  };

  const handleEndCall = () => {
    setCallStatus("Call Ended");
    setCallStarted(false);
  };

  return (
    <div className="negotiation-overlay">
      <div className="negotiation-modal" role="dialog" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close negotiation modal">
          ×
        </button>

        <h2 className="heading-negotiated" id="modal-title">
          Propose Your Negotiated Price
        </h2>

        <div className="modal-details">
          <p>
            <strong>Agency:</strong> {bookingDetails.vendorName}
          </p>
          <p>
            <strong>Venue Location:</strong>
            <input
              type="text"
              placeholder="Enter Your Venue Location"
              value={venueInput}
              onChange={(e) => setVenueInput(e.target.value)}
              className="VenueInput"
            />
          </p>
          <p>
            <strong>Date Of Event:</strong>{" "}
            {eventDate ? new Date(eventDate).toLocaleDateString() : "Not provided"}
          </p>
          <p>
            <strong>Listed Price:</strong> ₹{bookingDetails.CurrentAmount}
          </p>
        </div>

        {!showTimer && (
          <>
            <div className="modal-input">
              <label htmlFor="proposed-price">Enter Your Price (INR):</label>
              <input
                id="proposed-price"
                type="number"
                placeholder="e.g., 1200"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                aria-describedby="price-input-description"
              />
              <span id="price-input-description" className="sr-only">
                Enter the price you wish to propose to the vendor in Indian Rupees.
              </span>
            </div>

            <div className="modal-actions">
              <button
                className="modal-submit"
                onClick={handleNegotiate}
                disabled={isLoading}
                aria-label="Send proposed price to vendor"
              >
                {isLoading ? "Sending..." : "Send to Vendor"}
              </button>
              <button
                className="modal-secondary"
                onClick={handleProceedWithoutNegotiation}
                disabled={isLoading}
                aria-label="Proceed with listed price without negotiation"
              >
                {isLoading ? "Processing..." : "Proceed Without Negotiation"}
              </button>
            </div>
          </>
        )}

        {showTimer && (
          <div className="modal-timer">
            <h3>
              ⏳{" "}
              {proceededWithoutNegotiation
                ? "Proceeding with listed price..."
                : "Waiting for vendor response..."}
            </h3>
            <p>
              Auto-closing in <strong>{formatTime(timeLeft)}</strong>
            </p>
            <div className="timer-progress">
              <div style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}></div>
            </div>

            <div className="call-box">
              <h4>📞 Support Call Status: {callStatus}</h4>
              {!callStarted ? (
                <button
                  className="call-btn start"
                  onClick={handleStartCall}
                  aria-label="Start support call"
                >
                  Start Call
                </button>
              ) : (
                <button
                  className="call-btn end"
                  onClick={handleEndCall}
                  aria-label="End support call"
                >
                  End Call
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNegotiationModal;