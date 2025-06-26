import React from "react";
import GlimpseTable from "./GlimpseTable";

export default function VendorSection({
  data,
  page,
  setPage,
  pages,
  getStatusColor,
}) {
  const rows = data.map((v) => [v.name, v.service, v.status, v.bookings]);
  return (
    <GlimpseTable
      title="Vendor Management"
      headers={["Name", "Service", "Status", "Bookings"]}
      rows={rows}
      page={page}
      setPage={setPage}
      pages={pages}
      statusCol={2}
      getStatusColor={getStatusColor}
    />
  );
}
