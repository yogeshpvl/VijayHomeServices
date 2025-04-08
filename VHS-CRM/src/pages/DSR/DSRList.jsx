import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../services/config";

const DSRList = () => {
  const navigate = useNavigate();
  const { date, category } = useParams();
  const users = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "");
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

  const itemsPerPage = 25;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/dailydata`,
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
            city: selectedCity || users.city.map((user) => user.name).join(","),
            category: selectedCategory,
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
    selectedCategory,
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
    { label: "Date" },
    { label: "Time", key: "time" },
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
    { label: "Job Amount", key: "jobamount" },
    { label: "Payment Mode", key: "paymentmode" },
    { label: "Description", key: "description" },
    { label: "Reference", key: "reference" },
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
      category: setSelectedCategory,
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
        <h2 className="text-xl font-semibold">
          Daily Service Report -{category}
        </h2>
      </div>
      <div className="mt-4 mb-6 text-sm flex flex-wrap gap-4">
        <p>
          <span className="inline-block w-4 h-4 border bg-white mr-2"></span>
          NOT ASSIGNED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-gray-300 mr-2"></span>
          ASSIGNED FOR TECHNICIAN
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-yellow-300 mr-2"></span>
          SERVICE STARTED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-green-300 mr-2"></span>
          SERVICE COMPLETED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-red-300  mr-2"></span>
          SERVICE CANCELLED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-blue-300  mr-2"></span>
          SERVICE DELAYED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-purple-300 mr-2"></span>
          CLOSED OPERATION MANAGER
        </p>
      </div>

      {/* Table for displaying data */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="border border-gray-200 px-4 py-3 text-xs font-semibold text-left bg-gray-100 text-gray-800"
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
              ))}
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
                  {row.service_date}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.selected_slot_text}
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
                  {row.service_charge}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.payment_mode}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.description}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {row.Booking.type}
                </td>
              </tr>
            ))}
          </tbody>
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

export default DSRList;
