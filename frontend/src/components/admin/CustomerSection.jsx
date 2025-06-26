// src/components/admin/CustomerSection.jsx
import React from "react";
import GlimpseTable from "./GlimpseTable";

export default function CustomerSection({ data, page, setPage, pages }) {
  const rows = data.map((c) => [c.name, c.email, c.lastActive, c.bookings]);

  return (
    <GlimpseTable
      title="Customer Management"
      headers={["Name", "Email", "Last Active", "Bookings"]}
      rows={rows}
      page={page}
      setPage={setPage}
      pages={pages}
    />
  );
}
