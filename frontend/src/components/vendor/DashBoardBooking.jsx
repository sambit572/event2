import React, { useState } from "react";
import BookingData from "./BookingData.js";
import BookingPopup from "./BookingPopup.jsx";

const DashBoardBooking = () => {
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = (booking) => {
    setClickedRow(clickedRow?.number === booking.number ? null : booking);
  };

  const handleClose = () => {
    setClickedRow(null);
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 relative left-[170px] top-[-19px] lg:width-[598px]left-[-38px]top-[-14px]   md:px-8 py-6">
      <div className="mb-4 lg:relative left-[-600px]">
        <select className="border px-4 py-2 rounded-xl shadow-sm bg-purple-600 text-white relative left-[600px]">
          <option className="bg-white text-black">Sort by</option>
          <option className="bg-white text-black" value="status">
            Status
          </option>
          <option className="bg-white text-black" value="serviceName">
            Service Name
          </option>
          <option className="bg-white text-black" value="cancelled">
            Cancelled
          </option>
          <option className="bg-white text-black" value="last1">
            Last 3 months
          </option>
          <option className="bg-white text-black" value="last2">
            Last 6 months
          </option>
        </select>
      </div>

      <div className="overflow-x-auto ">
        {/* Header */}
        <div className="grid grid-cols-7 gap-4 bg-[#ead8f6] font-semibold text-sm text-gray-700 py-3 px-4 border-y rounded-xl mb-3 shadow-lg">
          <div>No.</div>
          <div>Service</div>
          <div>Booked By</div>
          <div>Price</div>
          <div>Booking Date</div>
          <div>Booking Day</div>
          <div>Status</div>
        </div>

        {/* Rows */}
        {BookingData.map((b) => (
          <div key={b.number}>
            <div
              className={`grid grid-cols-7 gap-4 px-4 py-3 text-sm border-b items-center bg-white hover:bg-gray-200 cursor-pointer rounded-xl mb-2 shadow-lg `}
              onClick={() => handleRowClick(b)}
            >
              <div>{b.number}</div>
              <div className="font-medium">{b.service}</div>
              <div>{b.bookedBy}</div>
              <div>{b.price}</div>
              <div>{b.date}</div>
              <div>{b.days}</div>
              <div
                className={`px-2 py-1 rounded-full text-center text-xs font-semibold ${
                  b.status.toLowerCase() === "completed"
                    ? "bg-green-100 text-green-700"
                    : b.status.toLowerCase() === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.status}
              </div>
            </div>

            {/* {clickedRow?.number === b.number && (
              <div className="px-4 py-4 bg-white shadow-md border rounded-md my-2">
                <BookingPopup
                  isOpen={true}
                  onClose={handleClose}
                  booking={clickedRow}
                />
              </div>
            )} */}

            {clickedRow && (
              <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex justify-center items-center">
                <BookingPopup
                  isOpen={true}
                  onClose={handleClose}
                  booking={clickedRow}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoardBooking;
