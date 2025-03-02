import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ✅ Extracts `enquiryId` from the URL
import axios from "axios";

const EnquiryDetail = () => {
  const { id } = useParams(); // ✅ Extract Enquiry ID from URL
  const [enquiry, setEnquiry] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Enquiry Details & Follow-Up Data
  useEffect(() => {
    const fetchEnquiryDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/enquiries/${id}`
        );
        setEnquiry(response.data.data); // ✅ Set enquiry details

        // ✅ Fetch follow-up details if they exist
        // const followUpResponse = await axios.get(
        //   `http://localhost:5000/api/enquiries/${id}/follow-ups`
        // );
        setFollowUps([]);
      } catch (err) {
        setError("Failed to fetch enquiry details.");
        console.error("Error fetching enquiry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left Section - Enquiry Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Enquiry Detail
        </h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 font-semibold flex justify-between">
            <span>Modify | Delete</span>
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
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Follow-Up Detail
        </h2>
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
            {followUps.length > 0 ? (
              followUps.map((followUp, index) => (
                <tr
                  key={followUp.id}
                  className="border border-gray-300 text-center"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{followUp.date}</td>
                  <td className="p-2">{followUp.staff}</td>
                  <td
                    className={`p-2 ${
                      followUp.response === "Confirmed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {followUp.response}
                  </td>
                  <td className="p-2">{followUp.description}</td>
                  <td className="p-2 font-semibold">₹{followUp.value}</td>
                  <td className="p-2 text-red-500">
                    {followUp.nextFollowUpDate || "-"}
                  </td>
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
