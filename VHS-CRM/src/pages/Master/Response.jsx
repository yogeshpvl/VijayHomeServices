import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Response() {
  const [responses, setresponses] = useState([]);
  const [newresponse, setNewresponse] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingTemplate, setEditingTemplate] = useState("");

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorContent(data);
  };

  const handleVariableClick = (value) => {
    navigator.clipboard.writeText(value);
    toast.info(`📋 Copied ${value}`);
  };

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text/plain", value);
  };

  useEffect(() => {
    fetchresponses();
  }, []);

  const fetchresponses = async () => {
    const response = await fetch(`${config.API_BASE_URL}/responses`);
    const data = await response.json();
    setresponses(data);
  };

  const handleAddresponse = async () => {
    if (newresponse.trim() === "") return;

    const response = await fetch(`${config.API_BASE_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_name: newresponse,
        template: editorContent,
      }),
    });

    if (response.ok) {
      fetchresponses();
      setNewresponse("");
      setEditorContent("");
      toast.success("✅ Response saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this response?"))
      return;

    await fetch(`${config.API_BASE_URL}/responses/${id}`, {
      method: "DELETE",
    });

    fetchresponses();
  };

  const handleEdit = (id, name, template) => {
    setEditingId(id);
    setEditingValue(name);
    setEditingTemplate(template);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/responses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_name: editingValue,
        template: editingTemplate,
      }),
    });

    fetchresponses();
    setEditingId(null);
    setEditingValue("");
    setEditingTemplate("");
  };

  const smsVariables = [
    "{Customer_name}",
    "{Executive_name}",
    "{Executive_contact}",
  ];

  return (
    <div className="p-4">
      <div className="shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Manage Responses</h2>

        {/* Input and Editor */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium mb-1">
              Response <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={newresponse}
              onChange={(e) => setNewresponse(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-2/3">
            <label className="block text-sm font-medium mb-1">
              Message Template
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <CKEditor
                editor={ClassicEditor}
                data={editorContent}
                onChange={handleEditorChange}
              />
            </div>
          </div>
          {/* Variables Guide */}
          <div className="mt-2 text-sm bg-gray-50 border border-dashed border-gray-300 p-3 rounded-md">
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

        <div className="my-4">
          <Button onClick={handleAddresponse}>Add</Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Response</th>
                <th className="px-4 py-2 text-left">Template</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr
                  key={response.response_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === response.response_id ? (
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                      />
                    ) : (
                      response.response_name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === response.response_id ? (
                      <div className="border border-gray-300 rounded-md p-2 bg-white">
                        <CKEditor
                          editor={ClassicEditor}
                          data={editingTemplate}
                          onChange={(event, editor) =>
                            setEditingTemplate(editor.getData())
                          }
                        />
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: response.template }}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingId === response.response_id ? (
                      <Button
                        onClick={() => handleSaveEdit(response.response_id)}
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
                              response.response_id,
                              response.response_name,
                              response.template
                            )
                          }
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={16}
                          onClick={() => handleDelete(response.response_id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {responses.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No responses found.
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

export default Response;
