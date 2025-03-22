import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { config } from "../../services/config";
import { FaTrash } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

function TermsAndConditions() {
  const location = useLocation();

  const tabs = [
    {
      name: "Section1",
      path: "/master/quotation-format-content/termsAndConditions",
    },
    {
      name: "Section2",
      path: "/master/quotation-format-content/termsAndConditions2",
    },
  ];
  const selectedCategory = localStorage.getItem("selectedCategory");

  const [form, setForm] = useState({
    category: selectedCategory || "",
    header: "",
    type: "",
    content: "",
  });

  const [termsList, setTermsList] = useState([]);

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.header || !form.content) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await fetch(
        `${config.API_BASE_URL}/termsandcondtionssection1`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        toast.success("✅ Saved successfully");
        fetchTerms();
        setForm({
          category: selectedCategory,
          header: "",
          type: "",
          content: "",
        });
      } else {
        const err = await res.json();
        toast.error(err.message || "Error saving");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const fetchTerms = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/termsandcondtionssection1/category/${selectedCategory}`
      );
      const data = await res.json();
      setTermsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch terms:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await fetch(`${config.API_BASE_URL}/termsandcondtionssection1/${id}`, {
        method: "DELETE",
      });
      toast.success("✅ Deleted successfully");
      fetchTerms();
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="p-4  mx-auto bg-white shadow rounded">
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-1 rounded border ${
                isActive
                  ? "bg-red-700 text-white font-semibold shadow"
                  : "bg-white text-red-700 border-red-400 hover:bg-red-100"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-4">Add Terms and Conditions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Section Header <span className="text-red-500">*</span>
          </label>
          <Input
            className="border rounded-md w-full px-2 py-1"
            name="header"
            value={form.header}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="border rounded-md px-2 py-1 w-full"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">--select--</option>
            <option value="INVOICE">Invoice</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <div>
          <CKEditor
            editor={ClassicEditor}
            data={form.content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setForm((prev) => ({ ...prev, content: data }));
            }}
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>Save</Button>

      {/* Table */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Saved Entries</h3>
        <table className="w-full text-sm border">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Header</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Content</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {termsList.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.category}</td>

                <td className="px-4 py-2">{item.header}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td>
                  <div
                    className="px-4 py-2 prose"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </td>

                <td className="px-4 py-2 text-center">
                  <FaTrash
                    size={16}
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
            {termsList.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-3 text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TermsAndConditions;
