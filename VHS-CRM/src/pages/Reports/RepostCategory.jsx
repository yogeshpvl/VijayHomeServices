import React, { useState } from "react";
import DataTable from "react-data-table-component";

const allCategories = [
  { id: 1, name: "Cleaning" },
  { id: 2, name: "Painting" },
  { id: 3, name: "Pest Control" },
  { id: 4, name: "Floor Polishing" },
  { id: 5, name: "Home Repair Services" },
  { id: 6, name: "Packers & Movers" },
  { id: 7, name: "Appliance Service" },
  { id: 8, name: "Facility Management" },
];

const customStyles = {
  rows: { style: { fontSize: "14px", fontFamily: "Poppins" } },
  headCells: {
    style: {
      fontSize: "14px",
      fontWeight: "600",
      backgroundColor: "#f5f5f5",
      fontFamily: "Poppins",
    },
  },
  cells: { style: { fontFamily: "Poppins" } },
};

function ReportCategory() {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleShow = () => {
    const filtered = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setShowTable(true);
  };

  const handleExport = () => {
    alert("✅ Export logic can be added using xlsx or file-saver.");
  };

  const columns = [
    {
      name: "Sr.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Category",
      selector: (row) => row.name,
      sortable: true,
    },
  ];

  return (
    <div className="p-4">
      {/* Filter Box */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="font-semibold mb-4 text-sm">
          Category Report &gt; Filter
        </h2>
        <div className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Category:</label>
            <input
              type="text"
              placeholder="Search Category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShow}
              className="bg-red-700 text-white px-5 py-2 rounded-md text-sm hover:bg-red-800"
            >
              Show
            </button>
            <button
              onClick={handleExport}
              className="bg-red-700 text-white px-5 py-2 rounded-md text-sm hover:bg-red-800"
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>

      {/* Header & Table */}
      {showTable && (
        <>
          <div className="bg-red-800 text-white px-4 py-2 font-semibold rounded-t-md text-sm mb-1">
            Vijay Home Services | Category ,
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            customStyles={customStyles}
          />
        </>
      )}
    </div>
  );
}

export default ReportCategory;
