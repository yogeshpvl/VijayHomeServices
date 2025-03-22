import React, { useEffect, useState } from "react";
import EnquiryService from "../../services/enquiryService";
import moment from "moment";
import { Input } from "../../components/ui/Input";
import { toast } from "react-toastify";
import apiService from "../../services/ApiServices";
import axios from "axios";
import { config } from "../../services/config";

const EnquiryCreate = () => {
  const users = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    contact2: "",
    address: "",
    city: "",
    category: "",
    reference1: "",
    reference2: "",
    reference3: "",
    interested_for: "",
    comment: "",
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("LT"),
    executive: users?.displayname,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await EnquiryService.createEnquiry(formData);

      if (response && response.success) {
        // Assuming 201 means success
        toast.success("✅ Enquiry saved successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          date: moment().format("YYYY-MM-DD"),
          time: moment().format("LT"),
          contact2: "",
          address: "",
          city: "",
          category: "",
          reference1: "",
          reference2: "",
          reference3: "",
          interested_for: "",
          comment: "",
          executive: users?.displayname,
        });
      } else {
        toast.error("❌ Failed to save enquiry. Please try again.");
      }
    } catch (error) {
      toast.error(
        "❌ Error saving enquiry. " + (error.response?.data?.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const [EnquiryId, setEnquiryId] = useState();

  useEffect(() => {
    fetchLastEnquieyrId();
  }, []);

  const fetchLastEnquieyrId = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}${config.LAST_ENQUIRY_ID}`
      );
      console.log("response", response.data.lastEnquiryId);
      setEnquiryId(response.data.lastEnquiryId || 1);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };
  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">New Enquiry</h2>

      {message && <p className="text-center text-lg mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Enquiry ID:
          </label>
          <Input
            type="text"
            value={EnquiryId}
            disabled
            className="bg-gray-200"
          />
        </div>

        {/* Enquiry Date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Enquiry Date:
          </label>
          <Input
            type="text"
            value={moment().format("YYYY-MM-DD")}
            disabled
            className="bg-gray-200"
          />
        </div>

        {/* Executive */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Executive *
          </label>
          <Input
            type="text"
            value={users?.displayname}
            disabled
            className="bg-gray-200"
          />
        </div>
        {/* Name */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Name *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Mobile *
          </label>
          <Input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            maxLength={10}
          />
        </div>

        {/* Contact 2 */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contact 2
          </label>
          <Input
            type="text"
            name="contact2"
            value={formData.contact2}
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
            City *
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

        {/* Category */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="">--Select--</option>
            {users?.category?.map((category, index) => (
              <option value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Interested For */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Interested For *
          </label>
          <Input
            type="text"
            name="interested_for"
            value={formData.interested_for}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="2"
            className="w-full border bg-white border-gray-300 px-3 py-1 focus:ring-blue-400 rounded-md"
          ></textarea>
        </div>

        {/* Save & Cancel Buttons */}
        <div className="col-span-3 flex justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-800 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-red-900 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-gray-600 transition"
            onClick={() => setFormData({})}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryCreate;
