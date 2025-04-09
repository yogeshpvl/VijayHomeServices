import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../../services/config";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
// import { CalendarIcon, WhatsappIcon } from "lucide-react";

const DSRDetails = () => {
  const { id } = useParams();
  const users = JSON.parse(localStorage.getItem("user"));
  const userRoles = users?.roles || {};
  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] = useState(null);
  const [vendorType, setVendorType] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [appoDate, setappoDate] = useState("");
  const [vendorData, setvendorData] = useState([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [WhatsApp, setWhatsApp] = useState("YES");
  const [assignedtemplateData, setassignedtemplateData] = useState([]);
  const [CancelTemplateData, setCancelTemplateData] = useState([]);
  const [rescheduleTemplateData, setrescheduleTemplateData] = useState([]);
  const [completeTemplateData, setcompleteTemplateData] = useState([]);
  const [invoiceTemplateData, setinvoiceTemplateData] = useState([]);
  const [vendorExp, setVendorExp] = useState("");
  const [vendorLan, setVendorLan] = useState("");

  console.log("details", details);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_feedback: "",
    worker_names: "",
    worker_amount: "",
    day_to_complete: "",
    job_complete: "NO",
    tech_comment: "",
    cancel_reason: "",
    vendor_id: selectedVendorId,
    vendor_name: selectedVendorName,
  });
  const [form1, setForm1] = useState({
    city: "",
    selected_slot_text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setForm1((prevData) => ({
      ...prevData,
      [name]: value, // Update selected_slot_text
    }));
  };

  const handleSubmit = async () => {
    if (form.job_complete === "CANCEL" && !form?.cancel_reason?.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/bookingService/${id}`,
        form
      );

      if (response.status === 200) {
        toast.success("Updated successfully");

        if (WhatsApp === "YES") {
          if (form.job_complete === "CANCEL") {
            await whatsappscancel();
          } else if (form.job_complete === "NO" && selectedVendorName) {
            await whatsapptectassign();
          } else if (form.job_complete === "YES" && selectedVendorName) {
            await whatsappscomplete();
          }
        }

        navigate(
          `/DSR/DSRList/${details?.service_date}/${details?.Booking?.category}`
        );
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChaneCitySlot = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/bookings/update/${details?.booking_id}`,

        form1
      );
      toast.success("Updated succesfully");
      console.log("Service updated:", response.data);
      // Optionally, redirect or show toast here
    } catch (error) {
      console.error("Error updating service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChaneREschduled = async () => {
    if (!rescheduleReason.trim()) {
      toast.error("Please enter a reschedule reason");
      return;
    }

    setIsLoading(true);

    const formData = {
      service_date: appoDate,
      service_id: id,
      techname: users?.displayname,
      reason: rescheduleReason,
      number: users?.contactno,
    };

    try {
      // 1. Update booking service date
      await axios.put(`${config.API_BASE_URL}/bookingService/${id}`, {
        service_date: appoDate,
      });

      // 2. Log reschedule entry
      await axios.post(`${config.API_BASE_URL}/reschedules`, formData);

      // 3. Send WhatsApp only if enabled
      if (WhatsApp === "YES") {
        await whatsappreschedule();
      }

      toast.success("Service rescheduled successfully");
      setShowRescheduleModal(false);
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to reschedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorSelect = (e) => {
    const vendorId = e.target.value;
    setSelectedVendorId(vendorId);

    const vendor = vendorData.find((vendor) => vendor.id == vendorId);
    if (vendor) {
      setSelectedVendorName(vendor.vhsname);
      // Add vendor ID and vendor name to the form
      setForm((prevForm) => ({
        ...prevForm,
        vendor_id: vendorId,
        vendor_name: vendor.vhsname,
      }));
      setVendorExp(vendor.experiance);
      setVendorLan(vendor.languagesknow);
    }
  };

  const handleVendorTypeChange = (event) => {
    setVendorType(event.target.value);
  };

  // Fetch service details and set initial state from details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/bookingService/service/${id}`
        );
        const serviceData = response.data;
        setDetails(serviceData);

        setForm1((prevData) => {
          console.log("Prev Form1 Data: ", prevData);
          return {
            ...prevData,
            selected_slot_text:
              prevData.selected_slot_text ||
              serviceData?.Booking?.selected_slot_text ||
              "",
            city:
              prevData.city ||
              (serviceData?.Booking?.city ? serviceData?.Booking?.city : "") ||
              "",
          };
        });
        // If there is job_complete data in the service, set it in the form
        if (serviceData?.job_complete) {
          setForm((prevData) => ({
            ...prevData,
            job_complete: serviceData.job_complete,
            customer_feedback: serviceData.customer_feedback,
            worker_names: serviceData.worker_names,
            worker_amount: serviceData.worker_amount,
            day_to_complete: serviceData.day_to_complete,
            tech_comment: serviceData.tech_comment,
            vendor_name: serviceData.vendor_name,
            cancel_reason: serviceData.cancel_reason,
            start_date_time: serviceData.start_date_time,
            end_date_time: serviceData.end_date_time,
          }));
          // Check if city is empty before setting it
        }
      } catch (error) {
        console.error("Error fetching details", error);
      }
    };

    fetchData();
  }, [id, config.API_BASE_URL]);

  useEffect(() => {
    const fetchVendors = async () => {
      if (details?.Booking?.city && details?.Booking?.category && vendorType) {
        try {
          const response = await axios.get(
            `${config.API_BASE_URL}/vendors/filter/?city=${details?.Booking.city}&category=${details?.Booking?.category}&type=${vendorType}`
          );
          setvendorData(response.data);
        } catch (error) {
          console.error("Error fetching details", error);
        }
      } else {
        console.log("Missing city, category, or vendorType data.");
      }
    };

    fetchVendors();
  }, [id, details?.Booking?.city, details?.Booking?.category, vendorType]);

  useEffect(() => {
    getWhatsappTemplate();
  }, []);

  const getWhatsappTemplate = async () => {
    const assign = "Tech assign";
    const cancel = "Service cancel";
    const reschedule = "Service reschedule";
    const complete = "Service Completed";
    const invoice = "Send Invoice Link";

    try {
      const [res1, res2, res3, res4, res5] = await Promise.all([
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${assign}`
        ),
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${cancel}`
        ),
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${reschedule}`
        ),
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${complete}`
        ),
        axios.get(
          `${config.API_BASE_URL}/whatsapp-templates/get-template/${invoice}`
        ),
      ]);

      if (res1.status === 200) {
        setassignedtemplateData(res1.data?.content || "");
      }

      if (res2.status === 200) {
        setCancelTemplateData(res2.data?.content || "");
      }

      if (res3.status === 200) {
        setrescheduleTemplateData(res3.data?.content || "");
      }

      if (res4.status === 200) {
        setcompleteTemplateData(res4.data?.content || "");
      }
      if (res4.status === 200) {
        setinvoiceTemplateData(res4.data?.content || "");
      }
    } catch (error) {
      console.error("Error fetching WhatsApp templates:", error);
    }
  };

  const whatsapptectassign = async () => {
    const contentTemplate = assignedtemplateData || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const invoiceLink = contentTemplate
      .replace(/\{Customer_name\}/g, details?.Booking?.customer?.customerName)
      .replace(/\{Job_type\}/g, details?.Booking.description)
      .replace(/\{Service_amount\}/g, details?.service_charge)
      .replace(/\{Call_date\}/g, details?.service_date)
      .replace(/\{Slot_timing\}/g, details?.Booking.selected_slot_text)
      .replace(/\{Staff_name\}/g, users.displayname)
      .replace(/\{Service_date\}/g, details?.service_date)
      .replace(/\{Staff_contact\}/g, users.contactno)
      .replace(/\{Technician_name\}/g, selectedVendorName)
      .replace(/\{Technician_experiance\}/g, vendorExp || 2)
      .replace(/\{Technician_languages_known\}/g, vendorLan || "kannada,hindi");

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
          mobile: "91" + details?.Booking?.customer?.mainContact,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        toast.success("whatsapptectassign sent succesful");
        // window.location.assign(`/dsrcallist/${data1}/${data.category}`);
      } else {
        console.error("API call unsuccessful. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error making API call:", error);
      window.location.assign(`/dsrcallist/${data1}/${data.category}`);
    }
  };

  const whatsappscomplete = async () => {
    const contentTemplate = completeTemplateData || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const googleform =
      "https://docs.google.com/forms/d/e/1FAIpQLSeldzBperWqrReLAA5AV6gVEftCOT3vUglibWScSWdzDAPjkA/viewform";

    const invoiceLink = contentTemplate
      .replace(/\{Customer_name\}/g, details?.Booking?.customer?.customerName)
      .replace(/\{Service_name\}/g, details?.service_name)
      .replace(/\{Service_amount\}/g, details?.service_chargel)
      // .replace(/\{Invoice_link\}/g, data?.dividedDates[0]?.date)
      .replace(/\{google_Form\}/g, googleform);

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
          mobile: "91" + details?.Booking?.customer?.mainContact,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        // window.location.assign(`/dsrcallist/${data1}/${data.category}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const whatsappscancel = async () => {
    const contentTemplate = CancelTemplateData || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const googleform =
      "https://docs.google.com/forms/d/e/1FAIpQLSdZjDyG7QsnwVnCnhkrFEHguWP5vNxTi03KZWgap0xXd5_geQ/viewform";

    console.log("contentTemplate", contentTemplate);

    const invoiceLink = contentTemplate
      .replace(/\{Customer_name\}/g, details?.Booking?.customer?.customerName)
      .replace(/\{Service_name\}/g, details?.service_name)
      .replace(/\{Service_date\}/g, details?.service_date)
      .replace(/\{google_Form\}/g, googleform);

    console.log("invoiceLink", invoiceLink);
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
          mobile: "91" + details?.Booking?.customer?.mainContact,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        toast.success("service cancel msg sent sucessful");

        // window.location.assign(`/dsrcallist/${data1}/${data.category}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const whatsappreschedule = async () => {
    const contentTemplate = rescheduleTemplateData || "";

    console.log("contentTemplate", contentTemplate);

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }
    const invoiceLink = contentTemplate
      .replace(/\{Customer_name\}/g, details?.Booking?.customer?.customerName)
      .replace(/\{Service_name\}/g, details?.service_name)
      .replace(/\{Service_date\}/g, details?.service_date)
      .replace(/\{reschedule_service_date\}/g, appoDate);

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
          mobile: "91" + details?.Booking?.customer?.mainContact,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        toast.success("whats app msg sent Successfully ");
        // window.location.assign(`/dsrcallist/${data1}/${data.category}`);

        // window.location.reload("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const invoicewhatsbill = async () => {
    const contentTemplate = invoiceTemplateData || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      details?.Booking?.customer?.customerName
    );
    const serviceName = content.replace(
      /\{Service_name\}/g,
      details?.service_name
    );
    const serivePrice = serviceName.replace(
      /\{Service_amount\}/g,
      details.service_charge
    );

    const invoiceUrl = `https://crm.vijayhomeservicebengaluru.in/dsrinvoice?id=${id}`;
    const googleform =
      "https://docs.google.com/forms/d/e/1FAIpQLSdZjDyG7QsnwVnCnhkrFEHguWP5vNxTi03KZWgap0xXd5_geQ/viewform";
    const invoiceLink = serivePrice.replace(
      /\{Invoice_link\}/g,
      `[Click to view invoice](${invoiceUrl})`
    );

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = invoiceLink
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/\{google_Form\}/g, googleform)
      .replace(/<strong>(.*?)<\/strong>/g, "<b>$1</b>")
      .replace(/<[^>]*>/g, "");

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/whats-msg/send-message`,
        {
          mobile: "91" + details?.Booking?.customer?.mainContact,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        toast.success("service cancel msg sent sucessful");

        // window.location.assign(`/dsrcallist/${data1}/${data.category}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset); // convert to local time
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="max mx-auto space-y-6">
        <div className="bg-white shadow rounded-md p-4  mb-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4">Job Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-bold">Booking Date & Time:</label>
              <Input
                className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]"
                value={moment(details?.created_at).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              />
            </div>
            <div>
              <label className="font-bold">Priority Level:</label>
              <select
                name="level"
                className="w-full border border-gray-300 p-1 rounded mt-1"
              >
                <option value="">--select--</option>
                <option value="9AM-10AM">9AM-10AM</option>
                <option value="10AM-11AM">10AM-11AM</option>
                <option value="11AM-12PM">11AM-12PM</option>
              </select>
            </div>
            <div></div>
            <div className="mt-3">
              <label className="font-bold">Appointment Date:</label>
              <Input
                type="date"
                className="mt-1"
                value={details?.service_date}
                onChange={() => setappoDate(e.target.value)}
              />
              {userRoles?.Reschedule ? (
                <Button
                  className="mt-3 bg-orange-500"
                  onClick={() => setShowRescheduleModal(true)}
                >
                  Reschedule
                </Button>
              ) : (
                ""
              )}
            </div>
            <div className="mt-3">
              <label className="font-bold">Appointment Time:</label>
              <select
                value={
                  form1.selected_slot_text ||
                  details?.Booking.selected_slot_text
                }
                name="selected_slot_text"
                onChange={handleChange1} // Update the form state when the value changes
                className="w-full border border-gray-300 p-1 mt-1 rounded"
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
              <Button
                className="mt-3"
                variant="blacks"
                onClick={handleChaneCitySlot}
              >
                Update Slot
              </Button>
            </div>

            <div className="mt-3">
              <label className="font-bold">City:</label>
              <select
                name="city"
                className="w-full border border-gray-300 mt-1 p-1 rounded-md"
                value={form1.city || details?.Booking.city}
                onChange={handleChange1} // Update the form state when the value changes
              >
                <option value="">--Select City--</option>
                {users?.city?.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Button
                className="mt-3"
                variant="blacks"
                onClick={handleChaneCitySlot}
              >
                Update City
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-md p-4 mt-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-bold">Customer Name:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.customerName || "-"}
              </div>
            </div>
            <div>
              <label className="font-bold">Contact1:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.mainContact || "-"}
              </div>
            </div>
            <div>
              <label className="font-bold">Contact2:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.alternateContact || "-"}
              </div>
            </div>
            <div>
              <label className="font-bold">City:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.city || "-"}
              </div>
            </div>
            <div>
              <label className="font-bold">Email:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.email || "-"}
              </div>
            </div>
            <div>
              <label className="font-bold">Customer Type:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.approach || "-"}
              </div>
            </div>

            <div>
              <label className="font-bold">Address:</label>
              <div className="bg-gray-100 p-1 rounded mt-1 min-h-[32px]">
                {details?.Booking?.customer?.lnf || "-"}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800">
            Treatment Details
          </h2>
          <div className="overflow-auto rounded-md">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-300 text-gray-700">
                <tr>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    #
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Category
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Contract
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Treatment
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Frequency
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Contract Period
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Service Date
                  </th>
                  <th className="border px-3 py-2 font-medium text-left border-gray-200">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-gray-150 hover:bg-blue-50 transition">
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    1
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.Booking?.category}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {details?.Booking?.contract_type}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.service_name}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {details?.Booking?.service_frequency || 1}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {moment(details?.Booking?.start_date).format("DD MMM YYYY")}{" "}
                    -{" "}
                    {moment(details?.Booking?.expiry_date).format(
                      "DD MMM YYYY"
                    )}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {details?.service_date}
                  </td>

                  <td className="border border-gray-200 px-3 py-2 text-right">
                    ₹ {details?.service_charge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow rounded-md p-4 mt-4 mb-4 text-sm border-1 border-gray-200">
          <h2 className="text-base font-semibold mb-4">
            Service & Repair Information
          </h2>

          {/* Two Columns Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {details?.Booking?.category === "Painting" ||
              details?.Booking?.category === "Appliance Services" ||
              details?.Booking?.category === "Home Repair Services" ? (
                <>
                  {/* Customer Feedback */}
                  <div className="mb-4 border border-gray-300 p-3 rounded-md">
                    <label className="font-bold block mb-1">
                      Customer Feedback:
                    </label>
                    <textarea
                      name="customer_feedback"
                      value={form.customer_feedback}
                      onChange={handleChange}
                      className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full"
                    />
                  </div>

                  {/* Worker Names */}
                  <div className="mb-4 border border-gray-300 p-3 rounded-md">
                    <label className="font-bold block mb-1">
                      Worker Names:
                    </label>
                    <textarea
                      name="worker_names"
                      value={form.worker_names}
                      onChange={handleChange}
                      className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full"
                    />
                  </div>

                  {/* Day To Complete */}
                  <div className="mb-4 border border-gray-300 p-3 rounded-md">
                    <label className="font-bold block mb-1">
                      Day To Complete:
                    </label>
                    <input
                      name="day_to_complete"
                      value={form.day_to_complete}
                      onChange={handleChange}
                      type="date"
                      className="bg-gray-100 p-1 rounded mt-1 w-full"
                    />
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* Logged User */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-bold block mb-1">Logged User:</label>
                <input
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                  value={users.displayname}
                  readOnly
                />
                <input
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                  value={users.contactno}
                  readOnly
                />
              </div>

              {/* Backoffice Executive */}
              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <label className="font-bold block mb-1">
                  Backoffice Executive:
                </label>
                <input
                  className="bg-gray-100 p-1 rounded mt-1 w-full"
                  value={details?.Booking?.backoffice_executive}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Job Complete (Radio buttons) */}
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-bold block mb-1">Job Complete:</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      id="yes"
                      name="job_complete"
                      className="mr-2"
                      value="YES"
                      checked={form.job_complete === "YES"}
                      onChange={handleChange}
                    />
                    <label htmlFor="yes" className="mr-4">
                      YES
                    </label>

                    <input
                      type="radio"
                      id="no"
                      name="job_complete"
                      className="mr-2"
                      value="NO"
                      checked={form.job_complete === "NO"}
                      onChange={handleChange}
                    />
                    <label htmlFor="no" className="mr-4">
                      NO
                    </label>
                    {userRoles.Cancel ? (
                      <>
                        <input
                          type="radio"
                          id="cancel"
                          name="job_complete"
                          className="mr-2"
                          value="CANCEL"
                          checked={form.job_complete === "CANCEL"}
                          onChange={handleChange}
                        />
                        <label htmlFor="cancel">CANCEL</label>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {/* Whatsapp (Radio buttons) */}
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-bold block mb-1">Whatsapp:</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      id="whatsapp_yes"
                      name="whatsapp"
                      value="YES"
                      checked={WhatsApp === "YES"}
                      onChange={(e) => setWhatsApp(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="whatsapp_yes" className="mr-4">
                      YES
                    </label>

                    <input
                      type="radio"
                      id="whatsapp_no"
                      name="whatsapp"
                      value="NO"
                      checked={WhatsApp === "NO"}
                      onChange={(e) => setWhatsApp(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="whatsapp_no">NO</label>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div>
              {details?.Booking?.category === "Painting" ||
              details?.Booking?.category === "Appliance Services" ||
              details?.Booking?.category === "Home Repair Services" ? (
                <>
                  {/* Technician Comment */}
                  <div className="mb-4 border border-gray-300 p-3 rounded-md">
                    <label className="font-bold block mb-1">
                      Technician Comment:
                    </label>
                    <textarea
                      name="tech_comment"
                      value={form.tech_comment}
                      onChange={handleChange}
                      className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full"
                    />
                  </div>

                  {/* Worker Amount */}
                  <div className="mb-4 border border-gray-300 p-3 rounded-md">
                    <label className="font-bold block mb-1">
                      Worker Amount:
                    </label>
                    <textarea
                      name="worker_amount"
                      value={form.worker_amount}
                      onChange={handleChange}
                      className="bg-gray-100 p-1 rounded mt-1 min-h-[32px] w-full"
                    />
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* IN and OUT Sign Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-bold block mb-1">
                    IN Sign Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(details?.start_date_time)}
                    className="bg-gray-100 p-1 rounded mt-1 w-full"
                    readOnly // Remove if you want it editable
                  />
                </div>

                <div className="mb-4 border border-gray-300 p-3 rounded-md">
                  <label className="font-bold block mb-1">
                    OUT Sign Date & Time:
                  </label>
                  <input
                    value={formatDateForInput(details?.end_date_time)}
                    type="datetime-local"
                    className="bg-gray-100 p-1 rounded mt-1 w-full"
                  />
                </div>
              </div>

              <div className="mb-4 border border-gray-300 p-3 rounded-md">
                <div className="flex items-center mt-1 mb-3">
                  <input
                    type="radio"
                    id="pm"
                    name="vendor_selection"
                    value="PM"
                    className="mr-2"
                    onChange={handleVendorTypeChange} // Handle change
                  />
                  <label htmlFor="pm" className="mr-4">
                    PM
                  </label>

                  <input
                    type="radio"
                    id="tech"
                    name="vendor_selection"
                    value="Technician"
                    className="mr-2"
                    onChange={handleVendorTypeChange} // Handle change
                  />
                  <label htmlFor="tech" className="mr-4">
                    TECH
                  </label>

                  <input
                    type="radio"
                    id="vendor"
                    name="vendor_selection"
                    value="outVendor"
                    className="mr-2"
                    onChange={handleVendorTypeChange} // Handle change
                  />
                  <label htmlFor="vendor">VENDOR</label>
                </div>

                <label className="font-bold block mb-1">
                  {details?.vendor_name}
                </label>
                <select
                  className="w-full border border-gray-300 mt-1 p-1 rounded-md"
                  onChange={handleVendorSelect}
                  value={selectedVendorId}
                >
                  <option value="--select--">--select--</option>
                  {vendorData?.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.vhsname}
                    </option>
                  ))}
                </select>

                {vendorType === "outVendor" ? (
                  <div className="mt-4  border-gray-300 p-3 rounded-md ">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      Manual Update
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {details?.job_complete === "CANCEL" ? (
            <div>Service Cancelled</div>
          ) : (
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <div>Loading...</div> : "Save"}
              </button>
              {userRoles.Cancel ? (
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
              ) : (
                ""
              )}

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => navigate(`/dsrinvoice?id=${details?.id}`)}
              >
                Invoice
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={invoicewhatsbill}
              >
                Bill Whatsapp
              </button>
            </div>
          )}
        </div>
      </div>
      {form.job_complete === "CANCEL" && (
        <div className="mb-4 border border-gray-300 p-3 rounded-md">
          <label className="font-medium text-red-800 block mb-1">
            {details.cancel_reason ? (
              "Service Cancelled"
            ) : (
              <>
                Cancel Reason <span className="text-red-800">*</span>
              </>
            )}
          </label>
          <textarea
            name="cancel_reason"
            value={form.cancel_reason}
            onChange={handleChange}
            placeholder="Please specify the reason for cancellation"
            className=" border bg-white p-1 rounded mt-1 min-h-[32px] w-full"
          />
        </div>
      )}

      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Reschedule Service</h2>
            <label className="block text-sm font-medium mb-1">
              Reschedule Date
            </label>

            <Input
              type="date"
              className="mt-1"
              name="appoDate"
              value={appoDate}
              onChange={(e) => setappoDate(e.target.value)}
            />
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={3}
              placeholder="Enter reason for rescheduling..."
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChaneREschduled}
                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm"
                disabled={isLoading || !rescheduleReason}
              >
                {isLoading ? "Rescheduling..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSRDetails;
