import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function B2BType() {
  const [b2btype, setb2btype] = useState([]);
  const [newb2btype, setNewb2btype] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    fetchb2btype();
  }, []);

  const fetchb2btype = async () => {
    const response = await fetch(`${config.API_BASE_URL}/b2btype`);
    const data = await response.json();
    setb2btype(data);
  };

  const handleAddb2btype = async () => {
    if (newb2btype.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/b2btype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ b2btype: newb2btype }),
    });

    if (response.ok) {
      fetchb2btype();
      setNewb2btype("");
      toast.success("✅ b2btype saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this b2btype?"
    );
    if (!confirmDelete) return;

    await fetch(`${config.API_BASE_URL}/b2btype/${id}`, {
      method: "DELETE",
    });
    fetchb2btype();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/b2btype/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ b2btype: editingValue }),
    });

    fetchb2btype();
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage B2B Types</h2>

        {/* Input for new b2btype */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter new b2btype"
            value={newb2btype}
            onChange={(e) => setNewb2btype(e.target.value)}
            className="w-full sm:w-1/3 p-0"
          />
          <Button onClick={handleAddb2btype}>Add</Button>
        </div>

        {/* b2btype Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">B2B Type</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {b2btype.map((b2btype, index) => (
                <tr
                  key={b2btype.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === b2btype.id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      b2btype.b2btype
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === b2btype.id ? (
                      <Button
                        onClick={() => handleSaveEdit(b2btype.id)}
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
                            handleEdit(b2btype.id, b2btype.b2btype)
                          }
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(b2btype.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {b2btype.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No b2btype found.
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

export default B2BType;
