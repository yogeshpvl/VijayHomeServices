import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function City() {
  const [cities, setcities] = useState([]);
  const [newcity, setNewcity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    fetchcities();
  }, []);

  const fetchcities = async () => {
    const response = await fetch(`${config.API_BASE_URL}/cities`);
    const data = await response.json();
    setcities(data);
  };

  const handleAddcity = async () => {
    if (newcity.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city_name: newcity }),
    });

    if (response.ok) {
      fetchcities();
      setNewcity("");
      toast.success("✅ city saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this city?"
    );
    if (!confirmDelete) return;

    await fetch(`${config.API_BASE_URL}/cities/${id}`, {
      method: "DELETE",
    });
    fetchcities();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/cities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city_name: editingValue }),
    });

    fetchcities();
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage Cites</h2>

        {/* Input for new city */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter new city"
            value={newcity}
            onChange={(e) => setNewcity(e.target.value)}
            className="w-full sm:w-1/3 p-0"
          />
          <Button onClick={handleAddcity}>Add</Button>
        </div>

        {/* city Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr
                  key={city.city_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === city.city_id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      city.city_name
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === city.city_id ? (
                      <Button
                        onClick={() => handleSaveEdit(city.city_id)}
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
                            handleEdit(city.city_id, city.city_name)
                          }
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(city.city_id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {cities.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No cities found.
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

export default City;
