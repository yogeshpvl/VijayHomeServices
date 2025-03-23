import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";
import Select from "react-select";

function Team() {
  const users = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    type: "",
    city: "",
    vhsname: "",
    smsname: "",
    number: "",
    password: "",
    experiance: "",
    languagesknow: "",
    category: [],
  });

  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    vhsname: "",
    smsname: "",
    number: "",
    password: "",
    experiance: "",
    languagesknow: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(25); // Page size

  const categoryOptions =
    users?.category?.map((cat) => ({ label: cat.name, value: cat.name })) || [];
  const cityOptions =
    users?.city?.map((cat) => ({ label: cat.name, value: cat.name })) || [];

  const typeOptions = [
    { label: "Executive", value: "Executive" },
    { label: "Technician", value: "Technician" },
    { label: "Project Manager", value: "PM" },
    { label: "Outside Vendor", value: "outVendor" },
  ];

  useEffect(() => {
    fetchTeams();
  }, [currentPage, filters]);

  const buildQuery = () => {
    const params = new URLSearchParams({
      page: currentPage,
      limit,
      ...filters,
    });
    return params.toString();
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/vendors?${buildQuery()}`);
      const data = await res.json();

      setTeams(Array.isArray(data.results) ? data.results : []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("❌ Failed to fetch vendors");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${config.API_BASE_URL}/vendors/edit/${editingId}`
      : `${config.API_BASE_URL}/vendors/register`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(`❌ ${result.error || "Something went wrong"}`);
        return;
      }

      toast.success(`✅ ${editingId ? "Updated" : "Added"} successfully`);

      setForm({
        type: "",
        city: "",
        vhsname: "",
        smsname: "",
        number: "",
        password: "",
        experiance: "",
        languagesknow: "",
        category: [],
      });

      setEditingId(null);
      fetchTeams();
    } catch (error) {
      toast.error("❌ Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    await fetch(`${config.API_BASE_URL}/vendors/${id}`, { method: "DELETE" });
    fetchTeams();
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);
    setForm(vendor);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // reset to page 1 when filter changes
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Team</h2>

      {/* Form */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: "Type", name: "type", isSelect: true, options: typeOptions },
          { label: "City", name: "city", isSelect: true, options: cityOptions },
          { label: "VHS Name", name: "vhsname" },
          { label: "SMS Name", name: "smsname" },
          { label: "Mobile Number", name: "number" },
          { label: "Password", name: "password" },
          { label: "Experiance", name: "experiance" },
          { label: "Languages Known", name: "languagesknow" },
        ].map(({ label, name, isSelect, options = [] }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {isSelect ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">--select--</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input name={name} value={form[name]} onChange={handleChange} />
            )}
          </div>
        ))}

        {/* Category multiselect */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            isMulti
            options={categoryOptions}
            value={categoryOptions?.filter((opt) =>
              form.category?.some((cat) => cat.name === opt.value)
            )}
            onChange={(selected) =>
              setForm((prev) => ({
                ...prev,
                category: selected.map((opt) => ({ name: opt.value })),
              }))
            }
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>

      {/* Filter Row */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full text-sm border border-gray-200 mb-4">
          <thead>
            {/* Filter Inputs Row */}
            <tr className="bg-gray-100">
              <th className="px-4 py-2" />
              <th className="px-4 py-2">
                <Input
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  placeholder="Filter type"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Filter city"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="vhsname"
                  value={filters.vhsname}
                  onChange={handleFilterChange}
                  placeholder="Filter vhsname"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="smsname"
                  value={filters.smsname}
                  onChange={handleFilterChange}
                  placeholder="Filter smsname"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="number"
                  value={filters.number}
                  onChange={handleFilterChange}
                  placeholder="Filter number"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="password"
                  value={filters.password}
                  onChange={handleFilterChange}
                  placeholder="Filter password"
                />
              </th>
              <th className="px-4 py-2 text-sm text-gray-500"></th>
              <th className="px-4 py-2">
                <Input
                  name="experiance"
                  value={filters.experiance}
                  onChange={handleFilterChange}
                  placeholder="Filter experiance"
                />
              </th>
              <th className="px-4 py-2">
                <Input
                  name="languagesknow"
                  value={filters.languagesknow}
                  onChange={handleFilterChange}
                  placeholder="Filter languages"
                />
              </th>
              <th className="px-4 py-2" />
            </tr>

            {/* Column Headings Row */}
            <tr className="bg-red-800 text-white">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">VHS Name</th>
              <th className="px-4 py-2 text-left">SMS Name</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">Password</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Experience</th>
              <th className="px-4 py-2 text-left">Languages Known</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Team Table */}
        <table className="w-full text-sm border border-gray-200">
          <tbody>
            {teams.map((item, idx) => (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="px-4 py-2">
                  {(currentPage - 1) * limit + idx + 1}
                </td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.city}</td>
                <td className="px-4 py-2">{item.vhsname}</td>
                <td className="px-4 py-2">{item.smsname}</td>
                <td className="px-4 py-2">{item.number}</td>
                <td className="px-4 py-2">{item.password}</td>
                <td className="px-4 py-2">
                  {Array.isArray(item.category)
                    ? item.category.map((c) => c.name).join(", ")
                    : item.category}
                </td>
                <td className="px-4 py-2">{item.experiance}</td>
                <td className="px-4 py-2">{item.languagesknow}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-3 text-gray-600">
                    <FaEdit
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleEdit(item)}
                    />
                    <FaTrash
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 border rounded">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Team;
