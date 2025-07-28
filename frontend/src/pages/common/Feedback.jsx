import React, { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        message: feedbackText,
      }, { withCredentials: true });

      setSubmitted(true);
      setFeedbackText("");
    } catch (err) {
      console.error("❌ Error submitting feedback:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-xl w-full p-8">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          💬 We Value Your Feedback!
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Help us improve EventsBridge by sharing your thoughts.
        </p>

        {submitted ? (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-4 rounded-lg text-center">
            ✅ Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your experience or suggestions here..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>

            <button
              type="submit"
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-300"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
