import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../services/config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TryToBook = ({ itemsPerPage = 10 }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchFilters, setSearchFilters] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newRemark, setNewRemark] = useState("");

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    { label: "#", accessor: "id" },
    { label: "Create Date", accessor: "createdAt" },
    { label: "Customer Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "Contact", accessor: "phoneNumber" },
    { label: "Service", accessor: "service" },
    { label: "Reference", accessor: "reference" },
    { label: "Executive", accessor: "executive" },
    { label: "Remarks", accessor: "remarks" },
    { label: "Date", accessor: "date" },
    { label: "Action", accessor: "action" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/trytobooking`, {
        params: {
          page,
          limit: itemsPerPage,
          search: JSON.stringify({ name: searchFilters }),
          fromDate,
          toDate,
        },
      });

      setData(response.data.bookings || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching try-to-book data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchFilters, fromDate, toDate]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TryToBookData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "TryToBookData.xlsx");
  };

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setNewRemark(row.remarks || "");
    setShowModal(true);
  };

  const handleUpdateRemarks = async () => {
    try {
      await axios.put(`${config.API_BASE_URL}/trytobooking/${selectedRow.id}`, {
        remarks: newRemark,
      });
      setShowModal(false);
      fetchData(); // refresh
    } catch (err) {
      console.error("Failed to update remarks", err);
    }
  };

  return (
    <div className="mt-5 bg-white shadow-md p-4 rounded-md">
      <h1 className="mb-4"> Try To Bookings</h1>

      <div className="grid md:grid-cols-5 gap-2 mb-4 items-end">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-2 py-1 rounded-md text-sm"
          value={searchFilters}
          onChange={(e) => {
            setSearchFilters(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded-md text-sm"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded-md text-sm"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button
          onClick={handleExport}
          className="bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 text-sm"
        >
          Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-red-100 text-pink-800">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-2 py-2 text-left font-semibold border-b border-gray-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-300 bg-white hover:bg-pink-50 transition"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-2 py-2 text-xs">
                      {col.accessor === "createdAt" ? (
                        new Date(row[col.accessor]).toLocaleString()
                      ) : col.accessor === "action" ? (
                        <button
                          onClick={() => handleOpenModal(row)}
                          className="text-blue-600 underline text-xs"
                        >
                          Update Remarks
                        </button>
                      ) : (
                        row[col.accessor] || "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-3">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-1  bg-opacity-130 flex items-center justify-center z-500">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Update Remarks</h2>
            <textarea
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
              rows={4}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRemarks}
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryToBook;
