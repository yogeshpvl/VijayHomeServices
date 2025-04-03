import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { config } from "../../services/config";
import { toast } from "react-toastify";

const SurveyDetails = () => {
  const { enquiryId } = useParams();
  const location = useLocation();
  const rowData = location.state?.rowData;

  const navigate = useNavigate();
  const [sendWhatsApp, setSendWhatsApp] = useState("yes");
  const [vendorData, setvendorData] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [templateName, setTemplateName] = useState("Survey assign");
  const [whatsappData, setWhatsappData] = useState("");
  const [cancelTemplateData, setCancelTemplateData] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  console.log("rowData", rowData);
  const [formData, setFormData] = useState({
    next_followup_date: "",
    appo_time: "",
    executive_name: "",
    executive_id: "",
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        next_followup_date: rowData.followup_next_followup_date || "",
        appo_time: rowData.followup_appo_time || "",
        executive_name: rowData.followup_executive_name || "",
        executive_id: rowData.followup_executive_id?.toString() || "", // ensure it's a string for select
      });

      // Optional: preselect assignTo if executive_id exists
      if (rowData.followup_executive_id) {
        setAssignTo("Executive");
      }
    }
  }, [rowData]);

  useEffect(() => {
    getWhatsappTemplate();
  }, [templateName]);

  const getWhatsappTemplate = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${templateName}`
        ),
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/Survey cancel`
        ),
      ]);

      if (res1.status === 200) {
        setWhatsappData(res1.data?.content || "");
      }

      if (res2.status === 200) {
        setCancelTemplateData(res2.data?.content || "");
      }
    } catch (error) {
      console.error("Error fetching WhatsApp templates:", error);
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      if (rowData?.city && rowData?.category && assignTo) {
        try {
          const response = await axios.get(
            `${config.API_BASE_URL}/vendors/filter/?city=${rowData?.city}&category=${rowData?.category}&type=${assignTo}`
          );

          setvendorData(response.data);
        } catch (error) {
          console.error("Error fetching details", error);
        }
      } else {
        console.log("Missing city, category, or assignTo data.");
      }
    };

    fetchVendors();
  }, [enquiryId, assignTo]);

  const updateFollowupAppointment = async () => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/followups/update-followup-appointment/${rowData?.followup_id}`,
        formData
      );

      if (response.status === 200) {
        await makeApiCall();
        toast.success("Executive assinged sucessfully");
      }
    } catch (error) {
      console.error("❌ Failed to update followup appointment:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleModify = () => {
    navigate(`/enquiry/edit/${enquiryId}`);
  };

  const makeApiCall = async () => {
    const contentTemplate = WhatsappData || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }
    const invoiceLink = contentTemplate
      .replace(/\{Customer_name\}/g, rowData?.name)
      .replace(/\{Service_name\}/g, rowData.interested_for)
      .replace(/\{Appointment_datetime\}/g, rowData.followup_next_followup_date)
      .replace(/\{Executive_name\}/g, rowData.followup_executive_name);

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = invoiceLink
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/<strong>(.*?)<\/strong>/g, "<b>$1</b>")
      .replace(/<[^>]*>/g, "");

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/whats-msg/send-message`,
        {
          mobile: rowData?.mobile,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        window.location.assign(
          `/Survey/SurveyList/${rowData?.followup_next_followup_date}/${rowData?.category}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelSurvey = async () => {
    try {
      if (!cancelReason.trim()) {
        alert("Please provide a cancellation reason");
        return;
      }

      const response = await axios.put(
        `${config.API_BASE_URL}/followups/update-cancel-survey/${rowData.followup_id}`,
        {
          status: "CANCEL",
          creason: cancelReason,
        }
      );

      await CancelWhatApi();
      console.log("response", response);
      setShowCancelModal(false);
      toast.success("Survey cancelled successfully");
    } catch (error) {
      console.error("Error cancelling survey:", error);
      toast.error("Failed to cancel survey");
    }
  };

  const CancelWhatApi = async () => {
    const contentTemplate = cancelTemplateData || "";

    if (!contentTemplate.trim()) {
      toast.error("WhatsApp template is empty. Cannot send message.");
      return;
    }

    const googleForm =
      "https://docs.google.com/forms/d/e/1FAIpQLSd5Dk_Ie_NZjni1alGU5I8nkEpJ_Qb4_eQsSnfBSRYve6eS5g/viewform";

    const message = contentTemplate
      .replace(/\{Customer_name\}/g, rowData?.name)
      .replace(/\{survey_date\}/g, rowData?.next_followup_date)
      .replace(/\{google Form\}/g, googleForm)
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/<strong>(.*?)<\/strong>/g, "$1")
      .replace(/<[^>]*>/g, "");

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/whats-msg/send-message`,
        {
          mobile: rowData?.mobile,
          msg: message,
        }
      );

      if (response.status === 200) {
        window.location.assign(
          `/Survey/SurveyList/${rowData?.next_followup_date}/${rowData?.category}`
        );
      } else {
        toast.error("Failed to send WhatsApp message.");
        window.location.assign(
          `/Survey/SurveyList/${rowData?.next_followup_date}/${rowData?.category}`
        );
      }
    } catch (error) {
      console.error("WhatsApp send error:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-2xl font-poppins">
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleModify}
          className="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 active:scale-95 transition"
        >
          Edit Details
        </button>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 active:scale-95 transition"
          onClick={() => navigate(`/Quote/quoteDetails/${enquiryId}`)}
        >
          Quotation
        </button>
      </div>

      {/* Customer Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[15px] bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Customer Name:</span>{" "}
            <span className="text-gray-800">{rowData?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Contact1:</span>
            <span className="text-gray-800">{rowData?.mobile}</span>
            <a
              href={`https://wa.me/91${rowData.mobile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            <span className="text-gray-800">{rowData?.address}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Executive:</span>{" "}
            <span className="text-gray-800">{rowData?.executive}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Contact2:</span>{" "}
            <span className="text-gray-800">{rowData?.contact2}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Customer Type:</span>{" "}
            <span className="text-gray-800">{rowData?.reference1}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            <span className="text-gray-800">{rowData?.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Desc:</span>{" "}
            <span className="text-gray-800">
              {rowData?.followup_description}
            </span>
          </div>
        </div>
      </div>

      {/* Job Information */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Job Information</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">Enquiry Date</label>
            <input
              type="date"
              name="enquiryDate"
              value={rowData.date}
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Enquiry Time</label>
            <input
              type="text"
              name="enquiryTime"
              value={rowData.time}
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
          <div></div>
          <div>
            <label className="block mb-1 font-medium">Appointment Date</label>
            <input
              type="date"
              name="next_followup_date"
              value={formData.next_followup_date}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Appointment Time</label>
            <select
              name="appo_time"
              value={formData.appo_time}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
            >
              <option value="">--select--</option>
              <option value="9AM-10AM">9AM-10AM</option>
              <option value="10AM-11AM">10AM-11AM</option>
              <option value="11AM-12PM">11AM-12PM</option>
              <option value="12PM-1PM">12PM-1PM</option>
              <option value="1PM-2PM">1PM-2PM</option>
              <option value="2PM-3PM">2PM-3PM</option>
              <option value="3PM-4PM">3PM-4PM</option>
              <option value="4PM-5PM">4PM-5PM</option>
              <option value="5PM-6PM">5PM-6PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Assignment */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          Service and Repair Information
        </h2>
        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="Executive"
              checked={assignTo === "Executive"}
              onChange={(e) => setAssignTo(e.target.value)}
            />
            Executive Name
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="outvendor"
              checked={assignTo === "outvendor"}
              onChange={(e) => setAssignTo(e.target.value)}
            />
            Vendor
          </label>
        </div>

        {assignTo && (
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm">
              Vendor Name
            </label>
            <select
              name="executive_id"
              value={formData.executive_id}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedVendor = vendorData.find(
                  (item) => item.id.toString() === selectedId
                );
                setFormData({
                  ...formData,
                  executive_id: selectedId,
                  executive_name: selectedVendor?.vhsname || "",
                });
              }}
              className="w-75 border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
            >
              <option value="">-select-</option>
              {vendorData?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.vhsname}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* WhatsApp Template */}
      <div className="mt-6">
        <label className="block font-medium text-sm mb-1">
          Send WhatsApp Template
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="yes"
              checked={sendWhatsApp === "yes"}
              onChange={(e) => setSendWhatsApp(e.target.value)}
            />{" "}
            YES
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="no"
              checked={sendWhatsApp === "no"}
              onChange={(e) => setSendWhatsApp(e.target.value)}
            />{" "}
            NO
          </label>
        </div>
      </div>

      {rowData?.followup_status === "CANCEL" ? (
        <h4 className="mt-3 text-red-500">{rowData?.followup_creason}</h4>
      ) : (
        <div className="flex justify-start gap-4 mt-6">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition text-sm"
            onClick={updateFollowupAppointment}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition text-sm"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Survey
          </button>
        </div>
      )}
      <button
        className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition text-sm"
        onClick={() => setShowCancelModal(true)}
      >
        Cancel Survey
      </button>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Cancel Survey</h2>
            <label className="block text-sm font-medium mb-2">
              Reason for cancellation
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={4}
              placeholder="Enter reason..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-md border text-sm"
              >
                Close
              </button>
              <button
                onClick={handleCancelSurvey}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyDetails;
