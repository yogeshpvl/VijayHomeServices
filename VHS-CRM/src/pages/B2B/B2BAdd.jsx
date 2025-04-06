import React, { useEffect, useState } from "react";
import moment from "moment";
import { Input } from "../../components/ui/Input";
import axios from "axios";
import { config } from "../../services/config";
import { toast } from "react-toastify";

const B2BAdd = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [allb2btype, setAllb2btype] = useState([]);
  const [allApproach, setallApproach] = useState([]);
  const [formData, setFormData] = useState({
    b2bname: "",
    b2b_id: "",
    contactperson: "",
    maincontact: "",
    alternateno: "",
    email: "",
    gst: "",
    address: "",
    city: "",
    b2btype: "",
    approach: "",
    executive_name: users?.displayname,
    executive_number: users?.contactno,
    instructions: "",
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm"),
  });

  console.log("users", users);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({});
  };

  useEffect(() => {
    fetchB2Btype();
    fetchApproach();
  }, []);

  const fetchB2Btype = async () => {
    try {
      const response = await axios.get("http://192.168.0.102:5000/api/b2btype");

      console.log("response", response);
      setAllb2btype(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchApproach = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.102:5000/api/reference"
      );
      console.log("response", response);
      setallApproach(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("allApproach", allApproach);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.0.102:5000/api/b2b",
        formData,
        config
      );

      if (response.status === 201) {
        setFormData({
          b2bname: "",
          b2b_id: "",
          contactperson: "",
          maincontact: "",
          alternateno: "",
          email: "",
          gst: "",
          address: "",
          city: "",
          b2btype: "",
          approach: "",
          executive_name: users?.displayname || "",
          executive_number: users?.mobile || "",
          instructions: "",
          date: moment().format("YYYY-MM-DD"),
          time: moment().format("HH:mm"),
        });
      } else {
        toast.error("❌ Failed to save B2B entry.");
      }
    } catch (error) {
      toast.error(
        "❌ Error: " + (error.response?.data?.error || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        New B2B Entry
      </h2>

      <form className="grid grid-cols-3 gap-6">
        {/* B2B Name */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            B2B Name *
          </label>
          <Input
            type="text"
            name="b2bname"
            required
            value={formData.b2bname}
            onChange={handleChange}
          />
        </div>

        {/* B2B ID */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            B2B ID
          </label>
          <Input
            type="text"
            name="b2b_id"
            value={formData.b2b_id}
            onChange={handleChange}
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contact Person *
          </label>
          <Input
            type="text"
            name="contactperson"
            required
            value={formData.contactperson}
            onChange={handleChange}
          />
        </div>

        {/* Main Contact */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Main Contact *
          </label>
          <Input
            type="text"
            name="maincontact"
            required
            maxLength={10}
            value={formData.maincontact}
            onChange={handleChange}
          />
        </div>

        {/* Alternate Number */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Alternate Number
          </label>
          <Input
            type="text"
            name="alternateno"
            maxLength={10}
            value={formData.alternateno}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* GST */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            GST
          </label>
          <Input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Address
          </label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            City
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="">--Select--</option>
            {users?.city?.map((city, index) => (
              <option value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* B2B Type */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            B2B Type
          </label>

          <select
            name="b2btype"
            value={formData.b2btype}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="">--Select--</option>

            {allb2btype?.map((b2b, index) => (
              <option value={b2b.b2btype}>{b2b.b2btype}</option>
            ))}
          </select>
        </div>

        {/* Approach */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Approach
          </label>
          {/* <Input
            type="text"
            name="approach"
            value={formData.approach}
            onChange={handleChange}
          /> */}
          <select
            name="approach"
            value={formData.approach}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="">--Select--</option>

            {allApproach?.map((data, index) => (
              <option value={data?.reference}>{data?.reference}</option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div className="col-span-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Instructions
          </label>
          <textarea
            name="instructions"
            rows="2"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          ></textarea>
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Date
          </label>
          <Input
            type="text"
            name="date"
            disabled
            value={formData.date}
            className="bg-gray-200"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Time
          </label>
          <Input
            type="text"
            name="time"
            disabled
            value={formData.time}
            className="bg-gray-200"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-3 flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="bg-red-800 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-red-900 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-gray-600 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default B2BAdd;
