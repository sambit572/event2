// src/components/admin/GlimpseTable.jsx

export default function GlimpseTable({
  title,
  headers,
  rows,
  pages,
  page,
  setPage,
  statusCol,
  getStatusColor,
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-black text-xs uppercase">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="py-3 px-6 text-center whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b hover:bg-gray-100 cursor-pointer">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-3 px-5 whitespace-nowrap text-center">
                    {statusCol === cIdx ? (
                      <span
                        className={`px-1 py-1 font-medium rounded-full ${
                          getStatusColor ? getStatusColor(cell) : ""
                        }`}
                      >
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-4 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end items-center mt-4 space-x-3 px-3 pb-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-gray-600">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
