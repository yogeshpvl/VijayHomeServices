import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import moment from "moment";
import { toast } from "react-toastify";

const RunningProjects = () => {
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedContactNo, setSelectedContactNo] = useState("");
  const [selectedJobAmount, setSelectedJobAmount] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [sales_executive, setsales_executive] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorData, setvendorData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const itemsPerPage = 25;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data?.slice(startIndex, endIndex);

  // Fetch data from the backend

  console.log("selectedName", selectedName);

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

            city: selectedCity || users.city.map((user) => user.name).join(","),
            category: selectedCategory,
            technician: selectedTechnician,
            paymentMode: selectedPaymentMode,
            sales_executive,
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

    currentPage,
  ]);

  // Handle row click to navigate to details page
  const handleRowClick = (id) => {
    navigate(`/DSR/DSRDetails/${id}`);
  };

  const [PMData, setPMData] = useState([]);
  const [ExecutiveData, seExecutiveData] = useState([]);

  const fetchPMVendors = async () => {
    const assignTopm = "PM";

    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/vendors/type/${assignTopm}`
      );

      setPMData(response.data);
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  const fetchEXEVendors = async () => {
    const assignTopm = "Executive";

    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/vendors/type/${assignTopm}`
      );

      seExecutiveData(response.data);
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };
  useEffect(() => {
    fetchPMVendors();
    fetchEXEVendors();
  }, []);

  const closed = async () => {
    const res = await axios.put(
      `${config.API_BASE_URL}/bookingService/pm-start-project/${selectedId}?pm_status=CLOSED`
    );

    if (res.status === 200) {
      fetchData();
      toast.success("Project closed Added");
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
            <tr className="border-b transition cursor-pointer bg-white hover:bg-gray-100">
              <td className="border border-gray-200 px-3 py-2 text-xs">
                sl no
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">Date</td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Category
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Project Manager
                <select
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={selectedTechnician} // Bind value to state
                  onChange={(e) => setSelectedTechnician(e.target.value)} // Update state on change
                >
                  <option value="">--Select--</option>
                  {PMData?.map((vendor, index) => (
                    <option key={index} value={vendor.vhsname}>
                      {vendor.vhsname}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Sales Executive
                <select
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={sales_executive} // Bind value to state
                  onChange={(e) => setsales_executive(e.target.value)} // Update state on change
                >
                  <option value="">--Select--</option>
                  {ExecutiveData?.map((vendor, index) => (
                    <option key={index} value={vendor.vhsname}>
                      {vendor.vhsname}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Customer
                <input
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={selectedName} // Bind value to state
                  onChange={(e) => setSelectedName(e.target.value)} // Update state on change
                />
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Contact No.
                <input
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={selectedContactNo} // Bind value to state
                  onChange={(e) => setSelectedContactNo(e.target.value)} // Update state on change
                />
              </td>
              <td className="min-w-[150px] border border-gray-200 px-3 py-2 text-xs">
                Address
                <input
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={selectedAddress} // Bind value to state
                  onChange={(e) => setSelectedAddress(e.target.value)} // Update state on change
                />
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                City
                <select
                  className="mt-1 w-full border border-gray-300 px-2 py-1 rounded text-xs bg-white"
                  value={selectedCity} // Bind value to state
                  onChange={(e) => setSelectedCity(e.target.value)} // Update state on change
                >
                  <option value="">--Select--</option>
                  {users?.city?.map((city, index) => (
                    <option key={index} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Quote id
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Project Type
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Day to complete
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Worker
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Vendor Amount
              </td>
              <td className=" min-w-[200px] border border-gray-200 px-3 py-2 text-xs text-black">
                Vendor Payment
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Quote Value
              </td>
              <td className="min-w-[200px] border border-gray-200 px-3 py-2 text-xs font-medium text-black">
                Customer Payment
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">Type</td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Deep cleaning details
              </td>
              <td className="border border-gray-200 px-3 py-2 text-xs">
                Action
              </td>
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="border-b transition cursor-pointer bg-white hover:bg-gray-100"
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
                  {row?.BookingServices[0]?.vendor_name}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation?.sales_executive}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.customer?.customerName}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.customer?.mainContact}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.delivery_address?.address}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.city}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation?.quotation_id}
                </td>
                <td className="border border-gray-200 px-3 py-2 text-xs">
                  {" "}
                  {row?.quotation?.project_type}
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
                  {row?.quotation?.grand_total}
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
                      setSelectedId(row.BookingServices[0]?.id);
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
                  closed();
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
