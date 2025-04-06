import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const customStyles = {
  rows: {
    style: {
      fontFamily: "Poppins",
      fontSize: "14px",
    },
  },
  headCells: {
    style: {
      fontFamily: "Poppins",
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "#f5f5f5",
    },
  },
  cells: {
    style: {
      fontFamily: "Poppins",
    },
  },
};

function B2BImport() {
  const [allB2Bdata, setallB2Bdata] = useState([]);

  useEffect(() => {
    fetchB2Bdata();
  }, []);

  const fetchB2Bdata = async () => {
    try {
      const response = await axios.get("http://192.168.0.102:5000/api/b2b");
      setallB2Bdata(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "B2B Name", selector: (row) => row.b2bname, sortable: true },
    { name: "Contact Person", selector: (row) => row.contactperson },
    { name: "Mobile", selector: (row) => row.maincontact },
    { name: "Alternate No", selector: (row) => row.alternateno },
    { name: "Email", selector: (row) => row.email },
    { name: "City", selector: (row) => row.city },
    { name: "B2B Type", selector: (row) => row.b2btype },
    { name: "Approach", selector: (row) => row.approach },
    { name: "Executive", selector: (row) => row.executive_name },
    { name: "Instructions", selector: (row) => row.instructions, grow: 2 },
    { name: "Date", selector: (row) => row.date },
    { name: "Time", selector: (row) => row.time },
  ];

  const downloadCSV = () => {
    const csvHeaders = Object.keys(allB2Bdata[0] || {}).join(",");
    const csvRows = allB2Bdata
      .map((row) =>
        Object.values(row)
          .map((val) =>
            typeof val === "string" && val.includes(",")
              ? `"${val}"`
              : val || ""
          )
          .join(",")
      )
      .join("\n");

    const csvContent = `${csvHeaders}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "b2b_enquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "Poppins" }}>
          B2B Enquiry List
        </h2>
        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition text-sm"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={allB2Bdata}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

export default B2BImport;
