import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const customStyles = {
  rows: { style: { fontFamily: "Poppins", fontSize: "14px" } },
  headCells: {
    style: {
      fontFamily: "Poppins",
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "#f5f5f5",
    },
  },
  cells: { style: { fontFamily: "Poppins" } },
};

function B2BSearch() {
  const [allB2Bdata, setAllB2Bdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    b2bname: "",
    contactperson: "",
    maincontact: "",
    executive_name: "",
    date: "",
  });

  useEffect(() => {
    fetchB2Bdata();
  }, []);

  const fetchB2Bdata = async () => {
    try {
      const response = await axios.get("http://192.168.0.102:5000/api/b2b");
      setAllB2Bdata(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSearch = () => {
    const filtered = allB2Bdata.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        value === ""
          ? true
          : item[key]?.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
    { name: "S.NO", selector: (row, index) => index + 1, sortable: true },
    { name: "B2B ID", selector: (row) => row.b2b_id },
    { name: "B2B Name", selector: (row) => row.b2bname },
    { name: "Contact Person", selector: (row) => row.contactperson },
    { name: "Mobile", selector: (row) => row.maincontact },
    { name: "Alternate No", selector: (row) => row.alternateno },
    { name: "Email", selector: (row) => row.email },
    { name: "GST", selector: (row) => row.gst },
    { name: "Address", selector: (row) => row.address },
    { name: "City", selector: (row) => row.city },
    { name: "B2B Type", selector: (row) => row.b2btype },
    { name: "Approach", selector: (row) => row.approach },
    { name: "Executive Name", selector: (row) => row.executive_name },
    { name: "Executive Number", selector: (row) => row.executive_number },
    { name: "Instructions", selector: (row) => row.instructions },
    { name: "Date", selector: (row) => row.date },
    { name: "Time", selector: (row) => row.time },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: "Updated At",
      selector: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2
        className="text-xl font-semibold mb-4"
        style={{ fontFamily: "Poppins" }}
      >
        B2B Search:
      </h2>

      <div className="grid grid-cols-5 gap-4 items-end mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">B2B Name</label>
          <input
            name="b2bname"
            value={filters.b2bname}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
            placeholder="Enter B2B Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Person
          </label>
          <input
            name="contactperson"
            value={filters.contactperson}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
            placeholder="Enter Contact Person"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <input
            name="maincontact"
            value={filters.maincontact}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
            placeholder="Enter Mobile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Executive Name
          </label>
          <input
            name="executive_name"
            value={filters.executive_name}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
            placeholder="Enter Executive Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSearch}
          className="bg-red-700 text-white px-6 py-2 rounded-md shadow hover:bg-red-800 transition"
        >
          Search
        </button>

        <button
          onClick={() => {
            setFilters({
              b2bname: "",
              contactperson: "",
              maincontact: "",
              executive_name: "",
              date: "",
            });
            setFilteredData([]);
          }}
          className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            customStyles={customStyles}
          />
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No data found. Try a search.</p>
      )}
    </div>
  );
}

export default B2BSearch;
