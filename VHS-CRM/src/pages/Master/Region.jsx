import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function Region() {
  const [regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCategory = localStorage.getItem("selectedCategory");

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    const response = await fetch(
      `${config.API_BASE_URL}/region/category/${selectedCategory}`
    );
    const data = await response.json();
    setRegions(Array.isArray(data) ? data : []);
  };

  const handleAddRegion = async () => {
    if (newRegion.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/region`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        region: newRegion,
        category: selectedCategory,
      }),
    });

    if (response.ok) {
      fetchRegions();
      setNewRegion("");
      toast.success("✅ Region saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this region?"
    );
    if (!confirmDelete) return;

    await fetch(`${config.API_BASE_URL}/region/${id}`, {
      method: "DELETE",
    });
    fetchRegions();
  };

  const handleEdit = (id, regionName) => {
    setEditingId(id);
    setEditingValue(regionName);
  };

  const handleSaveEdit = async (id) => {
    if (editingValue.trim() === "") return;

    await fetch(`${config.API_BASE_URL}/region/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        region: editingValue,
        category: selectedCategory,
      }),
    });

    fetchRegions();
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-6">Manage Regions</h2>

        {/* Add New Region Section */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2">Add New Region</h4>
          <div className="flex flex-wrap gap-3 items-end">
            <Input
              type="text"
              placeholder="Enter new region"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Button onClick={handleAddRegion}>Add</Button>
          </div>
        </div>

        {/* Search Region Section */}
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Search</h4>
          <Input
            type="text"
            placeholder="Search regions..."
            className="w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Region Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Region</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions
                .filter((item) =>
                  item.region?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">
                      {editingId === item.id ? (
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        item.region
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {editingId === item.id ? (
                        <Button
                          onClick={() => handleSaveEdit(item.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Save
                        </Button>
                      ) : (
                        <div className="flex justify-center items-center gap-3 text-gray-600">
                          <FaEdit
                            className="cursor-pointer hover:text-blue-600"
                            size={16}
                            onClick={() => handleEdit(item.id, item.region)}
                          />
                          <FaTrash
                            className="cursor-pointer hover:text-red-600"
                            size={16}
                            onClick={() => handleDelete(item.id)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              {regions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No regions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Region;
