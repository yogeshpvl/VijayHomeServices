import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function Reference() {
  const [reference, setReference] = useState([]);
  const [newReference, setNewReference] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReference();
  }, []);

  const fetchReference = async () => {
    const response = await fetch(`${config.API_BASE_URL}/reference`);
    const data = await response.json();
    setReference(data);
  };

  const handleAddReference = async () => {
    if (newReference.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/reference`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: newReference }),
    });

    if (response.ok) {
      fetchReference();
      setNewReference("");
      toast.success("✅ Reference saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reference?"))
      return;

    await fetch(`${config.API_BASE_URL}/reference/${id}`, {
      method: "DELETE",
    });
    fetchReference();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/reference/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: editingValue }),
    });

    fetchReference();
    setEditingId(null);
    setEditingValue("");
  };

  const filteredReferences = reference.filter((ref) =>
    ref.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage References</h2>

        {/* Add + Search Inputs */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            type="text"
            placeholder="Enter new reference"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <Button onClick={handleAddReference}>Add</Button>

          <Input
            type="text"
            placeholder="Search reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 ml-auto"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferences.map((ref, index) => (
                <tr
                  key={ref.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === ref.id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      ref.reference
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === ref.id ? (
                      <Button
                        onClick={() => handleSaveEdit(ref.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Save
                      </Button>
                    ) : (
                      <div className="flex justify-center items-center gap-3 text-gray-600">
                        <FaEdit
                          className="cursor-pointer hover:text-blue-600"
                          size={16}
                          onClick={() => handleEdit(ref.id, ref.reference)}
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(ref.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredReferences.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No references found.
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

export default Reference;
