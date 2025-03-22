import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { config } from "../../services/config";
import { FaEdit, FaTrash } from "react-icons/fa";

function WhatsAppTemplate() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ template_name: "", content: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch(`${config.API_BASE_URL}/whatsapp-templates`);
    const data = await res.json();
    setTemplates(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.template_name || !form.content) {
      toast.error("All fields are required");
      return;
    }

    const endpoint = editingId
      ? `${config.API_BASE_URL}/whatsapp-templates/${editingId}`
      : `${config.API_BASE_URL}/whatsapp-templates`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(
        `✅ Template ${editingId ? "updated" : "added"} successfully`
      );
      setForm({ template_name: "", content: "" });
      setEditingId(null);
      fetchTemplates();
    } else {
      const error = await res.json();
      toast.error(error.error || "Something went wrong");
    }
  };

  const handleEdit = (template) => {
    setEditingId(template.id);
    setForm({
      template_name: template.template_name,
      content: template.content,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    await fetch(`${config.API_BASE_URL}/whatsapp-templates/${id}`, {
      method: "DELETE",
    });

    fetchTemplates();
    toast.success("Deleted successfully");
  };
  const handleVariableClick = (value) => {
    navigator.clipboard.writeText(value);
    toast.info(`📋 Copied ${value}`);
  };
  const smsVariables = [
    "{Customer_name}",
    "{Customer_contact}",
    "{Executive_name}",
    "{Executive_contact}",
    "{Call_date}",
    "{Job_type}",
    "{Technician_name}",
    "{Technician_experience}",
    "{Technician_languages_known}",
    "{Staff_name}",
    "{Staff_contact}",
    "{Project_manager_name}",
    "{Project_start_date}",
    "{Worker_names}",
    "{Worker_amount}",
    "{Days_to_complete}",
    "{Service_name}",
    "{Service_date}",
    "{Service_amount}",
    "{Video_link}",
    "{Paid_amount}",
    "{Payment_mode}",
    "{Payment_date}",
    "{Quote_link}",
    "{Invoice_link}",
    "{Appointment_datetime}",
    "{Slot_timing}",
  ];

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text/plain", value);
  };

  return (
    <div className="p-4  mx-auto bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">WhatsApp Templates</h2>

      {/* Form Section */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {/* Left Section: Template Name + CKEditor */}
        <div className="sm:col-span-2 flex flex-col gap-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Template Name
            </label>
            <Input
              name="template_name"
              value={form.template_name}
              onChange={handleChange}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <div className="border border-gray-300 rounded p-2">
              <CKEditor
                editor={ClassicEditor}
                data={form.content}
                onChange={(event, editor) =>
                  setForm((prev) => ({ ...prev, content: editor.getData() }))
                }
              />
            </div>
          </div>
        </div>

        {/* Right Section: Variable Guide */}
        <div className="mt-1 text-sm bg-gray-50 border border-dashed border-gray-300 p-3 rounded-md">
          <p className="font-semibold mb-2">
            📌 Drag or click to copy variables:
          </p>
          <div className="flex flex-wrap gap-2">
            {smsVariables.map((v, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-2 py-1 rounded cursor-pointer hover:bg-gray-300"
                draggable
                onClick={() => handleVariableClick(v)}
                onDragStart={(e) => handleDragStart(e, v)}
              >
                {v}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Note:</strong> Use <code>*text*</code> for{" "}
            <strong>bold</strong>, <code>_*text*_</code> for <em>italic</em>
          </p>
        </div>
      </div>

      <Button onClick={handleSubmit}>{editingId ? "Update" : "Save"}</Button>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Template Name</th>
              <th className="px-4 py-2 text-left">Content</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl, index) => (
              <tr
                key={tpl.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{tpl.template_name}</td>
                <td
                  className="px-4 py-2"
                  dangerouslySetInnerHTML={{ __html: tpl.content }}
                />
                <td className="px-4 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <FaEdit
                      onClick={() => handleEdit(tpl)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      Edit
                    </FaEdit>
                    <FaTrash
                      onClick={() => handleDelete(tpl.id)}
                      className="cursor-pointer hover:text-red-600"
                    >
                      Delete
                    </FaTrash>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No templates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WhatsAppTemplate;
