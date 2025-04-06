import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import axios from "axios";
import { toast } from "react-toastify";

const CommunityAdd = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appartmentname: "",
    communityn: "",
    percentage: "",
    projectmanager: "",
    contactperson: "",
    contactno: "",
    email: "",
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      appartmentname: "",
      communityn: "",
      percentage: "",
      projectmanager: "",
      contactperson: "",
      contactno: "",
      email: "",
      login: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.102:5000/api/communities",
        formData
      );
      if (response.status === 201) {
        toast.success("✅ Community entry saved successfully!");
        handleCancel();
      } else {
        toast.error("❌ Failed to save Community entry.");
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
        Add Community
      </h2>

      <form className="grid grid-cols-3 gap-6" onSubmit={handleSubmit}>
        <InputWithLabel
          label="Appartment Name"
          name="appartmentname"
          value={formData.appartmentname}
          onChange={handleChange}
        />
        <InputWithLabel
          label="Community Name"
          name="communityn"
          value={formData.communityn}
          onChange={handleChange}
        />
        <InputWithLabel
          label="Percentage (%)"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          type="number"
        />

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Project Manager
          </label>
          <select
            name="projectmanager"
            value={formData.projectmanager}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-3 py-1.5 rounded-md"
          >
            <option value="">-- Select --</option>
            <option value="Rajesh Kumar">Rajesh Kumar</option>
            <option value="Amit Sharma">Amit Sharma</option>
            <option value="Priya Reddy">Priya Reddy</option>
            <option value="Yogesh Developer">Yogesh Developer</option>
          </select>
        </div>
        <InputWithLabel
          label="Contact Person"
          name="contactperson"
          value={formData.contactperson}
          onChange={handleChange}
        />
        <InputWithLabel
          label="Contact Number"
          name="contactno"
          value={formData.contactno}
          onChange={handleChange}
          maxLength={10}
        />

        <InputWithLabel
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputWithLabel
          label="Login"
          name="login"
          value={formData.login}
          onChange={handleChange}
        />
        <InputWithLabel
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

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
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-1.5 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const InputWithLabel = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label}
    </label>
    <Input
      {...props}
      className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md"
    />
  </div>
);

export default CommunityAdd;
