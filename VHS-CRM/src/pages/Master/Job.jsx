import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function Job() {
  const [jobs, setJobs] = useState([]);
  const [MaterialsData, setMaterialsData] = useState([]);
  const [selectedMaterial, setMaterial] = useState("");
  const [qtyDesc, setQtyDesc] = useState("");
  const [rate, setRate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState("");
  const [editingQtyDesc, setEditingQtyDesc] = useState("");
  const [editingRate, setEditingRate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCategory = localStorage.getItem("selectedCategory");

  useEffect(() => {
    fetchJobs();
    fetchMaterials();
  }, []);

  const fetchJobs = async () => {
    const response = await fetch(
      `${config.API_BASE_URL}/job/category/${selectedCategory}`
    );
    const data = await response.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  const fetchMaterials = async () => {
    const response = await fetch(
      `${config.API_BASE_URL}/material/category/${selectedCategory}`
    );
    const data = await response.json();
    setMaterialsData(Array.isArray(data) ? data : []);
  };

  const handleAddJob = async () => {
    if (!selectedMaterial || !qtyDesc || !rate) {
      toast.error("Please fill all fields");
      return;
    }

    const response = await fetch(`${config.API_BASE_URL}/job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: selectedMaterial,
        qty_desc: qtyDesc,
        rate,
        category: selectedCategory,
      }),
    });

    if (response.ok) {
      fetchJobs();
      setMaterial("");
      setQtyDesc("");
      setRate("");
      toast.success("✅ Job saved successfully!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    await fetch(`${config.API_BASE_URL}/job/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  const handleEdit = (id, material, qty, rate) => {
    setEditingId(id);
    setEditingMaterial(material);
    setEditingQtyDesc(qty);
    setEditingRate(rate);
  };

  const handleSaveEdit = async (id) => {
    await fetch(`${config.API_BASE_URL}/job/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: editingMaterial,
        qty_desc: editingQtyDesc,
        rate: editingRate,
        category: selectedCategory,
      }),
    });

    fetchJobs();
    setEditingId(null);
    setEditingMaterial("");
    setEditingQtyDesc("");
    setEditingRate("");
  };

  return (
    <div className="shadow-lg rounded-lg p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Manage Jobs</h3>

      {/* Job input section */}
      <div className="flex gap-4 mb-4 flex-col md:flex-row">
        {/* Material */}
        <div className="flex-1">
          <label className="block font-medium mb-1 text-sm">
            Material <span className="text-red-500">*</span>
          </label>
          <select
            className="border rounded-md px-2 py-1 w-full"
            onChange={(e) => setMaterial(e.target.value)}
            value={selectedMaterial}
          >
            <option value="">--select--</option>
            {MaterialsData.map((cat) => (
              <option key={cat.id} value={cat.material}>
                {cat.material}
              </option>
            ))}
          </select>
        </div>

        {/* Desc/Qty */}
        <div className="flex-1">
          <label className="block font-medium mb-1 text-sm">
            Desc/Qty <span className="text-red-500">*</span>
          </label>
          <Input
            as="textarea"
            rows={3}
            value={qtyDesc}
            onChange={(e) => setQtyDesc(e.target.value)}
          />
        </div>

        {/* Rate */}
        <div className="flex-1">
          <label className="block font-medium mb-1 text-sm">
            Rate <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      <Button onClick={handleAddJob}>Save</Button>

      {/* Search Input */}
      <div className="mb-4 mt-4">
        <Input
          type="text"
          placeholder="Search jobs..."
          className="w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sl No</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Material</th>
              <th className="px-4 py-2 text-left">Qty/Desc</th>
              <th className="px-4 py-2 text-left">Rate</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs
              .filter(
                (item) =>
                  item.material
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  item.qty_desc
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  String(item.rate).includes(searchTerm)
              )
              .map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
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
                  <td className="px-4 py-2 whitespace-pre-wrap">
                    {editingId === item.id ? (
                      <Input
                        value={editingQtyDesc}
                        onChange={(e) => setEditingQtyDesc(e.target.value)}
                      />
                    ) : (
                      item.qty_desc
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={editingRate}
                        onChange={(e) => setEditingRate(e.target.value)}
                      />
                    ) : (
                      item.rate
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
                            handleEdit(
                              item.id,
                              item.material,
                              item.qty_desc,
                              item.rate
                            )
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
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Job;
