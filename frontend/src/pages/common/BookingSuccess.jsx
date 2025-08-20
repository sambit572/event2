import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./BookingSuccess.css";

const BookingSuccess = ({ onClose }) => {
  const navigate = useNavigate();

  const bookingDetails = [
    { label: "Booking ID:", value: "SC123456" },
    { label: "Vendor:", value: "Blossom Studios" },
    { label: "Service booked:", value: "Photographer" },
    { label: "Total Price:", value: "₹ 1500.00" },
    { label: "Date & Time:", value: "May 15, 2024 at 2:00 PM" },
    { label: "Payment Mode:", value: "Credit Card" },
    { label: "Venue:", value: "Grand Oaks Hotel" },
    { label: "No. of Services Booked:", value: "1" },
  ];

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    const todayDate = new Date();
    const yyyy = todayDate.getFullYear().toString();
    const mm = (todayDate.getMonth() + 1).toString().padStart(2, "0");
    const dd = todayDate.getDate().toString().padStart(2, "0");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${yyyy}${mm}${dd}-${randomDigits}`;

    doc.setFontSize(22).setFont("helvetica", "bold").setTextColor(40);
    doc.text("Booking Invoice", pageWidth / 2, 20, { align: "center" });

    const companyDetails = [
      "EventsBridge Pvt. Ltd.",
      "123 Event Street",
      "Mumbai, Maharashtra-400001",
      "Phone: +91 12345 67890",
      "Email: contact@eventsbridge.com",
    ];
    doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(70);
    let compY = 30;
    companyDetails.forEach((line) => {
      doc.text(line, margin, compY);
      compY += 6;
    });

    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text(
      `Invoice No: ${invoiceNumber}`,
      pageWidth - margin - 80,
      compY + 10
    );
    doc.text(
      `Date: ${todayDate.toLocaleDateString()}`,
      pageWidth - margin - 80,
      compY + 18
    );

    doc
      .setLineWidth(0.5)
      .line(margin, compY + 22, pageWidth - margin, compY + 22);

    doc.setFontSize(14).setTextColor(60);
    doc.text("Booking Details", pageWidth / 2, compY + 32, { align: "center" });
    doc
      .setLineWidth(0.3)
      .line(margin, compY + 34, pageWidth - margin, compY + 34);

    let y = compY + 42;
    const labelX = margin;
    const valueX = pageWidth / 2;

    const formatCurrency = (val) => {
      if (!val) return "";
      const num = parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? val : `Rs.${num.toFixed(2)}`;
    };

    bookingDetails.forEach((item, index) => {
      if (y > 280) {
        doc.addPage();
        y = margin;
      }
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y - 7, pageWidth - 2 * margin, 10, "F");
      }
      doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(30);
      doc.text(`${item.label}:`, labelX, y);
      doc.setFont("helvetica", "normal").setTextColor(80);
      const val = ["amount", "price", "total"].some((t) =>
        item.label.toLowerCase().includes(t)
      )
        ? formatCurrency(item.value)
        : item.value;
      doc.text(val.toString(), valueX, y);
      y += 10;
    });

    doc.line(margin, y + 5, pageWidth - margin, y + 5);
    doc.setFontSize(10).setTextColor(100);
    doc.text("Thank you for booking our services.", pageWidth / 2, y + 15, {
      align: "center",
    });

    doc.save(`Invoice_${invoiceNumber}.pdf`);
  };

  return (
    <div className="login-wrapper fixed inset-0 -mt-2 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="my-popup bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col relative animate-[popIn_0.4s_ease-out]
        max-h-[100vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          className="absolute -top-1 right-10 text-black text-[60px] cursor-pointer p-2 bg-transparent border-none"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="p-5">
          {/* Success Icon */}
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="80"
              height="80"
            >
              <circle
                className="checkmark-circle"
                cx="25"
                cy="25"
                r="20"
                fill="none"
              />
              <path
                className="checkmark-check"
                fill="none"
                d="M14 27l7 7 16-16"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-[16px] sm:text-[20px] md:text-[28px] lg:text-[35px] mt-5 font-bold text-black text-center whitespace-nowrap">
            Service Booked Successfully
          </h1>

          {/* Messages */}
          <p className="text-black text-center mt-1 text-[15px] sm:text-[13px] md:text-[16px] lg:text-[17px]">
            Thank you for booking with EB.
          </p>
          <p className="text-black text-center text-[15px] mb-6 sm:text-[13px] md:text-[16px] lg:text-[17px] mt-1">
            A confirmation email has been sent to you.
          </p>

          {/* Booking Details */}
          <div className="bg-[#093968] border border-[#f3c12d] rounded-xl shadow-xl mt-2 w-full max-w-2xl p-2 mx-auto">
            <h2 className="text-[25px] font-bold text-center text-[#f3c12d] mb-5 border-b border-[#f3c12d]">
              Booking Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#f3c12d]">
              {bookingDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-5 border border-[#f3c12d] rounded-md px-4 py-2"
                >
                  <span className="font-semibold">{detail.label}</span>
                  <span className="text-[#e5e5de]">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Note */}
          <p className="text-black text-center mt-4 max-w-[600px] mx-auto leading-snug">
            A booking confirmation and invoice has been sent to your email at
            <span className="font-semibold text-orange-500">
              {" "}
              ved@gmail.com
            </span>
            .
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3 sm:mt-4 w-[220px] sm:w-[250px] mx-auto">
            <button
              className="bg-blue-500 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-[16px] font-bold hover:bg-blue-700 transition"
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </button>
            <button
              className="bg-[rgb(249,115,22)] text-white font-bold px-4 sm:px-5 py-3 sm:py-4 rounded-[16px] hover:bg-[rgb(244,105,12)] transition"
              onClick={() => navigate("/profile")}
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const [showSuccess, setShowSuccess] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="p-10">
      {showSuccess && (
        <BookingSuccess
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default BookingPage;
