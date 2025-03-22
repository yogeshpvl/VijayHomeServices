import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { config } from "../../services/config";

function BankDetails() {
  const [banks, setBanks] = useState([]);
  const [form, setForm] = useState({
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: "",
    upi_number: "",
    branch_name: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    const response = await fetch(`${config.API_BASE_URL}/bank-details`);
    const data = await response.json();
    setBanks(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const endpoint = editingId
      ? `${config.API_BASE_URL}/bank-details/${editingId}`
      : `${config.API_BASE_URL}/bank-details`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `✅ Bank ${editingId ? "updated" : "added"} successfully`
        );
        setForm({
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          account_holder_name: "",
          upi_number: "",
          branch_name: "",
        });
        setEditingId(null);
        fetchBanks();
      } else {
        toast.error(`❌ ${data?.error || "Something went wrong!"}`);
      }
    } catch (err) {
      console.error("Error submitting bank details:", err.message);
      toast.error("❌ Network error or server not reachable");
    }
  };

  const handleEdit = (bank) => {
    setEditingId(bank.id);
    setForm(bank);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${config.API_BASE_URL}/bank-details/${id}`, {
      method: "DELETE",
    });
    toast.success("🗑️ Deleted successfully");
    fetchBanks();
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Bank" : "Add Bank"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <Input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Account Number
            </label>
            <Input
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              IFSC Code
            </label>
            <Input
              name="ifsc_code"
              value={form.ifsc_code}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Account Holder Name
            </label>
            <Input
              name="account_holder_name"
              value={form.account_holder_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <Input
              name="branch_name"
              value={form.branch_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              UPI Number
            </label>
            <Input
              name="upi_number"
              value={form.upi_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button className="mt-4" onClick={handleSubmit}>
          {editingId ? "Update" : "Save"}
        </Button>

        <hr className="my-6" />

        <table className="w-full text-sm border-collapse">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Bank Name</th>
              <th className="p-2 text-left">Account No</th>
              <th className="p-2 text-left">IFSC</th>
              <th className="p-2 text-left">Holder</th>
              <th className="p-2 text-left">Branch Name</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank, index) => (
              <tr
                key={bank.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{bank.bank_name}</td>
                <td className="p-2">{bank.account_number}</td>
                <td className="p-2">{bank.ifsc_code}</td>
                <td className="p-2">{bank.account_holder_name}</td>
                <td className="p-2">{bank.branch_name}</td>

                <td className="p-2 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <FaEdit
                      onClick={() => handleEdit(bank)}
                      className="text-blue-600 cursor-pointer"
                    />
                    <FaTrash
                      onClick={() => handleDelete(bank.id)}
                      className="text-red-600 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {banks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No bank details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BankDetails;
