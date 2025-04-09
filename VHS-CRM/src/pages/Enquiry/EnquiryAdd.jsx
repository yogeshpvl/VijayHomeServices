import React, { useEffect, useState } from "react";
import EnquiryService from "../../services/enquiryService";
import moment from "moment";
import { Input } from "../../components/ui/Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/ApiServices";
import axios from "axios";
import { config } from "../../services/config";

const EnquiryForm = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
  const [reference, setReference] = useState([]);

  useEffect(() => {
    fetchReference();
  }, []);

  const fetchReference = async () => {
    const response = await fetch(`${config.API_BASE_URL}/reference`);
    const data = await response.json();
    setReference(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await EnquiryService.createEnquiry(formData);

      if (response && response.success) {
        makeApiCall(response.data.mobile, response.data.name);
        navigate(`/enquiry/enquiry-details/${response.data.enquiryId}`);
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

  const [whatsappdata, setWhatsappData] = useState(null);
  const [templateName, setTemplateName] = useState("Enquiry Add");

  useEffect(() => {
    getWhatsappTemplate();
  }, [templateName]);

  const getWhatsappTemplate = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/whatsapp-templates/get-template/${templateName}`
      );

      if (res.status === 200) {
        setWhatsappData(res.data?.content);
      }
    } catch (error) {
      console.error("Error fetching WhatsApp template:", error);
    }
  };

  const makeApiCall = async (contactNumber, customer_name) => {
    const contentTemplate = whatsappdata || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      customer_name
    );
    const contentWithNames = content.replace(
      /\{Executive_name\}/g,
      users?.displayname
    );
    const contentWithMobile = contentWithNames.replace(
      /\{Executive_contact\}/g,
      users?.contactno
    );

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = contentWithMobile
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/<strong>(.*?)<\/strong>/g, "<b>$1</b>")
      .replace(/<[^>]*>/g, "");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/whats-msg/send-message",
        {
          mobile: "+91" + contactNumber,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        // alert("Whats app message sent successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [serviceDetails, setserviceDetails] = useState([]);
  useEffect(() => {
    if (formData.category) {
      getServicebyCategory();
    }
  }, [formData.category]);

  const getServicebyCategory = async () => {
    const category = formData.category;
    try {
      const res = await axios.post(
        `https://vijayhomeservicebangalore.in/api/userapp/getservicebycategory/`,
        { category }
      );
      if (res.status === 200 && Array.isArray(res.data?.serviceData)) {
        setserviceDetails(res.data.serviceData);
      } else {
        setserviceDetails([]);
      }
    } catch (error) {
      console.warn(
        "Silent API error (category fetch)",
        error?.message || error
      );
      setserviceDetails([]);
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

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference *
          </label>
          <select
            name="reference1"
            value={formData.reference1}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          >
            <option value="">--Select--</option>
            {reference?.map((reference) => (
              <option value={reference.reference}>{reference.reference}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference2
          </label>
          <Input
            type="text"
            name="reference2"
            value={formData.reference2}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference3
          </label>
          <Input
            type="text"
            name="reference3"
            value={formData.reference3}
            onChange={handleChange}
            required
            className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
          />
        </div>
        {/* Interested For */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Interested For *
          </label>
          <select
            name="interested_for"
            value={formData.interested_for}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            <option value="">-- Select --</option>
            {serviceDetails.map((item) => (
              <option value={item.serviceName}>{item.serviceName}</option>
            ))}
          </select>
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

export default EnquiryForm;
