import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { extractUpiTransactionId } from "../../../utils/payment/extractUpiTransactionId.js";

import toast from "react-hot-toast";

const QRPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { amount, upiUri, merchantRef, orderId, expiresAt } =
    location.state || {};

  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt) - new Date()) / 1000)
      );
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        toast.error("Payment time expired");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        toast.error("Please upload a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        toast.error("File size must be less than 10MB");
        return;
      }
      setReceiptFile(file);
      setFileName(file.name);
      setError("");
      toast.success("Receipt uploaded successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let finalTransactionId = transactionId.trim();

      // If receipt is uploaded and no manual ID, extract from receipt
      if (receiptFile && !finalTransactionId) {
        toast.loading("Extracting transaction ID from receipt...");
        finalTransactionId = await extractUpiTransactionId(receiptFile);
        toast.dismiss();
        toast.success("Transaction ID extracted successfully!");
      }

      if (!finalTransactionId) {
        throw new Error("Please provide a transaction ID or upload a receipt");
      }

      // Validate transaction ID format
      if (!/^\d{8,15}$/.test(finalTransactionId)) {
        throw new Error("Invalid transaction ID format. Must be 8-15 digits.");
      }

      console.log("Transaction ID:", finalTransactionId);
      console.log("Order ID:", orderId);
      console.log("Merchant Ref:", merchantRef);

      toast.success("Payment verified successfully!");

      // Navigate to success page
      navigate("/payment-success", {
        state: {
          transactionId: finalTransactionId,
          orderId,
          merchantRef,
          amount,
        },
      });
    } catch (err) {
      const errorMessage =
        err.message || "Failed to process payment verification";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Scan & Pay</h1>
              {expiresAt && timeRemaining > 0 && (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-mono font-semibold">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">
                ₹{amount?.toLocaleString() || "0"}
              </span>
              <span className="text-blue-100">to pay</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-8 border-2 border-dashed border-blue-200">
              <div className="flex flex-col items-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-4 relative">
                  <QRCodeSVG
                    value={
                      upiUri || "upi://pay?pa=merchant@upi&pn=Merchant&am=0"
                    }
                    size={240}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-full p-2 shadow-md">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 10h11v2H3v-2zm0-4h11v2H3V6zm0 8h7v2H3v-2zm13.01-2.5l-2.75 3l-.75-.75-1.01 1L13.01 18l3.75-4.5-1.75-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-center font-medium">
                  Scan with any UPI app to pay
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                    alt="UPI"
                    className="h-8 opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Order Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {orderId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Merchant Reference</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {merchantRef || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  Manual Transaction ID (Optional)
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter 8-15 digit UPI Transaction ID"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-lg"
                    disabled={loading}
                  />
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    Upload Payment Receipt
                  </h3>
                  {!transactionId && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                      Recommended
                    </span>
                  )}
                </div>

                <label className="relative block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {fileName ? (
                        <div className="text-center">
                          <p className="text-green-600 font-semibold mb-1">
                            ✓ File uploaded
                          </p>
                          <p className="text-sm text-gray-600">{fileName}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-700 font-semibold mb-1">
                            Click to upload receipt
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!transactionId && !receiptFile)}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 flex items-center justify-center gap-3 ${
                  loading || (!transactionId && !receiptFile)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Payment</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">100% Secure</p>
                <p className="text-sm text-gray-600">Encrypted transaction</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Instant Confirmation
                </p>
                <p className="text-sm text-gray-600">Real-time verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
