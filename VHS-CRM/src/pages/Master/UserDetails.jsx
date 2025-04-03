import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { config } from "../../services/config";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";

const roleList = [
  "Home",
  "Master",
  "Enquiry",
  "EnquiryAdd",
  "Enquiry Followup",
  "Survey",
  "Quote",
  "Customer",
  "TrytoBook Customers",
  "Quote Followup",
  "DSR",
  "MissDSRDATA",
  "Running Project",
  "Close Project",
  "B2B",
  "Community",
  "Payment Report",
  "Reports",
];

const roleList1 = ["Cancel", "Reschedule"];

const UserDetails = () => {
  const { id } = useParams();

  const [roles, setRoles] = useState({});
  const [category, setCategory] = useState([]);
  const [city, setCity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  console.log("roles", roles);

  // ✅ Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // ✅ Fetch cities from API
  const fetchCities = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/cities`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/users/${id}`);
      const user = res.data;
      setCategory(user.category || []);
      setCity(user.city || []);
      setRoles(user.roles || {});
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCities();
    fetchCategories();
  }, []);

  const handleRoleChange = (role) => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${config.API_BASE_URL}/auth/users/userRights/${id}`, {
        roles,
        category,
        city,
      });
      toast.success("✅ User rights updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Rights For Left Menu</h2>

      {/* Category Select */}
      <div className="mb-4">
        <Select
          isMulti
          placeholder="Select Category"
          options={categories.map((cat) => ({
            label: cat.category_name,
            value: cat.category_name,
          }))}
          value={category.map((c) => ({ label: c.name, value: c.name }))}
          onChange={(selected) =>
            setCategory(selected.map((item) => ({ name: item.value })))
          }
        />
      </div>

      {/* City Select */}
      <div className="mb-4">
        <Select
          isMulti
          placeholder="Select City"
          options={cities.map((c) => ({
            label: c.city_name,
            value: c.city_name,
          }))}
          value={city.map((c) => ({ label: c.name, value: c.name }))}
          onChange={(selected) =>
            setCity(selected.map((item) => ({ name: item.value })))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-1">
        {/* Left column: Main roles */}
        <div className="border rounded border-gray-200 p-4 mb-4 max-w-md">
          {roleList.map((role) => (
            <div key={role} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!roles[role]}
                onChange={() => handleRoleChange(role)}
                className="mr-2"
              />
              <label>{role}</label>
            </div>
          ))}
        </div>

        {/* Right column: Extra roles like Cancel / Reschedule */}
        <div className="border rounded border-gray-200 p-4 mb-4 max-w-md">
          {roleList1.map((role) => (
            <div key={role} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!roles[role]}
                onChange={() => handleRoleChange(role)}
                className="mr-2"
              />
              <label>{role}</label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit}>Save Rights</Button>
    </div>
  );
};

export default UserDetails;
