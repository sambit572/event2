// src/components/admin/EarningSection.jsx
import React from "react";
import GlimpseTable from "./GlimpseTable";

export default function EarningSection({
  data,
  page,
  setPage,
  pages,
  getStatusColor,
}) {
  const rows = data.map((e) => [e.date, e.amount, e.source, e.status]);

  return (
    <GlimpseTable
      title="Recent Earnings"
      headers={["Date", "Amount", "Source", "Status"]}
      rows={rows}
      page={page}
      setPage={setPage}
      pages={pages}
      statusCol={3}
      getStatusColor={getStatusColor}
    />
  );
}
