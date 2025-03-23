import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";

function CustomerDetailsPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [treatments, setTreatments] = useState([]);
  const [pastServices, setPastServices] = useState([]);
  const [futureServices, setFutureServices] = useState([]);

  useEffect(() => {
    fetchCustomer();
    fetchTreatments();
    fetchPastServices();
    fetchFutureServices();
  }, [id]);

  const fetchCustomer = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/customers/${id}`);
    setCustomer(res.data);
  };

  const fetchTreatments = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/treatments/by-customer/${id}`
    );
    setTreatments(res.data);
  };

  const fetchPastServices = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/services/past/${id}`);
    setPastServices(res.data);
  };

  const fetchFutureServices = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/services/future/${id}`);
    setFutureServices(res.data);
  };

  const [form, setForm] = useState({
    category: "",
    contractType: "",
    treatment: "",
    serviceFrequency: "",
    serviceCharge: "",
    firstServiceDate: "",
    expiryDate: "",
    community: "",
    amountFrequency: "",
    amtExpiryDate: "",
    amtPaidDate: "",
    slots: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (editIndex !== null) {
      const updated = [...treatments];
      updated[editIndex] = form;
      setTreatments(updated);
      setEditIndex(null);
    } else {
      setTreatments([...treatments, form]);
    }

    setForm({
      category: "",
      contractType: "",
      treatment: "",
      serviceFrequency: "",
      serviceCharge: "",
      firstServiceDate: "",
      expiryDate: "",
      community: "",
      amountFrequency: "",
      amtExpiryDate: "",
      amtPaidDate: "",
      slots: "",
      latitude: "",
      longitude: "",
      description: "",
    });
  };

  const handleEdit = (index) => {
    setForm(treatments[index]);
    setEditIndex(index);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-md p-4 text-sm border-2 border-gray-200">
        <div className="flex justify-between">
          <h2 className="text-base font-semibold mb-3">Customer Info</h2>
          <button
            className="bg-red-800 text-white px-4 py-1.5 rounded text-sm"
            onClick={() => window.open(`/customer/edit/${id}`, "_blank")}
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-medium">Customer Name:</label>
            <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
              {customer.customerName || "-"}
            </div>
          </div>
          <div>
            <label className="font-medium">Mobile No:</label>
            <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
              {customer.mainContact || "-"}
            </div>
          </div>
          <div>
            <label className="font-medium">Email:</label>
            <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
              {customer.email || "-"}
            </div>
          </div>
          <div>
            <label className="font-medium">Address:</label>
            <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
              {customer.lnf || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white-500 rounded-md shadow-lg text-sm mt-4 border-2 border-gray-200">
        <h3 className="font-semibold mb-3">Treatment Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label className="block font-medium mb-1">
              Category <span className="text-red-800">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            >
              <option>--select--</option>
              <option>Cleaning</option>
            </select>
          </div>

          {/* Contract Type */}
          <div>
            <label className="block font-medium mb-1">
              Contract Type <span className="text-red-800">*</span>
            </label>
            <select
              name="contractType"
              value={form.contractType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            >
              <option>--select--</option>
              <option>AMC</option>
              <option>One Time</option>
            </select>
          </div>

          {/* Treatment */}
          <div>
            <label className="block font-medium mb-1">
              Treatment <span className="text-red-800">*</span>
            </label>
            <select
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            >
              <option>--select--</option>
              <option>Bathroom Manual Cleaning</option>
            </select>
          </div>

          {/* AMC Specific Fields */}
          {form.contractType === "AMC" && (
            <>
              <div>
                <label className="block font-medium mb-1">
                  Service Frequency <span className="text-red-800">*</span>
                </label>
                <Input
                  name="serviceFrequency"
                  value={form.serviceFrequency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  1st Service Date
                </label>
                <Input
                  type="date"
                  name="firstServiceDate"
                  value={form.firstServiceDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Expiry Date</label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
            </>
          )}

          {/* Service Charge */}
          <div>
            <label className="block font-medium mb-1">
              Service Charge <span className="text-red-800">*</span>
            </label>
            <Input
              name="serviceCharge"
              value={form.serviceCharge}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            />
          </div>

          {/* Amount Paid Date */}
          <div>
            <label className="block font-medium mb-1">Amount Paid Date</label>
            <Input
              type="date"
              name="amtPaidDate"
              value={form.amtPaidDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
              rows={2}
            />
          </div>

          {/* Slots */}
          <div>
            <label className="block font-medium mb-1">Slots</label>
            <Input
              name="slots"
              value={form.slots}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block font-medium mb-1">Latitude</label>
            <Input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block font-medium mb-1">Longitude</label>
            <Input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddItem}
          className="mt-4 bg-red-800 text-white px-4 py-1.5 rounded"
        >
          {editIndex !== null ? "Update Item" : "Add Item"}
        </button>
      </div>

      {/* Treatment Details Table */}
      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border-2 border-gray-100">
        <h2 className="text-base font-semibold mb-3">Treatment Details</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Contract</th>
              <th className="border px-2 py-1">Treatment</th>
              <th className="border px-2 py-1">Service Date</th>
              <th className="border px-2 py-1">Paid Date</th>
              <th className="border px-2 py-1">Charges</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treat, index) => (
              <tr key={treat.id}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{treat.category}</td>
                <td className="border px-2 py-1">{treat.contractType}</td>
                <td className="border px-2 py-1">{treat.treatment}</td>
                <td className="border px-2 py-1">{treat.serviceDate}</td>
                <td className="border px-2 py-1">{treat.amountPaidDate}</td>
                <td className="border px-2 py-1">{treat.totalCharges}</td>
                <td className="border px-2 py-1">{treat.description}</td>
                <td className="border px-2 py-1 text-blue-700 cursor-pointer text-xs">
                  <span>Edit</span> |{" "}
                  <span
                    onClick={() => window.open(`/bill/${treat.id}`, "_blank")}
                  >
                    BILL
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Past Services */}
      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border-2 border-gray-100">
        <h2 className="text-base font-semibold mb-3">
          Previous / Past Services
        </h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Complaint</th>
              <th className="border px-2 py-1">Technician</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {pastServices.map((srv, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{srv.date}</td>
                <td className="border px-2 py-1">{srv.jobCategory}</td>
                <td className="border px-2 py-1">{srv.complaint}</td>
                <td className="border px-2 py-1">{srv.technician}</td>
                <td className="border px-2 py-1">{srv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Future Services */}
      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border-2 border-gray-100">
        <h2 className="text-base font-semibold mb-3">
          Next / Future Service Calls
        </h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Treatment</th>
              <th className="border px-2 py-1">Service Date</th>
              <th className="border px-2 py-1">Amount Paid Date</th>
              <th className="border px-2 py-1">Service Charges</th>
              <th className="border px-2 py-1">Technician</th>
            </tr>
          </thead>
          <tbody>
            {futureServices.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.treatment}</td>
                <td className="border px-2 py-1">{item.serviceDate}</td>
                <td className="border px-2 py-1">{item.amountPaidDate}</td>
                <td className="border px-2 py-1">{item.serviceCharges}</td>
                <td className="border px-2 py-1">{item.technician}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerDetailsPage;
