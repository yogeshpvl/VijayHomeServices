import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function CustomerType() {
  const [customertype, setcustomertype] = useState([]);
  const [newcustomertype, setNewcustomertype] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    fetchcustomertype();
  }, []);

  const fetchcustomertype = async () => {
    const response = await fetch(`${config.API_BASE_URL}/customertype`);
    const data = await response.json();
    setcustomertype(data);
  };

  const handleAddcustomertype = async () => {
    if (newcustomertype.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/customertype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customertype: newcustomertype }),
    });

    if (response.ok) {
      fetchcustomertype();
      setNewcustomertype("");
      toast.success("✅ customertype saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customertype?"
    );
    if (!confirmDelete) return;

    await fetch(`${config.API_BASE_URL}/customertype/${id}`, {
      method: "DELETE",
    });
    fetchcustomertype();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/customertype/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customertype: editingValue }),
    });

    fetchcustomertype();
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage Customer Types</h2>

        {/* Input for new customertype */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter new customertype"
            value={newcustomertype}
            onChange={(e) => setNewcustomertype(e.target.value)}
            className="w-full sm:w-1/3 p-0"
          />
          <Button onClick={handleAddcustomertype}>Add</Button>
        </div>

        {/* customertype Table */}
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
              {customertype.map((customertype, index) => (
                <tr
                  key={customertype.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === customertype.id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      customertype.customertype
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === customertype.id ? (
                      <Button
                        onClick={() => handleSaveEdit(customertype.id)}
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
                            handleEdit(
                              customertype.id,
                              customertype.customertype
                            )
                          }
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(customertype.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {customertype.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No customertype found.
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

export default CustomerType;
