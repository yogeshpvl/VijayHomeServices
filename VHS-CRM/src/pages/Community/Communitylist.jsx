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

function Communitylist() {
  const [allCommunity, setAllCommunity] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAllCommunity();
  }, []);

  const fetchAllCommunity = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.102:5000/api/communities"
      );
      setAllCommunity(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log("Error fetching communities:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = allCommunity.filter((item) =>
      Object.values(item).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Appartment Name", selector: (row) => row.appartmentname },
    { name: "Community Name", selector: (row) => row.communityn },
    { name: "Percentage", selector: (row) => row.percentage },
    { name: "Project Manager", selector: (row) => row.projectmanager },
    { name: "Contact Person", selector: (row) => row.contactperson },
    { name: "Contact No", selector: (row) => row.contactno },
    { name: "Email", selector: (row) => row.email },
    { name: "Login", selector: (row) => row.login },
    { name: "Password", selector: (row) => row.password },
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
        Community List
      </h2>

      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search anything..."
        className="w-full mb-4 border border-gray-300 px-4 py-2 rounded-md"
        style={{ width: "250px", outline: "none" }}
      />

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
    </div>
  );
}

export default Communitylist;
