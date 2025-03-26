import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function Add() {
  const { state } = useLocation();

  const users = JSON.parse(localStorage.getItem("user"));

  const [customertypedata, setcustomertypedata] = useState([]);
  const [referecetypedata, setreferecetypedata] = useState([]);

  const [form, setForm] = useState({
    customerName: state?.name || "",
    contactPerson: state?.name || "", // Assuming contact person = name
    mainContact: state?.mobile || "",
    alternateContact: "",
    email: state?.email || "",
    gst: "",
    rbhf: "",
    cnap: "",
    lnf: state?.address || "",
    mainArea: "",
    city: state?.city || "",
    pinCode: "",
    customerType: "",
    approach: "",
  });

  const [latestCardNo, setLatestCardNo] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (
      name === "mainContact" ||
      name === "alternateContact" ||
      name === "pinCode"
    ) {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const fetchLastCardNo = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/customers/last-cardno`
      );
      setLatestCardNo((res.data.cardNo || 0) + 1);
    } catch (err) {
      console.error("CardNo fetch error", err);
    }
  };

  const getcustomertype = async () => {
    const response = await fetch(`${config.API_BASE_URL}/customertype`);
    const data = await response.json();
    setcustomertypedata(data);
  };

  const getreferencetype = async () => {
    const response = await fetch(`${config.API_BASE_URL}/reference`);
    const data = await response.json();
    setreferecetypedata(data);
  };

  useEffect(() => {
    getcustomertype();
    getreferencetype();
    fetchLastCardNo();
  }, []);

  const addCustomer = async () => {
    const required = [
      "customerName",
      "contactPerson",
      "mainContact",
      "rbhf",
      "cnap",
      "lnf",
      "city",
    ];

    for (let key of required) {
      if (!form[key]) {
        toast.warning(`Please fill "${key}" field`);
        return;
      }
    }

    // 🧼 Clean up numeric fields
    const cleanForm = {
      ...form,
      mainContact:
        form.mainContact && !isNaN(form.mainContact)
          ? Number(form.mainContact)
          : null,
      alternateContact:
        form.alternateContact && !isNaN(form.alternateContact)
          ? Number(form.alternateContact)
          : null,
      pinCode:
        form.pinCode && !isNaN(form.pinCode) ? Number(form.pinCode) : null,
    };

    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/customers/create`,
        cleanForm
      );

      const customer = res.data?.user || res.data?.customer;

      if (customer?.id) {
        toast.success("Customer created ✅");

        const queryString = new URLSearchParams({
          rowData: JSON.stringify(customer),
        }).toString();

        window.open(
          `/customer/customerDetails/${customer.id}?${queryString}`,
          "_blank"
        );

        setForm({});
        fetchLastCardNo();
      } else {
        toast.error("Customer created but no response data");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error creating customer");
    }
  };

  return (
    <div className="px-4 py-6">
      <form>
        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-4">
            Customer Basic Information
          </h5>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Card No :
              </label>
              <Input
                type="text"
                value={latestCardNo}
                disabled
                className="bg-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Customer Name *
              </label>
              <Input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Contact Person *
              </label>
              <Input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-4">Customer Contact & GST</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <InputField
              label="Main Contact *"
              name="mainContact"
              value={form.mainContact}
              onChange={handleChange}
            />
            <InputField
              label="Alternate Contact"
              name="alternateContact"
              value={form.alternateContact}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <InputField
              label="GSTIN"
              name="gst"
              value={form.gst}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-4">Customer Address</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <InputField
              label="House No *"
              name="rbhf"
              value={form.rbhf}
              onChange={handleChange}
            />
            <TextAreaField
              label="Landmark *"
              name="cnap"
              value={form.cnap}
              onChange={handleChange}
            />
            <TextAreaField
              label="Full Address *"
              name="lnf"
              value={form.lnf}
              onChange={handleChange}
            />
            <InputField
              label="Area"
              name="mainArea"
              value={form.mainArea}
              onChange={handleChange}
            />
            <div>
              <label className="text-sm font-medium text-gray-700">
                City *
              </label>
              <select
                name="city"
                className="w-full border border-gray-300 px-2 py-1 rounded-md"
                value={form.city}
                onChange={handleChange}
              >
                <option value="">--Select City--</option>
                {users?.city?.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              label="Pincode"
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-4">Other Information</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Customer Type *
              </label>
              <select
                name="customerType"
                className="w-full border border-gray-300 px-2 py-1 rounded-md"
                value={form.customerType}
                onChange={handleChange}
              >
                <option value="">--Select Type--</option>
                {customertypedata.map((type) => (
                  <option key={type.customertype} value={type.customertype}>
                    {type.customertype}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Approach
              </label>
              <select
                name="approach"
                className="w-full border border-gray-300 px-2 py-1 rounded-md"
                value={form.approach}
                onChange={handleChange}
              >
                <option value="">--Select Approach--</option>
                {referecetypedata.map((ref) => (
                  <option key={ref.reference} value={ref.reference}>
                    {ref.reference}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={addCustomer}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Input name={name} type={type} value={value} onChange={onChange} />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      rows={3}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 px-2 py-1 rounded-md"
    ></textarea>
  </div>
);

export default Add;
