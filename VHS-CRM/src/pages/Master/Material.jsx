import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function Material() {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState("");
  const [editingBenefits, setEditingBenefits] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCategory = localStorage.getItem("selectedCategory");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/material/category/${selectedCategory}`
      );
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch materials", error);
    }
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.trim()) return;

    const response = await fetch(`${config.API_BASE_URL}/material`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: newMaterial,
        benefits: newBenefits,
        category: selectedCategory,
      }),
    });

    if (response.ok) {
      fetchMaterials();
      setNewMaterial("");
      setNewBenefits("");
      toast.success("✅ Material saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;

    await fetch(`${config.API_BASE_URL}/material/${id}`, {
      method: "DELETE",
    });
    fetchMaterials();
  };

  const handleEdit = (id, material, benefits) => {
    setEditingId(id);
    setEditingMaterial(material);
    setEditingBenefits(benefits || "");
  };

  const handleSaveEdit = async (id) => {
    if (!editingMaterial.trim()) return;

    await fetch(`${config.API_BASE_URL}/material/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: editingMaterial,
        benefits: editingBenefits,
        category: selectedCategory,
      }),
    });

    fetchMaterials();
    setEditingId(null);
    setEditingMaterial("");
    setEditingBenefits("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h3 className="text-xl font-semibold mb-6">Manage Materials</h3>

        {/* Add Material Section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">
                Material <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm">
                Benefits <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={newBenefits}
                onChange={(e) => setNewBenefits(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddMaterial}>Add</Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Search</h4>
          <Input
            type="text"
            placeholder="Search materials..."
            className="w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Material Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Material</th>
                <th className="px-4 py-2 text-left">Benefits</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials
                .filter(
                  (item) =>
                    item.material
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.benefits
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
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
                          value={editingMaterial}
                          onChange={(e) => setEditingMaterial(e.target.value)}
                        />
                      ) : (
                        item.material
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === item.id ? (
                        <Input
                          value={editingBenefits}
                          onChange={(e) => setEditingBenefits(e.target.value)}
                        />
                      ) : (
                        item.benefits || "-"
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
                            onClick={() =>
                              handleEdit(item.id, item.material, item.benefits)
                            }
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
              {materials.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No materials found.
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

export default Material;
