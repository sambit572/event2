// src/components/admin/BookingSection.jsx
import React from "react";
import GlimpseTable from "./GlimpseTable";

export default function BookingSection({
  data,
  page,
  setPage,
  pages,
  getStatusColor,
}) {
  const rows = data.map((b) => [
    b.id,
    b.user,
    b.vendor,
    b.service,
    b.date,
    b.status,
  ]);

  return (
    <GlimpseTable
      title="Recent Bookings"
      headers={["Booking ID", "User", "Vendor", "Service", "Date", "Status"]}
      rows={rows}
      page={page}
      setPage={setPage}
      pages={pages}
      statusCol={5}
      getStatusColor={getStatusColor}
    />
  );
}
