import React, { useEffect, useState } from "react";
import EnquiryService from "../../services/enquiryService";
import { useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import moment from "moment";
import { FaSpinner } from "react-icons/fa";
import { config } from "../../services/config";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

function QuoteDetails() {
  const [treactmentData, settreactmentData] = useState([]);

  const { id } = useParams(); // Fetch ID from URL parameters
  const [enquiryData, setEnquiryData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [Materials, setMaterials] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData1, setFormData1] = useState({
    projectType: "2 BHK Vacant",
    total: 9093,
    adjustments: 593,
    sum: 9093,
    gst: "NO", // Assuming NO initially
    netTotal: 8500,
  });

  // Handle form input changes
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    category: "",
    region: "",
    material: "",
    job: "",
    qty: "",
    rate: "",
    note: "",
  });
  const users = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch enquiry data based on the id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EnquiryService.getEnquiryById(id);
        setEnquiryData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);
  const fetchtreactmentData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/quotation_items/enquiry/${id}`
      );
      console.log("response", response);
      settreactmentData(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    fetchtreactmentData();
  }, [id]);

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${config.API_BASE_URL}/quotation_items/${id}`
      ); // Replace with your delete API endpoint
      if (response.status === 200) {
        fetchtreactmentData();
        toast.success("Quotation item deleted successfully");
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("An error occurred while deleting the item.");
    }
  };

  // Fetch regions, materials, and jobs based on category and material
  useEffect(() => {
    const fetchRegions = async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/region/category/${formData.category}`
      );
      const data = await response.json();
      setRegions(Array.isArray(data) ? data : []);
    };

    const fetchMaterials = async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/material/category/${formData.category}`
      );
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    };

    const fetchJobs = async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/job/material/${formData.material}`
      );
      const data = await response.json();
      setJobData(Array.isArray(data) ? data : []);
    };

    // Fetch data when category changes
    if (formData.category) {
      fetchRegions();
      fetchMaterials();
    }

    // Fetch jobs when material changes
    if (formData.material) {
      fetchJobs();
    }
  }, [formData.category, formData.material]); // Only run when `category` or `material` change

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Display loading message while data is being fetched
  if (!enquiryData && !error) {
    return <div>Loading...</div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading state

    try {
      const response = await fetch(`${config.API_BASE_URL}/quotation_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          enquiry_id: id,
          subtotal: formData.qty * formData.rate, // Calculating subtotal
        }),
      });

      if (response.ok) {
        toast.success("Item added successfully!");
        fetchtreactmentData();
        setFormData({
          category: "",
          region: "",
          material: "",
          job: "",
          qty: "",
          rate: "",
          note: "",
        });
      } else {
        toast.error("Failed to add item. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An error occurred. Please try again.", err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handle Save Quote
  const handleSaveQuote = () => {
    // Add logic for saving quote
    alert("Quote Saved!");
  };

  // Handle Print Quote
  const handlePrintQuote = () => {
    // Add logic for printing quote
    alert("Quote Printed!");
  };

  // Handle Send Quote via WhatsApp
  const handleSendQuote = () => {
    // Add logic for sending quote via WhatsApp
    alert("Quote Sent via WhatsApp!");
  };

  return (
    <div className="mx-auto ">
      <div className="flex justify-between">
        <h1 className="text-base font-bold  p-3">Billing Details</h1>
        <div>
          <Button variant="cancel">Edit Details</Button>
        </div>
      </div>

      <div className=" bg-white rounded-lg shadow-md grid grid-cols-3 gap-4 p-6">
        {/* Billing Details */}
        <div className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <strong className="w-32 text-sm">Enquiry Id:</strong>
              <span className="text-sm">{enquiryData.enquiryId}</span>
            </div>
            <div className="flex items-center">
              <strong className="w-32 text-sm">Email:</strong>
              <span className="text-sm">{enquiryData.email}</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <strong className="w-32 text-sm">Mobile No:</strong>
            <span className="text-sm">{enquiryData.mobile}</span>
            <a
              href={`https://wa.me/91${enquiryData.mobile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
          <div className="flex items-center">
            <strong className="w-32 text-sm">Address:</strong>
            <span className="text-sm">{enquiryData.address}</span>
          </div>
        </div>
        {/* Treatment Details */}
        <div className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <strong className="w-32 text-sm">Customer Name:</strong>
              <span className="text-sm">{enquiryData.name}</span>
            </div>
            <div className="flex items-center">
              <strong className="w-32 text-sm">Interested for:</strong>
              <span className="text-sm">{enquiryData.interested_for}</span>
            </div>
          </div>
        </div>

        {/* Edit Details Button */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <h1 className="text-base font-bold mt-4">Treatment Details</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 mt-4">
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
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Region *
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            >
              <option value="">--Select--</option>
              {regions?.map((region, index) => (
                <option key={index} value={region.region}>
                  {region.region}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Material *
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            >
              <option value="">--Select--</option>
              {Materials?.map((material, index) => (
                <option key={index} value={material.material}>
                  {material.material}
                </option>
              ))}
            </select>
          </div>

          {/* Job */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Job *
            </label>
            <select
              name="job"
              value={formData.job}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            >
              <option value="">--Select--</option>
              {jobData?.map((job, index) => (
                <option key={index} value={job.qty_desc}>
                  {job.qty_desc}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Qty *
            </label>
            <Input
              type="text"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Rate
            </label>
            <Input
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              rows="2"
              className="w-full border bg-white border-gray-300 px-3 py-1 focus:ring-blue-400 rounded-md"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Note
            </label>
            <Input name="note" value={formData.note} onChange={handleChange} />
          </div>
          <div>
            {/* Save & Cancel Buttons */}
            <div className="col-span-3 flex justify-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-900 transition"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-white" size={18} />
                ) : (
                  "Add Item"
                )}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition"
                onClick={() => setFormData({})}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-sm">Sr</th>
                <th className="py-2 px-4 text-left text-sm">Category</th>
                <th className="py-2 px-4 text-left text-sm">Region</th>
                <th className="py-2 px-4 text-left text-sm">Material</th>
                <th className="py-2 px-4 text-left text-sm">Job</th>
                <th className="py-2 px-4 text-left text-sm">Qty</th>
                <th className="py-2 px-4 text-left text-sm">Rate</th>
                <th className="py-2 px-4 text-left text-sm">Amount</th>
                <th className="py-2 px-4 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {treactmentData.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4 text-sm">{index + 1}</td>
                  <td className="py-2 px-4 text-sm">{item.category}</td>
                  <td className="py-2 px-4 text-sm">{item.region}</td>
                  <td className="py-2 px-4 text-sm">{item.material}</td>
                  <td className="py-2 px-4 text-sm">{item.job}</td>
                  <td className="py-2 px-4 text-sm">{item.qty}</td>
                  <td className="py-2 px-4 text-sm">{item.rate}</td>
                  <td className="py-2 px-4 text-sm">{item.subtotal}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(item.item_id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Type
            </label>
            <input
              type="text"
              name="projectType"
              value={formData1.projectType}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <input
              type="number"
              name="total"
              value={formData1.total}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SUM
            </label>
            <input
              type="number"
              name="sum"
              value={formData1.sum}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adjustments
            </label>
            <input
              type="number"
              name="adjustments"
              value={formData1.adjustments}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST (5%)
            </label>
            <select
              name="gst"
              value={formData1.gst}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Net Total
            </label>
            <input
              type="number"
              name="netTotal"
              value={formData1.netTotal}
              onChange={handleChange1}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              disabled
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSaveQuote}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Save Quote
          </button>
          <button
            onClick={handlePrintQuote}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            Print Quote
          </button>
          <button
            onClick={handleSendQuote}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Send Quote by WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuoteDetails;
