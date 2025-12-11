import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { transactionId, orderId, merchantRef, amount } = location.state || {};

  useEffect(() => {
    // Show success toast on mount
    toast.success("Payment completed successfully!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        <div id="receipt-print-area">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Success Animation */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-100">
                Your transaction has been completed
              </p>
            </div>

            {/* Payment Details */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 mb-6 border border-green-100">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-4xl font-bold text-green-600">
                    ₹{amount?.toLocaleString() || "0"}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Transaction ID
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-right break-all">
                      {transactionId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Order ID</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {orderId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Merchant Ref
                    </span>
                    <span className="font-mono font-semibold text-gray-900">
                      {merchantRef || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Date & Time
                    </span>
                    <span className="font-semibold text-gray-900">
                      {new Date().toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-semibold mb-1">
                      Payment Confirmed
                    </p>
                    <p className="text-sm text-blue-700">
                      A confirmation email has been sent to your registered
                      email address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go to Dashboard
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
