import React, { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

function Add() {
  const users = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [customertypedata, setcustomertypedata] = useState([]);
  const [customername, setcustomername] = useState("");
  const [contactperson, setcontactperson] = useState("");
  const [maincontact, setmaincontact] = useState("");
  const [alternatenumber, setalternate] = useState("");
  const [email, setemail] = useState("");
  const [gst, setgst] = useState("");
  const [rbhf, setrbhf] = useState("");
  const [cnap, setcnap] = useState("");
  const [lnf, setlnf] = useState("");
  const [mainarea, setarea] = useState("");
  const [city, setcity] = useState("");
  const [pincode, setpincode] = useState("");
  const [customertype, setcustomertype] = useState("");

  const [approach, setapproach] = useState("");

  const apiURL = config.API_BASE_URL;
  const [referecetypedata, setreferecetypedata] = useState([]);

  const [latestCardNo, setLatestCardNo] = useState([]);

  const handleInputChange = (e) => {
    // Remove any non-numeric characters
    const numericValue = e.target.value.replace(/\D/g, "");

    // Limit the input to 10 characters
    const limitedValue = numericValue.slice(0, 10);

    setmaincontact(limitedValue);
  };

  const addcustomer = async (e) => {
    e.preventDefault();
    if (
      !customername ||
      !contactperson ||
      !maincontact ||
      !lnf ||
      !rbhf ||
      !cnap ||
      !city
    ) {
      alert("Please fill all the fields");
    } else {
      try {
        const config = {
          url: "/addcustomer",
          method: "post",
          baseURL: apiURL,
          headers: { "content-type": "application/json" },
          data: {
            customerName: customername,
            contactPerson: contactperson,

            mainContact: maincontact,
            alternateContact: alternatenumber,
            email: email,
            gst: gst,
            rbhf: rbhf,
            cnap: cnap,
            lnf: lnf,
            mainArea: mainarea,
            city: city,
            pinCode: pincode,
            customerType: customertype,
            approach: approach,
          },
        };
        const response = await axios(config);

        if (response.status === 200) {
          const id = response.data.user;
          const queryString = new URLSearchParams({
            rowData: JSON.stringify(id),
          }).toString();
          const newTab = window.open(
            `/customersearchdetails/${id?._id}?${queryString}`,
            "_blank"
          );
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          alert(error.response.data.error); // Display error message from the API response
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  useEffect(() => {
    getcustomertype();
    getreferencetype();
    getcustomerlastdata();
  }, []);
  const getcustomerlastdata = async () => {
    let res = await axios.get(apiURL + "/getlastcustomer");
    if (res.status === 200) {
      setLatestCardNo(res.data?.customers);
    }
  };

  const getcustomertype = async () => {
    let res = await axios.get(apiURL + "/master/getcustomertype");
    if ((res.status = 200)) {
      setcustomertypedata(res.data?.mastercustomertype);
    }
  };

  const getreferencetype = async () => {
    let res = await axios.get(apiURL + "/master/getreferencetype");
    if ((res.status = 200)) {
      setreferecetypedata(res.data?.masterreference);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className=" mx-auto">
        <div className="bg-white  ">
          <form>
            {/* Customer Basic Information */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold mb-4">
                Customer Basic Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Card No :
                  </label>
                  <div className="mt-1 text-gray-900 font-semibold">
                    {latestCardNo ? latestCardNo[0]?.cardNo + 1 : 1}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <Input onChange={(e) => setcustomername(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <Input onChange={(e) => setcontactperson(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Customer Contact & GST Information */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold mb-4">
                Customer Contact & GST Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Main Contact <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={maincontact}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Alternate Contact
                  </label>
                  <Input
                    type="tel"
                    onChange={(e) => setalternate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    GSTIN Id.
                  </label>
                  <Input onChange={(e) => setgst(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Customer Detail Address */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold mb-4">
                Customer Detail Address
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Room / Bunglow / House / Flat No.{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input onChange={(e) => setrbhf(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Landmark <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setcnap(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setlnf(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Office/Home
                  </label>
                  <Input onChange={(e) => setarea(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setcity(e.target.value)}
                  >
                    <option>-select all-</option>
                    {users?.city?.map((city, index) => (
                      <option value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <Input onChange={(e) => setpincode(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Customer Other Information */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold mb-4">
                Customer Other Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setcustomertype(e.target.value)}
                  >
                    <option>-select-</option>
                    {customertypedata.map((item) => (
                      <option key={item.customertype} value={item.customertype}>
                        {item.customertype}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Approach
                  </label>
                  <select
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setapproach(e.target.value)}
                  >
                    <option>-select all-</option>
                    {referecetypedata.map((item) => (
                      <option
                        key={item.referencetype}
                        value={item.referencetype}
                      >
                        {item.referencetype}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="button" onClick={addcustomer}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;
