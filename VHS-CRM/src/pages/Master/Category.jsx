import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(`${config.API_BASE_URL}/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name: newCategory }),
    });

    if (response.ok) {
      fetchCategories();
      setNewCategory("");
      toast.success("✅ Category saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    await fetch(`${config.API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });
    fetchCategories();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name: editingValue }),
    });

    fetchCategories();
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

        {/* Input for new category */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full sm:w-1/3 p-0"
          />
          <Button onClick={handleAddCategory}>Add</Button>
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.category_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === category.category_id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      category.category_name
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === category.category_id ? (
                      <Button
                        onClick={() => handleSaveEdit(category.category_id)}
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
                              category.category_id,
                              category.category_name
                            )
                          }
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(category.category_id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No categories found.
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

export default Category;
