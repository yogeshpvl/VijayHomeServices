import React, { useState, useEffect } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import { toWords } from "number-to-words";
import { config } from "../../services/config";

function Bill() {
  const [tcdata, settcdata] = useState([]);
  const [headerimgdata, setHeaderImages] = useState([]);
  const [footerimgdata, setFooterImages] = useState([]);
  const [bankdata, setBankData] = useState([]);
  const location = useLocation();
  const getURLDATA = new URLSearchParams(location.search)?.get("id");
  const [treatmentData, settreatmentData] = useState({});

  useEffect(() => {
    fetchTerms1();
  }, [getURLDATA]);

  const fetchTerms1 = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/termsandcondtionssection1`
      );
      const data = await res.json();

      console.log("data", data);
      settcdata(
        Array.isArray(data) ? data.filter((i) => i.type === "INVOICE") : []
      );
    } catch (err) {
      console.error("Failed to fetch terms:", err);
    }
  };

  useEffect(() => {
    fetchHeaderImages;
    fetchBankDetails();
  }, []);

  const fetchHeaderImages = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/quotation-header-footer?type=header&category=${selectedCategory}`
      );
      const data = response.data;
      setHeaderImages(data.filter((item) => item.type === "header"));
      setFooterImages(data.filter((item) => item.type === "footer"));
    } catch (error) {
      console.error("Failed to fetch header/footer images", error);
    }
  };

  const fetchBankDetails = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/bank-details`);
    setBankData(res.data);
  };

  const getServiceData = async () => {
    try {
      let res = await axios.get(
        `${config.API_BASE_URL}/bookings/${getURLDATA}`
      );
      if (res.status === 200) {
        console.log("settreatmentData", res.data);
        settreatmentData(res.data);
      } else {
        settreatmentData([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getServiceData();
  }, [getURLDATA]);

  const convertingAmount = Number(treatmentData?.service_charge);

  let netTotalInWords = "";

  if (typeof convertingAmount === "number" && isFinite(convertingAmount)) {
    netTotalInWords = toWords(convertingAmount).replace(/,/g, ""); // Remove commas
  }

  const a = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const inWords = (num) => {
    if ((num = num.toString()).length > 9) return "overflow";
    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    let str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
        : "";
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
        : "";
    str +=
      n[5] != 0
        ? (str != "" ? "and " : "") +
          (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
          "only "
        : "";

    return str;
  };

  console.log("treatmentData", treatmentData);
  const [words, setWords] = useState("");
  useEffect(() => {
    setWords(inWords(Number(treatmentData?.service_charge)));
  }, [treatmentData]);

  return (
    <div>
      <div className="row justify-center mt-3">
        <div className="col-md-12">
          <div
            className="card shadow bg-white rounded"
            style={{ border: "none" }}
          >
            <div className="flex justify-between">
              <div className="ml-2 flex">
                <img
                  src="https://vijayahomeservices.b-cdn.net/Vijay%20Home%20Service%20Logo.jpeg"
                  className="w-24 h-24"
                />
                <h6
                  className="nameinvoice text-lg"
                  style={{ fontSize: "30px", color: "darkred" }}
                >
                  VIJAY HOME SERVICES
                </h6>
              </div>
              <div className="p-1">
                <h2>GST INVOICE</h2>
                <p>Original For Recipient</p>
                <p>
                  <b>
                    Invoice No: VHS-000{treatmentData?.id} <br />
                    Date :
                  </b>{" "}
                  {treatmentData?.service_date}
                </p>
              </div>
            </div>

            <div className=" p-6 rounded-lg">
              <div className="flex gap-2 mt-2">
                <div className="w-1/2 p-2 bg-red-50 rounded-lg">
                  <div className="font-bold text-lg">BILLED BY</div>
                  <div className="font-bold">Vijay Home Services</div>
                  <p>
                    #1/1, 2nd Floor, Shamraj building MN Krishnarao Road
                    Mahadevapura Outer Ring Road, Banglore 560048
                  </p>
                  <p>GSTN : 29EIXPK0545M1ZE</p>
                </div>
                <div className="w-1/2 p-2 bg-red-50 rounded-lg">
                  <div className="font-bold text-lg">BILLED TO</div>
                  <h5>{treatmentData?.customer?.customerName}</h5>
                  <p>
                    {treatmentData?.delivery_address?.platno},{" "}
                    {treatmentData?.delivery_address?.address},{" "}
                    {treatmentData?.delivery_address?.landmark}
                  </p>
                  <p>{treatmentData?.customer?.mainContact}</p>
                </div>
              </div>

              <div className="row m-auto mt-2 w-full">
                <div className="col-md-12">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-red-700 text-white">
                        <th className="text-center border px-4 py-2">S.No</th>
                        <th className="text-center border px-4 py-2">
                          Category
                        </th>
                        <th className="text-center border px-4 py-2">
                          Description
                        </th>
                        <th className="text-center border px-4 py-2">
                          Contract
                        </th>
                        <th className="text-center border px-4 py-2">
                          Service Date
                        </th>
                        <th className="text-center border px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center border px-4 py-2">{1}</td>
                        <td className="text-center border px-4 py-2">
                          {treatmentData.category}
                        </td>
                        <td className="text-center border px-4 py-2">
                          {treatmentData.description}
                        </td>
                        <td className="text-center border px-4 py-2">
                          {treatmentData?.contract_type}
                        </td>
                        <td className="text-center border px-4 py-2">
                          {treatmentData?.start_date}
                        </td>
                        <td className="text-center border px-4 py-2">
                          {treatmentData?.service_charge}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="w-1/2 pl-6">
                <div className="font-bold">BANK DETAILS</div>
                {bankdata.map((item, index) => (
                  <div key={index} className="text-sm leading-6">
                    <p>
                      <span className="font-semibold">Account Name:</span>{" "}
                      {item.account_holder_name}
                    </p>
                    <p>
                      <span className="font-semibold">Account Number:</span>{" "}
                      {item.account_number}
                    </p>
                    <p>
                      <span className="font-semibold">IFSC:</span>{" "}
                      {item.ifsc_code}
                    </p>
                    <p>
                      <span className="font-semibold">Bank Name:</span>{" "}
                      {item.bank_name}
                    </p>
                    <p>
                      <span className="font-semibold">Branch:</span>{" "}
                      {item.branch_name}
                    </p>
                    <p className="mt-2 font-semibold">GPay / PhonePe:</p>
                    <p>{item.upi_number}</p>
                  </div>
                ))}
              </div>
              <div className="w-1/2 pr-6">
                <div className="mt-4 text-right">
                  <h6>
                    GST(5%):{" "}
                    {(
                      treatmentData?.service_charge -
                      (treatmentData?.service_charge / 105) * 100
                    ).toFixed(2)}
                  </h6>
                  <h5>Total: {treatmentData?.service_charge}</h5>
                  <h5>
                    Amount In Words:{" "}
                    <span className="font-normal">{words}</span>
                  </h5>
                </div>
              </div>
            </div>

            {tcdata?.map((item) => (
              <div key={item.header} className="p-5">
                <div className="row m-auto mt-3 bg-red-700 text-white font-bold justify-center text-align-center p-2">
                  {item.header}
                </div>
                <table className="table table-bordered border-danger">
                  <tbody>
                    <tr>
                      <td scope="row">
                        <div className="form-check mt-2">
                          <div
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div>
            <div className="col-md-12">
              <img
                src="https://vijayahomeservices.b-cdn.net/1742647567365-1709106419817_footer.jpg"
                height="auto"
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bill;
