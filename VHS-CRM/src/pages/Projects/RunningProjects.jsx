import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import moment from "moment";

const RunningProjects = () => {
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedName, setSelectedName] = useState(""); // Added for Name filter
  const [selectedAddress, setSelectedAddress] = useState(""); // Added for Address filter
  const [selectedContactNo, setSelectedContactNo] = useState(""); // Added for Contact No filter
  const [selectedJobAmount, setSelectedJobAmount] = useState(""); // Added for Job Amount filter
  const [selectedDescription, setSelectedDescription] = useState(""); // Added for Description filter
  const [selectedReference, setSelectedReference] = useState(""); // Added for Reference filter
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorData, setvendorData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data?.slice(startIndex, endIndex);

  // Fetch data from the backend

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookings/running/project`,
        {
          params: {
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

      console.log("response.data running", response.data.bookings);
      setData(response.data.bookings);
      setTotalPages(response.data.totalPages);
      setvendorData(response.data.vendorNames);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
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
    { label: "Date", key: "createdAt" },
    { label: "category", key: "category" },
    { label: "Project Manager", key: "quotation.booked_by" },
    { label: "Sales Executive", key: "quotation.sales_executive" },
    { label: "Customer", key: "customer.customerName" },
    { label: "Contact No.", key: "customer.mainContact" },
    { label: "Address", key: "delivery_address.address" },
    {
      label: "City",
      key: "city",
      type: "dropdown",
      options: users?.city.map((c) => c.name),
    },
    { label: "Quote No.", key: "quotation.quotation_id" },
    { label: "Project Type", key: "quotation.project_type" },
    { label: "Day to complete", key: "BookingServices[0].day_to_complete" },
    { label: "Worker", key: "BookingServices[0].worker_names" },
    {
      label: "Vendor Amount",
      key: "BookingServices[0].worker_amount",
      filterable: false,
    },
    { label: "Vendor Payment", key: "payment_mode", filterable: false }, // Add if present
    { label: "Quote Value", key: "quotation.grand_total", filterable: false },
    { label: "Customer Payment", key: "service_charge", filterable: false }, // Add if present
    { label: "Type", key: "type", filterable: false }, // Add if present
    { label: "Deep cleaning details", key: "description", filterable: false }, // if present
    { label: "Actions", filterable: false }, // Add buttons later
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
      <div className="flex justify-between items-center mb-4 mt-8">
        <h2 className="text-xl font-semibold">Running Projects Report</h2>
      </div>

      <div className="mt-4 mb-6 text-sm flex flex-wrap gap-4">
        <p>
          <span className="inline-block w-4 h-4 border bg-blue-400 mr-2"></span>
          Job start
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-green-300 mr-2"></span>
          Deep cleaning Assigned
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-orange-300 mr-2"></span>
          Job closed
        </p>
      </div>

      {/* Table for displaying data */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              {columns.map((col, idx) => {
                let customWidth = "";

                // Set custom widths based on column labels or keys
                if (col.label === "Customer Payment")
                  customWidth = "min-w-[220px]";
                else if (col.label === "Vendor Payment")
                  customWidth = "min-w-[200px]";
                else if (col.label === "Address") customWidth = "min-w-[250px]";
                else if (col.label === "Deep cleaning details")
                  customWidth = "min-w-[200px]";
                else if (col.label === "Contact No.")
                  customWidth = "min-w-[140px]";
                else if (col.label === "Worker") customWidth = "min-w-[150px]";
                else if (col.label === "Date") customWidth = "min-w-[100px]";
                else if (col.label === "Day to complete")
                  customWidth = "min-w-[100px]";

                return (
                  <th
                    key={idx}
                    className={`border border-gray-200 px-4 py-3 text-xs font-semibold text-left bg-gray-100 text-gray-800 ${customWidth}`}
                  >
                    {col.label}
                    {col.key &&
                      col.filterable !== false &&
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
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="border-b transition cursor-pointer bg-white hover:bg-gray-100"
                onClick={() => handleRowClick(row.id)}
              >
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {rowIndex + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {moment(row?.createdAt).format("MM-DD-YYYY")}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.category}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation.booked_by}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation.sales_executive}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.customer.customerName}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.customer.mainContact}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.delivery_address.address}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.city}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation.quotation_id}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation.project_type}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.BookingServices[0].day_to_complete}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.BookingServices[0].worker_names}
                </td>
                {/* Vendor Amount */}
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  ₹{row?.BookingServices[0]?.worker_amount || "0.00"}
                </td>

                {/* Vendor Payment */}
                <td className="border border-gray-200 px-3 py-2 text-xs text-black">
                  {(() => {
                    const vendorPayments = row?.payments?.filter(
                      (p) => p.paymen_type === "Vendor"
                    );
                    const totalVendorPaid = vendorPayments?.reduce(
                      (sum, p) => sum + parseFloat(p.amount || 0),
                      0
                    );
                    const vendorDue = parseFloat(
                      (row?.BookingServices[0]?.worker_amount || 0) -
                        totalVendorPaid
                    );

                    return (
                      <div className="space-y-1">
                        {vendorPayments?.map((p) => (
                          <div key={p.id}>
                            ({p.payment_date}) ₹{p.amount}
                          </div>
                        ))}

                        {totalVendorPaid > 0 && (
                          <>
                            <div className="font-semibold mt-1">
                              Total: ₹{totalVendorPaid.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-700">
                              Pending: ₹{vendorDue.toFixed(2)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </td>

                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation.grand_total}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs font-medium text-black">
                  {(() => {
                    const customerPayments = row?.payments?.filter(
                      (p) => p.paymen_type === "Customer"
                    );
                    const totalPaid = customerPayments?.reduce(
                      (sum, p) => sum + parseFloat(p.amount || 0),
                      0
                    );
                    const totalQuote = parseFloat(
                      row?.quotation?.grand_total || 0
                    );
                    const pending = totalQuote - totalPaid;

                    return (
                      <div className="space-y-1">
                        {customerPayments?.map((p) => (
                          <div key={p.id}>
                            ({moment(p.payment_date).format("DD-MM-YYYY")}) ₹
                            {p.amount}
                          </div>
                        ))}

                        {totalPaid > 0 && (
                          <>
                            <div className="font-semibold mt-1">
                              Total: ₹{totalPaid.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-700">
                              Pending: ₹{pending.toFixed(2)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </td>

                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.descriptiont}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.descriptiont}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  <button
                    className="text-blue-600 hover:underline mr-3"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      navigate(
                        `/Painting?service_id=${row.id}&enquiry_id=${row.enquiryId}`
                      );
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      setSelectedId(row.id);
                      setShowModal(true);
                    }}
                  >
                    Close
                  </button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Close Confirmation</h2>
            <p className="mb-4">
              Are you sure you want to close project #{selectedId}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm rounded bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded bg-red-600 text-white"
                onClick={() => {
                  console.log("Close confirmed for", selectedId);
                  // TODO: Add API call to close project here
                  setShowModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunningProjects;
