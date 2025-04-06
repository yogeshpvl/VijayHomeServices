import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../services/config";
import moment from "moment";
import { toast } from "react-toastify";

function QuoteFollwups({ id }) {
  const users = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    foll_date: moment().format("YYYY-MM-DDTHH:mm"),
    staff_name: users?.displayname || "",
    response: "",
    description: "",
    nxtfoll: "",
  });
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    fetchFollowups();
  }, [id]);

  const fetchFollowups = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/quote-followups/${id}`
      );
      setFollowups(res.data || []);
    } catch (err) {
      console.error("Failed to fetch followups:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.response || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await axios.post(`${config.API_BASE_URL}/quote-followups`, {
        ...formData,
        enquiryId: id,
        nxtfoll:
          formData.nxtfoll && formData.nxtfoll !== "Invalid date"
            ? formData.nxtfoll
            : null,
      });
      toast.success("Quote followups successfuly added");
      setFormData({
        foll_date: moment().format("YYYY-MM-DDTHH:mm"),
        staff_name: users?.displayname || "",
        response: "",
        description: "",
        nxtfoll: "",
      });
      fetchFollowups();
    } catch (err) {
      console.error("Error creating followup:", err);
    }
  };

  const responseOptions = ["Call Later", "Not Interested", "Confirmed"];

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Followups Details</h4>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm mt-3">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="bg-blue-50 ">
              <th className="py-2 px-4 text-left text-sm">Sr</th>
              <th className="py-2 px-4 text-left text-sm">Foll Date</th>
              <th className="py-2 px-4 text-left text-sm">Staff Name</th>
              <th className="py-2 px-4 text-left text-sm">Response</th>
              <th className="py-2 px-4 text-left text-sm">Desc</th>
              <th className="py-2 px-4 text-left text-sm">Nxt foll</th>
            </tr>
          </thead>
          <tbody>
            {followups.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="border border-gray-200 px-3 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.foll_date}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.staff_name}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.response}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.description}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.nxtfoll}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Follow-up Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.foll_date}
            onChange={(e) =>
              setFormData({ ...formData, foll_date: e.target.value })
            }
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Staff Name</label>
          <input
            type="text"
            value={users.displayname}
            onChange={(e) =>
              setFormData({ ...formData, staff_name: e.target.value })
            }
            placeholder="Staff Name"
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Response</label>
          <select
            value={formData.response}
            onChange={(e) =>
              setFormData({ ...formData, response: e.target.value })
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            <option value="">Select Response</option>
            {responseOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Next Follow-up Date
          </label>
          <input
            type="date"
            value={formData.nxtfoll}
            onChange={(e) =>
              setFormData({ ...formData, nxtfoll: e.target.value })
            }
            placeholder="Next Follow-up Date"
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>
        <div className="self-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuoteFollwups;
