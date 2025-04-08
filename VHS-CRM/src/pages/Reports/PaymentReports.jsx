import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import axios from "axios";
import { config } from "../../services/config";

function PaymentReport() {
  const users = JSON.parse(localStorage.getItem("user"));
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
  const [paymentMode, setPaymentMode] = useState("");
  const [jobComplete, setJobComplete] = useState("");
  const [referenceData, setReferenceData] = useState([]);
  const [serviceDetails, setserviceDetails] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [vendorData, setvendorData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

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
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dsrData.slice(startIndex, endIndex);

  useEffect(() => {
    if (category) {
      getServicebyCategory();
    }
  }, [category]);

  const getServicebyCategory = async () => {
    try {
      const res = await axios.post(
        `https://vijayhomeservicebangalore.in/api/userapp/getservicebycategory/`,
        { category }
      );

      if (res.status === 200 && Array.isArray(res.data?.serviceData)) {
        setserviceDetails(res.data.serviceData);
      } else {
        setserviceDetails([]); // fallback to empty
      }
    } catch (error) {
      console.warn(
        "Silent API error (category fetch)",
        error?.message || error
      );
      setserviceDetails([]); // fallback to empty
    }
  };

  useEffect(() => {
    fetchReference();
    getuser();
  }, []);

  const fetchReference = async () => {
    const response = await fetch(`${config.API_BASE_URL}/reference`);
    const data = await response.json();
    setReferenceData(data);
  };

  const getuser = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/users`);
      if (res.status === 200) {
        setUserdata(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      if (city && category) {
        try {
          const response = await axios.get(
            `${config.API_BASE_URL}/vendors/filterForDSR/?city=${city}&category=${category}`
          );
          setvendorData(response.data);
        } catch (error) {
          console.error("Error fetching details", error);
        }
      } else {
        console.log("Missing city, category, or vendorType data.");
      }
    };

    fetchVendors();
  }, [category, city]);

  const handleShow = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/getPaymentReportFilter`,
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
            paymentMode,
            jobComplete,
            page: currentPage,
            limit: 25,
          },
        }
      );

      setDsrData(response.data?.data);
      setShowTable(true);
    } catch (err) {
      console.error("Error fetching DSR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const params = new URLSearchParams({
      fromdate: fromDate,
      todate: toDate,
      city,
      category,
      technician,
      backoffice: executive,
      jobType,
      reference,
      paymentMode,
      jobComplete,
    });

    const response = await fetch(
      `${config.API_BASE_URL}/bookingService/exportPAYMMENTReport?${params}`
    );
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payment_Report_${fromDate}_to_${toDate}.xlsx`;
    a.click();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white p-6 rounded-lg shadow">
        {/* Filter Section */}
        <div className="bg-white max-w-4xl mx-auto p-6">
          <h2 className="text-xl font-bold text-red-800 text-center mb-6">
            Payment Report – Filter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {users?.city?.map((city, index) => (
                  <option value={city.name}>{city.name}</option>
                ))}
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
                {users?.category?.map((category, index) => (
                  <option value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Technician (Dropdown) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Technician
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="">-- Select --</option>
                {vendorData.map((item) => (
                  <option value={item.vhsname}>{item.vhsname}</option>
                ))}
              </select>
            </div>

            {/* Backoffice Executive (Dropdown) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Backoffice Executive
              </label>
              <select
                value={executive}
                onChange={(e) => setExecutive(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option>-- Select --</option>
                {userdata.map((item) => (
                  <option value={item.displayname}>{item.displayname}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="">-- Select --</option>
                {serviceDetails.map((item) => (
                  <option value={item.serviceName}>{item.serviceName}</option>
                ))}
              </select>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option>-- Select --</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Job Complete */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Complete
              </label>
              <select
                value={jobComplete}
                onChange={(e) => setJobComplete(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option>-- Select --</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
                <option value="CANCEL">Cancel</option>
              </select>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference
              </label>
              <select
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option>-- Select --</option>
                {referenceData.map((item) => (
                  <option value={item.reference}>{item.reference}</option>
                ))}
              </select>
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
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              📥 Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        {showTable && (
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
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
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

                        const serviceCharge = parseFloat(
                          row?.service_charge || 0
                        );
                        const pending = serviceCharge - total;

                        return (
                          <div className="space-y-1">
                            {customerPayments.map((p) => (
                              <div key={p.id}>
                                ({moment(p.payment_date).format("DD/MM/YYYY")})
                                ₹{p.amount} ({p.payment_mode})
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
                        (sum, row) =>
                          sum + parseFloat(row?.service_charge || 0),
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
        )}
      </div>
    </div>
  );
}

export default PaymentReport;
