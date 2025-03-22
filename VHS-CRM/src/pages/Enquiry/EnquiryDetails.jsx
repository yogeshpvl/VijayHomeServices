import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../components/ui/Input";
import moment from "moment";
import apiService from "../../services/ApiServices";
import EnquiryService from "../../services/enquiryService";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";

const EnquiryDetail = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (enquiry) {
      setFormData((prevData) => ({
        ...prevData,
        category: enquiry.category || "",
        city: enquiry.city || "",
      }));
    }
  }, [enquiry]);
  console.log("enquiry?.category", enquiry?.category);

  const [formData, setFormData] = useState({
    enquiryId: id,
    staff: users.displayname,
    response: "",
    description: "",
    colorCode: "",
    date: "",
    category: "", // Default empty string
    city: "", // Default empty string
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("formData", formData);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const enquiryResponse = await EnquiryService.getEnquiryById(id);
        setEnquiry(enquiryResponse.data); // enquiry gets updated here

        const responseData = await apiService.fetchResponseData();
        setResponses(responseData);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchfollowupsData = async () => {
    setLoading(true);
    try {
      // Fetch enquiry details
      const enquiryResponse = await EnquiryService.getEnquiryFollowupsById(id);

      setFollowUps(enquiryResponse.followups);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchfollowupsData();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmDelete) return;

    try {
      await EnquiryService.deleteEnquiry(id);

      alert("Enquiry deleted successfully!");
      navigate("/enquiries");
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      alert("Failed to delete enquiry.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!enquiry.category || !enquiry.city) {
      toast.error("Please add category and city ");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/followups",
        formData
      );
      if (res.status === 201) {
        fetchfollowupsData();
        setFormData({
          response: "",
          description: "",
          value: "",
          color: "",
          next_followup_date: "",
        });
      }
    } catch (err) {
      setError("Failed to create follow-up. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left Section - Enquiry Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Enquiry Detail
        </h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 font-semibold flex justify-between">
            <span>
              Modify |{" "}
              <button
                className="text-red-500 hover:underline"
                onClick={handleDelete}
              >
                Delete
              </button>
            </span>
          </div>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <DetailRow label="Enquiry ID" value={enquiry.enquiryId} />
              <DetailRow label="Category" value={enquiry.category} />
              <DetailRow label="Enquiry Date" value={enquiry.date} />
              <DetailRow label="Executive" value={enquiry.executive} />
              <DetailRow label="Name" value={enquiry.name} />
              <DetailRow label="Contact 1" value={enquiry.mobile} isWhatsApp />
              <DetailRow label="Contact 2" value={enquiry.contact2 || "-"} />
              <DetailRow label="Email Id" value={enquiry.email || "-"} />
              <DetailRow label="Address" value={enquiry.address} />
              <DetailRow label="Reference" value={enquiry.reference1 || "-"} />
              <DetailRow
                label="Reference 2"
                value={enquiry.reference2 || "-"}
              />
              <DetailRow
                label="Interested For"
                value={enquiry.interested_for}
              />
              <DetailRow label="Comment" value={enquiry.comment || "-"} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Section - Follow-Up Details */}
      <div className="bg-white   p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Follow-Up Detail
        </h2>

        {/* Follow-Up Table */}
        <table className="w-full mt-2 border border-gray-50 text-sm">
          <thead className="bg-gray-200">
            <tr className="border-b">
              <th className="p-2">Sr</th>
              <th className="p-2">Date</th>
              <th className="p-2">Staff</th>
              <th className="p-2">Response</th>
              <th className="p-2">Description</th>
              <th className="p-2">Value</th>
              <th className="p-2">Next Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {followUps?.length > 0 ? (
              followUps.map((followUp, index) => (
                <tr
                  key={followUp.id}
                  className="border border-gray-300 text-center"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {moment(followUp.date).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-2">{followUp.staff}</td>
                  <td
                    className={`p-2 ${
                      followUp.response === "Confirmed"
                        ? "text-green-600"
                        : "text-black-500"
                    }`}
                  >
                    {followUp.response}
                  </td>
                  <td className="p-2">{followUp.description}</td>
                  <td className="p-2 font-semibold">₹{followUp.value}</td>
                  <td className="p-2 ">{followUp.next_followup_date || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-600">
                  No follow-up records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Staff Name */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Staff Name
            </label>
            <Input
              type="text"
              value={users.displayname}
              disabled
              className="bg-gray-200 w-full p-2 rounded-md"
            />
          </div>

          {/* Follow-up Date */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Follow-up Date
            </label>
            <Input
              type="text"
              value={moment().format("YYYY-MM-DD")}
              disabled
              className="bg-gray-200 w-full p-2 rounded-md"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Response *
            </label>
            <select
              name="response"
              value={formData.response}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            >
              <option value="">--Select--</option>
              {responses?.map((item, index) => (
                <option value={item.response_name}>{item.response_name}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.response && (
          <div className="w-50 mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            />
          </div>
        )}

        {(formData.response === "Survey" ||
          formData.response === "Call Later" ||
          formData.response === "Quote") && (
          <div className=" w-50 mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Next Follow-up Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            />
          </div>
        )}

        {(formData.response === "Call Later" ||
          formData.response === "Quote") && (
          <div className="w-50 mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Color Code *
            </label>
            <select
              name="colorCode"
              value={formData.colorCode}
              onChange={handleChange}
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            >
              <option value="">--Select--</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>
        )}

        {formData.response === "Confirmed" && (
          <div className="w-50 mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Value *
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full border bg-white border-gray-300 px-3 py-1 rounded-md"
            />
          </div>
        )}

        <Button children={"Save"} onClick={handleSubmit} />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isWhatsApp }) => (
  <tr className="border-b border-gray-300">
    <td className="w-1/3 bg-gray-100 px-4 py-2 font-medium">{label}</td>
    <td className="w-2/3 px-4 py-2 flex items-center">
      {value} {isWhatsApp && <span className="ml-2">📱</span>}
    </td>
  </tr>
);

export default EnquiryDetail;
