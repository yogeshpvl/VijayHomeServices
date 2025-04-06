import React, { useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import axios from "axios";
import { config } from "../../services/config";

const columns = [
  {
    name: "Sr.No",
    cell: (row, index) => index + 1,
    width: "80px",
  },
  { name: "Date", selector: (row) => row.date },
  { name: "Time", selector: (row) => row.time },
  { name: "Category", selector: (row) => row.category },
  { name: "Customer Name", selector: (row) => row.customer },
  { name: "City", selector: (row) => row.city },
  { name: "Reference", selector: (row) => row.reference },
  { name: "Reference1", selector: (row) => row.reference1 },
  { name: "Address", selector: (row) => row.address },
  { name: "Contact No.", selector: (row) => row.contact },
  { name: "Backoffice Executive", selector: (row) => row.executive },
  { name: "Technician", selector: (row) => row.technician },
  { name: "Job Type", selector: (row) => row.jobType },
  { name: "Job Amount", selector: (row) => row.amount },
  { name: "Payment Mode", selector: (row) => row.payment },
];

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

function RepostDSR() {
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [dsrData, setDsrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [technician, setTechnician] = useState("");
  const [executive, setExecutive] = useState("");
  const [jobType, setJobType] = useState("");
  const [reference, setReference] = useState("");

  console.log("dsrData", dsrData);
  const handleShow = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/getDSRREportFilter`,
        {
          params: {
            fromdate: fromDate,
            todate: toDate,
            city,
            category,
            technician,
            backoffice: executive,
            jobType,
            reference,
            page: 1,
            limit: 100,
          },
        }
      );

      const mappedData = response.data?.data.map((item) => ({
        date: item.service_date,
        time: item.Booking?.selected_slot_text || "",
        category: item.Booking?.category || "",
        customer: item.Booking?.customer?.customerName || "",
        city: item.Booking?.city || "",
        reference: item.Booking?.reference || "",
        reference1: "", // You can set actual field if available
        address: item.Booking?.delivery_address?.address || "",
        contact: item.Booking?.customer?.mainContact || "",
        executive: item.Booking?.backoffice_executive || "",
        technician: item.vendor_name || "",
        jobType: item.Booking?.service || "",
        amount: item.service_charge || "",
        payment: item.Booking?.payment_mode || "",
      }));

      setDsrData(mappedData);
      setShowTable(true);
    } catch (err) {
      console.error("Error fetching DSR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("📤 Export functionality coming soon!");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white p-6 rounded-lg shadow">
        {/* Filter Section */}
        <div className="bg-white max-w-4xl mx-auto p-6 ">
          <h2 className="text-xl font-bold text-red-800 text-center mb-6">
            DSR Report – Filter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="">-- Select --</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mysore">Mysore</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="">-- Select --</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
              </select>
            </div>

            {/* Technician */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Technician
              </label>
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="Technician name"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            {/* Backoffice Executive */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Backoffice Executive
              </label>
              <input
                type="text"
                value={executive}
                onChange={(e) => setExecutive(e.target.value)}
                placeholder="Executive name"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="">-- Select --</option>
                <option value="One Time">One Time</option>
                <option value="AMC">AMC</option>
                <option value="Interior Centre">Interior Centre</option>
              </select>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Google, Friend etc."
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleShow}
              className="bg-green-600 text-white px-6 py-2 rounded-md text-sm hover:bg-green-700"
            >
              🔍 Show
            </button>
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              📥 Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        {showTable && (
          <div className="rounded-md overflow-hidden shadow border border-gray-200">
            <div className="bg-red-800 text-white px-4 py-2 font-semibold text-sm">
              Vijay Home Services | DSR Reports
            </div>
            <DataTable
              columns={columns}
              data={dsrData}
              pagination
              highlightOnHover
              striped
              customStyles={customStyles}
              progressPending={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RepostDSR;
