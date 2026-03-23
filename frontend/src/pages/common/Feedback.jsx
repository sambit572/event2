import React, { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Word counting function
  const countWords = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Handle feedback text change with word limit
  const handleFeedbackChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);

    if (words <= 30) {
      setFeedbackText(text);
      setWordCount(words);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      setError("Please enter your feedback");
      return;
    }

    if (!userEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Word limit validation
    if (countWords(feedbackText.trim()) > 30) {
      setError("Feedback must be 30 words or less");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      userEmail: userEmail.trim().toLowerCase(),
      rating: Number(rating),
      reviewMessage: feedbackText.trim(),
      reviewType: "product", // For homepage display
    };

    console.log("Sending payload:", payload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/add`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Review submitted successfully:", response.data);
      setSubmitted(true);
      setFeedbackText("");
      setUserEmail("");
      setUserName("");
      setRating(5);
      setWordCount(0);
    } catch (err) {
      console.error("Error submitting feedback:", err);

      // Better error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError(
          "You have already submitted a review. Only one review per email is allowed."
        );
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check all fields and try again.");
      } else {
        setError("Failed to submit feedback. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError("");
    setFeedbackText("");
    setUserEmail("");
    setUserName("");
    setRating(5);
    setWordCount(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-xl w-full p-8">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">
          💬 We Value Your Feedback!
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Share your experience with EventsBridge.
        </p>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
            ❌ {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-300 text-cyan-900 px-4 py-4 rounded-lg mb-4">
              ✅ Thank you for your review! Your feedback helps us improve our
              services.
            </div>
            <button
              onClick={resetForm}
              className="bg-[#003366] text-[#f3c12d] font-semibold px-6 py-2 rounded-md hover:bg-[#002244] transition"
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Name Field (Optional) */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Your Name (Optional):
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Email Field (Required) */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Your Email <span className="text-red-500">*</span>:
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            {/* Feedback Text */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Your Feedback <span className="text-red-500">*</span>:
              </label>
              <textarea
                value={feedbackText}
                onChange={handleFeedbackChange}
                placeholder="Write your experience or suggestions here... (Max 30 words)"
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              ></textarea>
              <div className="text-right text-sm text-gray-500 mt-1">
                {wordCount}/30 words
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">
                Rate your experience:
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} Star{val !== 1 ? "s" : ""}{" "}
                    {val === 5
                      ? "⭐⭐⭐⭐⭐"
                      : val === 4
                      ? "⭐⭐⭐⭐"
                      : val === 3
                      ? "⭐⭐⭐"
                      : val === 2
                      ? "⭐⭐"
                      : "⭐"}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Your email will only be used to identify your review and will not be
            shared publicly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
