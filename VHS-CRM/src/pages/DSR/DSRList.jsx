import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../services/config";

const DSRList = () => {
  const navigate = useNavigate();
  const { date, category } = useParams(); // Get the date and category from URL params
  const users = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  // Pagination controls
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  console.log("data", data);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityList = users.city.map((user) => user.name).join(",");
        const response = await axios.get(
          `${config.API_BASE_URL}/bookingService/dailydata`,
          {
            params: {
              date,
              city: cityList,
              category: selectedCategory,
              technician: selectedTechnician,
              jobType: selectedJobType,
              paymentMode: selectedPaymentMode,
              page: currentPage,
              limit: itemsPerPage,
            },
          }
        );

        // Set the data and pagination info
        setData(response.data.data); // Set the array of data (the list of services)
        setTotalPages(response.data.totalPages); // Set total pages dynamically
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [
    date,
    selectedCategory,
    selectedCity,
    selectedTechnician,
    selectedJobType,
    selectedPaymentMode,
    currentPage,
  ]);

  // Handle row click to navigate to details page
  const handleRowClick = (id) => {
    navigate(`/DSR/DSRDetails/${id}`);
  };

  // Handle filter change for all fields
  const handleFilterChange = (e, field) => {
    const value = e.target.value;
    if (field === "category") {
      setSelectedCategory(value);
    } else if (field === "city") {
      setSelectedCity(value);
    } else if (field === "technician") {
      setSelectedTechnician(value);
    } else if (field === "jobType") {
      setSelectedJobType(value);
    } else if (field === "paymentMode") {
      setSelectedPaymentMode(value);
    }
  };

  return (
    <div className="rounded-lg shadow-lg p-4 bg-white">
      <div className="flex justify-end">
        <div className="shadow-sm border border-gray-300">
          {/* Status filters */}
          <div className="px-1 py-1 border-b border-gray-300 cursor-pointer">
            NOT ASSIGNED
          </div>
          <div className="px-1 py-1 bg-gray-300 cursor-pointer">
            ASSIGNED FOR TECHNICIAN
          </div>
          <div className="px-1 py-1 bg-yellow-300 cursor-pointer">
            SERVICE STARTED
          </div>
          <div className="px-1 py-1 bg-green-300 cursor-pointer">
            SERVICE COMPLETED
          </div>
          <div className="px-1 py-1 bg-red-300 cursor-pointer">
            SERVICE CANCELLED
          </div>
          <div className="px-1 py-1 bg-blue-300 cursor-pointer">
            SERVICE DELAYED
          </div>
          <div className="px-1 py-1 bg-purple-300 cursor-pointer">
            CLOSED OPERATION MANAGER
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Daily Service Report -{category}
        </h2>
      </div>

      {/* Table for displaying data */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-red-100 text-pink-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Sr.No.
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Time
                <input
                  type="text"
                  value={selectedCity}
                  onChange={(e) => handleFilterChange(e, "city")}
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Customer Name
                <input
                  type="text"
                  value={selectedTechnician}
                  onChange={(e) => handleFilterChange(e, "technician")}
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                City
                <select
                  name="city"
                  // value={formData.city}
                  // onChange={handleChange}
                  required
                  className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
                >
                  <option value="">--Select--</option>
                  {users?.city?.map((city, index) => (
                    <option value={city.name}>{city.name}</option>
                  ))}
                </select>
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Address
                <input
                  type="text"
                  value={selectedPaymentMode}
                  onChange={(e) => handleFilterChange(e, "paymentMode")}
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Contact No.
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300">
                Technician
                <select
                  name="technicain"
                  // value={formData.city}
                  // onChange={handleChange}
                  required
                  className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
                >
                  <option value="">--Select--</option>

                  <option value="tech1">tech1</option>
                  <option value="tech1">tech1</option>
                </select>
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 ">
                Job Type
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 ">
                Job Amount
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white "
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 ">
                Payment Mode
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 ">
                Description
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 ">
                Reference
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded-md w-full bg-white"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                className="border-b border-gray-300 bg-white hover:bg-pink-50 cursor-pointer transition"
              >
                <td className="px-4 py-3 text-xs">{startIndex + index + 1}</td>
                <td className="px-4 py-3 text-xs">{row.service_date}</td>
                <td className="px-4 py-3 text-xs">
                  {row.Booking.selected_slot_text}
                </td>
                <td className="px-4 py-3 text-xs">
                  {row.Booking.customer.customerName}
                </td>
                <td className="px-4 py-3 text-xs">{row.Booking.city}</td>
                <td className="px-4 py-3 text-xs">
                  {row.Booking.delivery_address}
                </td>
                <td className="px-4 py-3 text-xs">
                  {row.Booking.customer.mainContact}
                </td>
                <td className="px-4 py-3 text-xs">{row.technician}</td>
                <td className="px-4 py-3 text-xs">{row.service_name}</td>
                <td className="px-4 py-3 text-xs">{row.service_charge}</td>
                <td className="px-4 py-3 text-xs">
                  {row.Booking.payment_mode}
                </td>
                <td className="px-4 py-3 text-xs">{row.Booking.description}</td>
                <td className="px-4 py-3 text-xs">{row.Booking.reference}</td>
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
