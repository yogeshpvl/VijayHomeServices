import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { useParams } from "react-router-dom";
import { config } from "../../services/config";
import axios from "axios";
import moment from "moment";
// import { CalendarIcon, WhatsappIcon } from "lucide-react";

const DSRDetails = () => {
  const { id } = useParams(); // Get the id from URL
  const [details, setDetails] = useState(null);
  const [vendorType, setvendorType] = useState("PM");
  const [vendorData, setvendorData] = useState([]);

  console.log("vendorData", vendorData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/bookingService/service/${id}`
        );

        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching details", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/vendors/filter/?city=${details?.Booking.city}&category=${details?.Booking?.category}&type=${vendorType}`
        );
        console.log("response", response);
        setvendorData(response.data);
      } catch (error) {
        console.error("Error fetching details", error);
      }
    };

    fetchVendors();
  }, [id]);

  const users = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6  min-h-screen">
      <div className="max mx-auto space-y-6">
        <div className="bg-white shadow rounded-md p-4  mb-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4">Job Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-medium">Booking Date & Time:</label>
              <Input
                className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]"
                value={moment(details?.created_at).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              />
            </div>
            <div>
              <label className="font-medium">Priority Level:</label>
              <select
                name="level"
                className="w-full border border-gray-300 p-1 rounded mt-1"
              >
                <option value="">--select--</option>
                <option value="9AM-10AM">9AM-10AM</option>
                <option value="10AM-11AM">10AM-11AM</option>
                <option value="11AM-12PM">11AM-12PM</option>
              </select>
            </div>
            <div></div>
            <div className="mt-3">
              <label className="font-medium">Appointment Date:</label>
              <Input
                type="date"
                className="mt-1"
                value={details?.service_date}
              />
            </div>
            <div className="mt-3">
              <label className="font-medium">Appointment Time:</label>
              <select
                value={details?.Booking?.selected_slot_text}
                name="appointment_time"
                className="w-full border border-gray-300 p-1 mt-1 rounded"
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
            <div className="mt-3">
              <label className="font-medium">City:</label>
              <select
                name="city"
                className="w-full border border-gray-300 mt-1 p-1 rounded-md"
                value={details?.Booking.city}
                // onChange={handleChange}
              >
                <option value="">--Select City--</option>
                {users?.city?.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-md p-4 mt-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-medium">Customer Name:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.customerName || "-"}
              </div>
            </div>
            <div>
              <label className="font-medium">Contact1:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.mainContact || "-"}
              </div>
            </div>
            <div>
              <label className="font-medium">Contact2:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.alternateContact || "-"}
              </div>
            </div>
            <div>
              <label className="font-medium">City:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.city || "-"}
              </div>
            </div>
            <div>
              <label className="font-medium">Email:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.email || "-"}
              </div>
            </div>
            <div>
              <label className="font-medium">Customer Type:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.approach || "-"}
              </div>
            </div>

            <div>
              <label className="font-medium">Address:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.lnf || "-"}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800">
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
                    Service Date
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-gray-150 hover:bg-blue-50 transition">
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    1
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.Booking?.category}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {details?.Booking?.contract_type}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.service_name}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.Booking?.service_frequency || 1}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {moment(details?.Booking?.start_date).format("DD MMM YYYY")}{" "}
                    -{" "}
                    {moment(details?.Booking?.expiry_date).format(
                      "DD MMM YYYY"
                    )}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {details?.service_date}
                  </td>

                  <td className="border border-gray-200 px-3 py-2 text-right">
                    ₹ {details?.service_charge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow rounded-md p-4 mt-4 mb-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4">
            Service & Repair Information
          </h2>

          {/* Two Columns Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Customer Feedback */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">
                  Customer Feedback:
                </label>
                <textarea className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full" />
              </div>

              {/* Worker Names */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">Worker Names:</label>
                <textarea className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full" />
              </div>

              {/* Day To Complete */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">
                  Day To Complete:
                </label>
                <input
                  type="date"
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                />
              </div>

              {/* Logged User */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">Logged User:</label>
                <input
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                  value="Pankaj 7760779659"
                  readOnly
                />
              </div>

              {/* Backoffice Executive */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">
                  Backoffice Executive:
                </label>
                <input
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                  value="Abhilash"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Job Complete (Radio buttons) */}
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-medium block mb-1">
                    Job Complete:
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      id="yes"
                      name="job_complete"
                      value="YES"
                      className="mr-2"
                    />
                    <label htmlFor="yes" className="mr-4">
                      YES
                    </label>
                    <input
                      type="radio"
                      id="no"
                      name="job_complete"
                      value="NO"
                      className="mr-2"
                    />
                    <label htmlFor="no" className="mr-4">
                      NO
                    </label>
                    <input
                      type="radio"
                      id="no"
                      name="job_complete"
                      value="NO"
                      className="mr-2"
                    />
                    <label htmlFor="no">CANCEL</label>
                  </div>
                </div>
                {/* Whatsapp (Radio buttons) */}
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-medium block mb-1">Whatsapp:</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      id="whatsapp_yes"
                      name="whatsapp"
                      value="YES"
                      className="mr-2"
                    />
                    <label htmlFor="whatsapp_yes" className="mr-4">
                      YES
                    </label>
                    <input
                      type="radio"
                      id="whatsapp_no"
                      name="whatsapp"
                      value="NO"
                      className="mr-2"
                    />
                    <label htmlFor="whatsapp_no">NO</label>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div>
              {/* Technician Comment */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">
                  Technician Comment:
                </label>
                <textarea className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full" />
              </div>

              {/* Worker Amount */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-medium block mb-1">Worker Amount:</label>
                <textarea className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full" />
              </div>

              {/* IN and OUT Sign Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-medium block mb-1">
                    IN Sign Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    className="bg-gray-100 p-1 rounded mt-1 w-full"
                  />
                </div>

                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-medium block mb-1">
                    OUT Sign Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    className="bg-gray-100 p-1 rounded mt-1 w-full"
                  />
                </div>
              </div>

              {/* Mr. Veeresha (Dropdown) */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <div className="flex items-center mt-1 mb-3">
                  <input
                    type="radio"
                    id="yes"
                    name="job_complete"
                    value="YES"
                    className="mr-2"
                  />
                  <label htmlFor="yes" className="mr-4">
                    PM
                  </label>
                  <input
                    type="radio"
                    id="no"
                    name="job_complete"
                    value="NO"
                    className="mr-2"
                  />
                  <label htmlFor="no" className="mr-4">
                    TECH
                  </label>
                  <input
                    type="radio"
                    id="no"
                    name="job_complete"
                    value="NO"
                    className="mr-2"
                  />
                  <label htmlFor="no">VENDOR</label>
                </div>
                <label className="font-medium block mb-1">Mr. Veeresha:</label>
                <select className="w-full border border-gray-300 mt-1 p-1 rounded-md">
                  <option value="--select--">--select--</option>
                  {/* You can add other options here dynamically if needed */}
                </select>
              </div>

              {/* Manual Update Button */}
              <div className="mt-4 border border-gray-300 p-3 rounded-md mb-8">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Manual Update
                </button>
              </div>
            </div>
          </div>

          {/* Buttons at the bottom */}
          <div className="flex justify-between mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Update
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Invoice
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Bill Whatsapp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSRDetails;
