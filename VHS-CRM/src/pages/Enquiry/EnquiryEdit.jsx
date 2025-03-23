import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";

import EnquiryService from "../../services/enquiryService";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";

const EnquiryEdit = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [loading, setLoading] = useState(false);
  const [whatsappdata, setWhatsappData] = useState(null);
  const [templateName, setTemplateName] = useState("Enquiry Update");

  // ✅ Fetch enquiry data by ID
  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const response = await EnquiryService.getEnquiryById(id);
        if (response?.data) {
          setFormData({ ...formData, ...response.data });
        }
      } catch (error) {
        toast.error("❌ Failed to load enquiry details.");
      }
    };
    fetchEnquiry();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit updated enquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await EnquiryService.updateEnquiry(id, formData);
      console.log("response?.success", response);
      if (response) {
        toast.success("✅ Enquiry updated successfully!");

        navigate(`/enquiry/enquiry-details/${id}`);
      } else {
        toast.error("❌ Failed to update enquiry.");
      }
    } catch (error) {
      toast.error("❌ Error updating enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Enquiry</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/** Name */}
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/** Email */}
        <div>
          <label className="block text-sm font-medium">Email *</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/** Mobile */}
        <div>
          <label className="block text-sm font-medium">Mobile *</label>
          <Input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            maxLength={10}
          />
        </div>

        {/** Contact 2 */}
        <div>
          <label className="block text-sm font-medium">Contact 2</label>
          <Input
            name="contact2"
            value={formData.contact2}
            onChange={handleChange}
          />
        </div>

        {/** Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/** City */}
        <div>
          <label className="block text-sm font-medium">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-1 rounded-md"
            required
          >
            <option value="">--Select--</option>
            {users?.city?.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/** Category */}
        <div>
          <label className="block text-sm font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-1 rounded-md"
            required
          >
            <option value="">--Select--</option>
            {users?.category?.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/** References */}
        <div>
          <label className="block text-sm font-medium">Reference 1</label>
          <Input
            name="reference1"
            value={formData.reference1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Reference 2</label>
          <Input
            name="reference2"
            value={formData.reference2}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Reference 3</label>
          <Input
            name="reference3"
            value={formData.reference3}
            onChange={handleChange}
          />
        </div>

        {/** Interested For */}
        <div>
          <label className="block text-sm font-medium">Interested For *</label>
          <Input
            name="interested_for"
            value={formData.interested_for}
            onChange={handleChange}
            required
          />
        </div>

        {/** Comment */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 px-3 py-1 rounded-md"
          />
        </div>

        {/** Executive */}
        <div>
          <label className="block text-sm font-medium">Executive</label>
          <Input value={formData.executive} disabled className="bg-gray-200" />
        </div>

        {/** Date & Time */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <Input value={formData.date} disabled className="bg-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <Input value={formData.time} disabled className="bg-gray-200" />
        </div>

        {/** Submit Buttons */}
        <div className="col-span-3 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryEdit;
