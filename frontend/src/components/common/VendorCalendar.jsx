import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const VendorCalendar = ({ disabledDays = [], onDateSelect }) => {
  const [selectedRange, setSelectedRange] = useState(undefined);

  const handleSelect = (range) => {
    setSelectedRange(range);
    // Pass the selected dates up to the parent component
    onDateSelect({
      startDate: range?.from,
      endDate: range?.to,
    });
  };

  let footer = (
    <p className="text-sm text-center py-2">
      Please pick the first day of your event.
    </p>
  );
  if (selectedRange?.from) {
    if (!selectedRange.to) {
      footer = (
        <p className="text-sm text-center py-2">
          Now, please pick the last day.
        </p>
      );
    } else if (selectedRange.to) {
      footer = (
        <p className="text-sm text-center text-indigo-500 py-2 font-semibold">
          Selected: {format(selectedRange.from, "PPP")} -{" "}
          {format(selectedRange.to, "PPP")}
        </p>
      );
    }
  }

  return (
    <div className="flex justify-center p-4 bg-gray-50 rounded-lg border">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={[{ before: new Date() }, ...disabledDays]}
        footer={footer}
        modifiersClassNames={{
          selected: "bg-indigo-500 text-blue-500 hover:bg-indigo-600",
          disabled: "opacity-30 line-through",
          today: "font-bold text-indigo-600",
        }}
      />
    </div>
  );
};

export default VendorCalendar;
