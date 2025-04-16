import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import moment from "moment";

const PRList = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const users = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedContactNo, setSelectedContactNo] = useState("");
  const [selectedJobAmount, setSelectedJobAmount] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedReference, setSelectedReference] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorData, setvendorData] = useState([]);

  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  console.log(
    "data.slice(startIndex, endIndex)",
    data.slice(startIndex, endIndex)
  );
  console.log("startIndex", startIndex);
  console.log("endIndex", endIndex);
  console.log("paginatedData", paginatedData);

  // Fetch data from the backend

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/paymentsdailydata`,
        {
          params: {
            date,
            name: selectedName,
            address: selectedAddress,
            contactNo: selectedContactNo,
            jobType: selectedJobType,
            jobAmount: selectedJobAmount,
            description: selectedDescription,
            reference: selectedReference,
            city: selectedCity || users.city.map((user) => user.name).join(","), // ✅ use selectedCity

            technician: selectedTechnician,
            paymentMode: selectedPaymentMode,
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );

      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setvendorData(response.data.vendorNames);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    date,

    selectedCity,
    selectedTechnician,
    selectedJobType,
    selectedPaymentMode,
    selectedName,
    selectedAddress,
    selectedContactNo,
    selectedJobAmount,
    selectedDescription,
    selectedReference,
    currentPage,
  ]);

  // Handle row click to navigate to details page
  const handleRowClick = (id) => {
    navigate(`/DSR/DSRDetails/${id}`);
  };
  const columns = [
    { label: "Sr.No." },
    { label: "Category" },
    { label: "Payment Date" },

    { label: "Name", key: "name" },
    {
      label: "City",
      key: "city",
      type: "dropdown",
      options: users?.city.map((c) => c.name),
    },
    { label: "Address", key: "address" },
    { label: "Contact No.", key: "contactno" },
    {
      label: "Technician",
      key: "technician",
      type: "dropdown",
      options: vendorData?.map((v) => v.vendor_name),
    },
    { label: "Job Type", key: "jobtype" },
    { label: "Description", key: "description" },

    { label: "Job Amount", key: "jobamount" },
    { label: "Payment Mode", key: "paymentmode" },
    { label: "Reference" },

    { label: "Status" },
    { label: "Payment details" },
    { label: "Action" },
  ];

  const getFilterValue = (key) => {
    switch (key) {
      case "name":
        return selectedName;
      case "city":
        return selectedCity;
      case "technician":
        return selectedTechnician;
      case "jobtype":
        return selectedJobType;
      case "paymentmode":
        return selectedPaymentMode;
      case "address":
        return selectedAddress;
      case "contactno":
        return selectedContactNo;
      case "jobamount":
        return selectedJobAmount;
      case "description":
        return selectedDescription;
      case "reference":
        return selectedReference;
      case "time":
        return ""; // Optional
      default:
        return "";
    }
  };

  const handleFilterChange = (e, field, type = "input") => {
    const value = e.target.value;

    const setterMap = {
      city: setSelectedCity,
      technician: setSelectedTechnician,
      jobtype: setSelectedJobType,
      paymentmode: setSelectedPaymentMode,
      name: setSelectedName,
      address: setSelectedAddress,
      contactno: setSelectedContactNo,
      jobamount: setSelectedJobAmount,
      description: setSelectedDescription,
      reference: setSelectedReference,
    };

    if (setterMap[field]) {
      setterMap[field](value);

      // Run fetch immediately if dropdown
      if (type === "dropdown") {
        setCurrentPage(1);
        fetchData();
      }
    }
  };

  return (
    <div className="p-2 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payments Report -{date}</h2>
      </div>

      {/* Table for displaying data */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              {columns.map((col, idx) => {
                let customWidth = "";

                // Optional: Assign custom width based on label or key
                if (col.label === "Address") customWidth = "min-w-[250px]";
                else if (col.label === "Customer Payment")
                  customWidth = "min-w-[220px]";
                else if (col.label === "Payment details")
                  customWidth = "min-w-[250px]";
                else if (col.label === "Description")
                  customWidth = "min-w-[200px]";
                else if (col.label === "Contact No.")
                  customWidth = "min-w-[150px]";
                else if (col.label === "Worker") customWidth = "min-w-[150px]";
                else if (col.label === "City") customWidth = "min-w-[120px]";
                else if (col.label === "Date") customWidth = "min-w-[140px]";

                return (
                  <th
                    key={idx}
                    className={`border border-gray-200 px-4 py-3 text-xs font-semibold text-left bg-gray-100 text-gray-800 ${customWidth}`}
                  >
                    {col.label}
                    {col.key &&
                      (col.type === "dropdown" ? (
                        <select
                          value={getFilterValue(col.key)}
                          onChange={(e) =>
                            handleFilterChange(e, col.key, "dropdown")
                          }
                          className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                        >
                          <option value="">--Select--</option>
                          {col.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.key === "contactno" ? "tel" : "text"}
                          value={getFilterValue(col.key)}
                          onChange={(e) => handleFilterChange(e, col.key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setCurrentPage(1);
                              fetchData();
                            }
                          }}
                          className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                        />
                      ))}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                className={`border-b transition cursor-pointer ${
                  row.status === "NOT ASSIGNED"
                    ? "bg-white"
                    : row.status === "ASSIGNED FOR TECHNICIAN"
                    ? "bg-gray-200"
                    : row.status === "SERVICE STARTED"
                    ? "bg-yellow-200"
                    : row.status === "SERVICE COMPLETED"
                    ? "bg-green-200"
                    : row.status === "SERVICE CANCELLED"
                    ? "bg-red-200"
                    : row.status === "SERVICE DELAYED"
                    ? "bg-blue-200"
                    : row.status === "CLOSED OPERATION MANAGER"
                    ? "bg-purple-200"
                    : "bg-white"
                }`}
              >
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {startIndex + index + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.category}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.amt_date}
                </td>

                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.customer.customerName}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.city}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.delivery_address?.address}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.customer.mainContact}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.vendor_name}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.service_name}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.description}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.service_charge}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.payment_mode}
                </td>

                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.type}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.payment_mode === "Online"
                    ? "Payment Collected"
                    : ""}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs text-black">
                  {(() => {
                    const customerPayments = row.Booking?.payments?.filter(
                      (p) => p.paymen_type === "Customer"
                    );

                    const total = customerPayments?.reduce(
                      (sum, p) => sum + parseFloat(p.amount || 0),
                      0
                    );

                    const serviceCharge = parseFloat(row?.service_charge || 0);
                    const pending = serviceCharge - total;

                    return (
                      <div className="space-y-1">
                        {customerPayments.map((p) => (
                          <div key={p.id}>
                            ({moment(p.payment_date).format("DD/MM/YYYY")}) ₹
                            {p.amount} ({p.payment_mode})
                          </div>
                        ))}

                        {customerPayments.length > 0 && (
                          <>
                            <div className="font-bold mt-1">
                              Total: {total.toFixed(2)}
                            </div>
                            <div className="font-bold">
                              Pending: {pending.toFixed(2)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </td>

                <td className="border border-gray-200 px-3 py-2 text-xs space-x-2">
                  <button
                    className=" text-green-700 px-2 py-1 rounded  text-xs cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // prevents row click
                      navigate(
                        `/payment-reports/PaymentCollect/${row.Booking.id}`
                      );
                    }}
                  >
                    Payment Collect
                  </button>

                  <button
                    className="text-red-600 hover:underline text-xs  cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/raise-invoice/${row.id}`);
                    }}
                  >
                    Raise Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold text-sm text-black">
              <td colSpan={10} className="px-4 py-3 text-right">
                Totals:
              </td>
              <td className="px-3 py-2">
                ₹
                {paginatedData
                  .reduce(
                    (sum, row) => sum + parseFloat(row?.service_charge || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td colSpan={3}></td>
              <td className="px-3 py-2 text-xs text-black">
                {(() => {
                  const allCustomerPayments = paginatedData.flatMap(
                    (row) =>
                      row?.Booking?.payments?.filter(
                        (p) => p.paymen_type === "Customer"
                      ) || []
                  );

                  const modeTotals = allCustomerPayments.reduce(
                    (acc, curr) => {
                      const mode = curr.payment_mode || "Unknown";
                      const amount = parseFloat(curr.amount || 0);
                      acc[mode] = (acc[mode] || 0) + amount;
                      acc.counts[mode] = (acc.counts[mode] || 0) + 1;
                      return acc;
                    },
                    { counts: {} }
                  );

                  const total = Object.values(modeTotals)
                    .filter((v) => typeof v === "number")
                    .reduce((sum, amt) => sum + amt, 0);

                  return (
                    <div className="space-y-1 font-bold">
                      {Object.entries(modeTotals)
                        .filter(([key]) => key !== "counts")
                        .map(([mode, amt]) => (
                          <div key={mode}>
                            {mode} ({modeTotals.counts[mode] || 0}):{" "}
                            {amt.toFixed(2)}
                          </div>
                        ))}
                      <div>Total: {total.toFixed(2)}</div>
                    </div>
                  );
                })()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 p-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PRList;
