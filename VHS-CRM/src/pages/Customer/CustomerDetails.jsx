import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";
import moment from "moment";
import { toast } from "react-toastify";

function CustomerDetailsPage() {
  const { id } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const enquiryId = queryParams.get("enquiry");

  const users = JSON.parse(localStorage.getItem("user"));
  const [customer, setCustomer] = useState({});
  const [CustomerAddressData, setCustomerAddressData] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [pastServices, setPastServices] = useState([]);
  const [futureServices, setFutureServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  console.log("customer", customer);
  const [form, setForm] = useState({
    category: "",
    contract_type: "",
    service: "",
    serviceFrequency: "",
    service_charge: "",
    start_date: "",
    expiry_date: "",
    community: "",
    amt_frequency: "",
    amtstart_date: "",
    amtexpiry_date: "",
    selected_slot_text: "",
    latitude: 0,
    longitude: 0,
    description: "",
    service_id: "",
  });

  console.log("form", form);
  useEffect(() => {
    fetchCustomer();
    fetchTreatments();
    fetchPastServices();
    fetchFutureServices();
    fetchAllServicesByUser();
    fetchCustomerAddress();
  }, [id]);

  const fetchCustomer = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/customers/${id}`);
    setCustomer(res.data);
  };
  const fetchCustomerAddress = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/customer-address/address/user${id}`
    );
    setCustomerAddressData(res.data);
  };

  const fetchTreatments = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/bookings/by-customer/${id}`
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

  const fetchAllServicesByUser = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/services/by-user/${id}`
    );
    setAllServices(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for serviceFrequency
    if (name === "serviceFrequency") {
      const num = Number(value);

      // Allow empty input for typing
      if (value === "") {
        setForm((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      // Allow only numbers between 1 and 6
      if (num < 1 || num > 6) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    if (!customer.city) {
      toast.error(
        "Please add the city for this customer! please click the edit customer update the city then come back"
      );
    }
    if (!customer.lnf) {
      toast.error(
        "Please add the  address this customer! please click the edit customer update the address then come back"
      );
    }
    try {
      const payload = {
        ...form,
        user_id: id,
        start_date: form.start_date,
        city: customer.city,
        type: customer.approach,
        backoffice_executive: users.displayname,
        amt_frequency: form.serviceFrequency,
        amtstart_date: form.start_date,
        amtexpiry_date: form.expiry_date,
        enquiryId: enquiryId || customer?.enquiryId,
        delivery_address: {
          address: customer.lnf,
          save_as: customer.mainArea,
          landmark: customer.rbhf,
          platno: customer.cnap,
        },
        expiry_date:
          form.contract_type === "AMC" ? form.expiry_date : form.start_date,
      };

      await axios.post(`${config.API_BASE_URL}/bookings/create`, payload);

      setForm({
        category: "",
        contract_type: "",
        service: "",
        serviceFrequency: "",
        service_charge: "",
        start_date: "",
        expiry_date: "",
        community: "",
        amt_frequency: "",
        amtstart_date: "",
        amtexpiry_date: "",
        selected_slot_text: "",
        latitude: 0,
        longitude: 0,
        description: "",
      });

      fetchTreatments();
    } catch (error) {
      console.error("Error while adding booking", error);
    }
  };

  const handleEdit = (index) => {
    setForm(treatments[index]);
    setEditIndex(index);
  };

  const [serviceDetails, setserviceDetails] = useState([]);
  useEffect(() => {
    if (form.category) {
      getServicebyCategory();
    }
  }, [form.category]);

  const getServicebyCategory = async () => {
    const category = form.category;
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
              {users?.category?.map((category, index) => (
                <option value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Contract Type */}
          <div>
            <label className="block font-medium mb-1">
              Contract Type <span className="text-red-800">*</span>
            </label>
            <select
              name="contract_type"
              value={form.contract_type}
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
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            >
              <option>--select--</option>
              {serviceDetails.map((item) => (
                <option value={item.serviceName}>{item.serviceName}</option>
              ))}
            </select>
          </div>

          {form.contract_type === "AMC" ? (
            <>
              <div>
                <label className="block font-medium mb-1">
                  Service Frequency <span className="text-red-800">*</span>
                </label>
                <Input
                  type="number"
                  name="serviceFrequency"
                  value={form.serviceFrequency}
                  onChange={handleChange}
                  min={1}
                  max={6}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  1st Service Date
                </label>
                <Input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Expiry Date</label>
                <Input
                  type="date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>

              {/* Service Charge */}
              <div>
                <label className="block font-medium mb-1">
                  Service Charge <span className="text-red-800">*</span>
                </label>
                <Input
                  name="service_charge"
                  value={form.service_charge}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>

              {/* Contract Type */}
              <div>
                <label className="block font-medium mb-1">
                  1Community <span className="text-red-800">*</span>
                </label>
                <select
                  name="community"
                  value={form.community}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                >
                  <option>--select--</option>
                  <option>comunit</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Amount Frequency
                </label>
                <Input
                  name="amt_frequency"
                  value={form.serviceFrequency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded bg-gray-200"
                />
              </div>
              {/* Amount Paid Date */}
              <div>
                <label className="block font-medium mb-1">
                  1st Service Amt Date
                </label>
                <Input
                  type="date"
                  name="amtstart_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded bg-gray-200"
                />
              </div>
              {/* Amount Paid Date */}
              <div>
                <label className="block font-medium mb-1">
                  Amt Expiry Date
                </label>
                <Input
                  type="date"
                  name="amtexpiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded bg-gray-200"
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
            </>
          ) : (
            <>
              {/* Service Charge */}
              <div>
                <label className="block font-medium mb-1">
                  Service Charge <span className="text-red-800">*</span>
                </label>
                <Input
                  name="service_charge"
                  value={form.service_charge}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-1.5 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Service Date</label>
                <Input
                  type="date"
                  name="start_date"
                  value={form.start_date}
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
            </>
          )}

          {/* selected_slot_text */}
          <div>
            <label className="block font-medium mb-1">
              Slot <span className="text-red-800">*</span>
            </label>

            <select
              name="selected_slot_text"
              value={form.selected_slot_text}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1.5 rounded"
            >
              <option value="">--select--</option>
              <option value="9AM-10AM">9AM-10AM</option>
              <option value="10AM-11AM">10AM-11AM</option>
              <option value="11AM-12PM">11AM-12PM</option>
              <option value="12PM-1PM">12PM-1PM</option>
              <option value="1PM-2PM">1PM-2PM</option>
              <option value="2PM-3PM">2PM-3PM</option>
              <option value="3PM-4PM">3PM-4PM</option>
              <option value="4PM-5PM">4PM-5PM</option>
              <option value="5PM-6PM">5PM-6PM</option>
            </select>
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

      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Treatment Details
        </h2>
        <div className="overflow-auto rounded-md">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  #
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Category
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Contract
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Treatment
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Frequency
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Contract Period
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Paid Date
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Charges
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Description
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treat, index) => (
                <tr
                  key={treat.id}
                  className="even:bg-gray-150 hover:bg-blue-50 transition"
                >
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.category}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {treat.contract_type}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.service}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.serviceFrequency}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {moment(treat.start_date).format("DD MMM YYYY")} -{" "}
                    {moment(treat.expiry_date).format("DD MMM YYYY")}
                  </td>
                  <td className="border border-gray-200  px-3 py-2">
                    {treat.amtPaidDate
                      ? moment(treat.amtPaidDate).format("DD MMM YYYY")
                      : "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    ₹ {treat.service_charge}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {treat.description}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 space-x-2">
                    {/* <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => window.open(`/bill/${treat.id}`, "_blank")}
                      className="text-green-600 hover:underline text-base"
                    >
                      Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Select Address</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {CustomerAddressData.map((addr, index) => (
                <label
                  key={index}
                  className="block border p-2 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={index}
                    checked={selectedAddress?.id === addr.id}
                    onChange={() => setSelectedAddress(addr)}
                    className="mr-2"
                  />
                  {addr.save_as} - {addr.address}, {addr.landmark}
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-800 text-white px-4 py-1 rounded"
                onClick={() => {
                  // do something with selectedAddress
                  // e.g., update state or call update API
                  console.log("Selected Address:", selectedAddress);
                  setShowAddressModal(false);
                }}
                disabled={!selectedAddress}
              >
                {editIndex !== null ? "Update Address" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default CustomerDetailsPage;
