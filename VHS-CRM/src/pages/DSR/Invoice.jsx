import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { config } from "../../services/config";
import { toWords } from "number-to-words";

function invoice() {
  const location = useLocation();
  const booking_id = new URLSearchParams(location.search)?.get("id");

  const [serviceData, setserviceData] = useState([]);
  const [bankData, setBankData] = useState([]);

  const [headerImages, setHeaderImages] = useState([]);
  const [footerImages, setFooterImages] = useState([]);
  const [TermsList1, setTermsList1] = useState([]);
  const [TermsList2, setTermsList2] = useState([]);
  const [filtcdata, setfiltcdata] = useState([]);
  const [filsecdata, setsec2data] = useState([]);

  console.log("serviceData", serviceData);

  const selectedCategory = "Cleaning";

  useEffect(() => {
    fetchserviceData();
    fetchHeaderImages();
    fetchBankDetails();

    fetchTerms1();
    fetchTerms2();
  }, [booking_id]);

  const fetchserviceData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/bookingService/booking/${booking_id}`
      );
      setserviceData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch quote data", error);
    }
  };

  const fetchTerms1 = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/termsandcondtionssection1`
      );
      const data = await res.json();
      setTermsList1(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch terms:", err);
    }
  };

  const fetchTerms2 = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/termsandcondtionssection2`
      );
      const data = await res.json();
      setTermsList2(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch terms:", err);
    }
  };

  useEffect(() => {
    if (serviceData.length > 0 && serviceData[0]?.quotationItems?.length) {
      // Step 1: Get unique categories from quotationItems
      const categories = [
        ...new Set(serviceData[0].quotationItems.map((item) => item.category)),
      ];

      // Step 2: Filter both terms lists based on these categories
      const filteredTerms1 = TermsList1.filter((item) =>
        categories.includes(item.category)
      );

      const filteredTerms2 = TermsList2.filter((item) =>
        categories.includes(item.category)
      );

      // Step 3: Set the filtered data
      setfiltcdata(filteredTerms1);
      setsec2data(filteredTerms2);
    }
  }, [serviceData, TermsList1, TermsList2]);

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

  const calculateBenefit = (ml) => {
    const match = materialData.find((m) => m.material === ml);
    return match?.benefits || "";
  };

  const gstAmount = serviceData[0]?.gst;

  const totalAmount = Number(serviceData[0]?.service_charge);

  const totalAmountInWords = numberToIndianWords(totalAmount);

  function numberToIndianWords(num) {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if ((num = num.toString()).length > 9) return "Overflow";
    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    let str = "";
    str +=
      Number(n[1]) !== 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
        : "";
    str +=
      Number(n[2]) !== 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
        : "";
    str +=
      Number(n[3]) !== 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
        : "";
    str +=
      Number(n[4]) !== 0
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
        : "";
    str +=
      Number(n[5]) !== 0
        ? "and " + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) + " "
        : "";
    return str.trim() + " Only";
  }

  return (
    <div className="p-4">
      {headerImages.map((item, idx) => (
        <img
          key={idx}
          src={item.image_url}
          alt="Header"
          className="w-full h-52 "
        />
      ))}

      <h2 className="text-center text-2xl font-bold my-4">QUOTATION</h2>

      <div className=" col-12 mt-2 " style={{ display: "flex", gap: "10px" }}>
        <div className="col-6 b-col">
          <div className="" style={{ fontWeight: "bold" }}>
            BILLED BY
          </div>
          <div className="" style={{ fontWeight: "bold" }}>
            Vijay Home Services
          </div>
          <p>
            #1/1, 2nd Floor, Shamraj building MN Krishnarao Road Mahadevapura
            Outer Ring Road, Banglore 560048
          </p>
          <p>GSTN : 29EIXPK0545M1ZE</p>
        </div>
        <div className="col-6 b-col">
          <div className="" style={{ fontWeight: "bold" }}>
            BILLED TO
          </div>

          <h5>
            {treatmentData.customerData &&
            Array.isArray(treatmentData.customerData) &&
            treatmentData.customerData.length !== 0
              ? treatmentData.customerData[0].customerName
              : ""}
          </h5>

          <p className="mb-0">
            {treatmentData?.deliveryAddress?.platNo},
            {treatmentData?.deliveryAddress?.address}
            {treatmentData?.deliveryAddress?.landmark}
          </p>
          <p className="mb-0">
            {/* {treatmentData.customerData[0].mainContact} */}
            {treatmentData.customerData &&
            Array.isArray(treatmentData.customerData) &&
            treatmentData.customerData.length !== 0
              ? treatmentData.customerData[0].mainContact
              : ""}
          </p>
        </div>
      </div>

      <div className="row m-auto mt-2 w-100">
        <div className="col-md-12">
          <table class="">
            <thead>
              <tr className="hclr">
                <th className="text-center">S.No</th>
                <th className="text-center">Category</th>
                <th className="text-center">Description</th>
                <th className="text-center">Contract</th>
                <th className="text-center">Service Date</th>
                {/* <th className="text-center">Amount Paid Date</th> */}

                <th className="text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  scope="row"
                  className="text-center "
                  style={{ border: "1px solid grey" }}
                >
                  {i++}
                </td>
                <td
                  scope="row"
                  className="text-center"
                  style={{ border: "1px solid grey" }}
                >
                  {treatmentData.category}
                </td>
                <td
                  scope="row"
                  className="text-center "
                  style={{ border: "1px solid grey" }}
                >
                  {treatmentData.desc}
                </td>

                <td
                  className="text-center"
                  style={{ border: "1px solid grey" }}
                >
                  {treatmentData?.contractType}
                </td>
                {treatmentData?.contractType === "AMC" ? (
                  <td
                    className="text-center"
                    style={{ border: "1px solid grey" }}
                  >
                    <div>
                      <p className="text-center">{/* {data1} */}</p>
                    </div>
                  </td>
                ) : (
                  <td
                    className="text-center"
                    style={{ border: "1px solid grey" }}
                  >
                    {treatmentData?.dateofService}
                  </td>
                )}

                {treatmentData?.contractType === "AMC" ? (
                  <td
                    className="text-center"
                    style={{ border: "1px solid grey" }}
                  >
                    {treatmentData?.dividedamtCharges?.map((item) => (
                      <div>
                        <p className="text-end">
                          {((item?.charge / 105) * 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </td>
                ) : (
                  <td
                    className="text-center"
                    style={{ border: "1px solid grey" }}
                  >
                    {((treatmentData?.GrandTotal / 105) * 100).toFixed(2)}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between px-6 py-4">
        {/* Left Column: Bank Details */}
        <div className="w-1/2">
          <h2 className="font-bold text-lg mb-2">Bank Details</h2>
          {bankData.map((item, index) => (
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
                <span className="font-semibold">IFSC:</span> {item.ifsc_code}
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

        {/* Right Column: Totals */}
        <div className="w-1/2 text-right space-y-1">
          <div className="flex justify-end">
            <span className="font-semibold w-40 text-left">Gst(5%) :</span>
            <span className="w-24">{gstAmount}</span>
          </div>
          <div className="flex justify-end">
            <span className="font-semibold w-40 text-left">Adjustment :</span>
            <span className="w-24">{adjustmentAmount}</span>
          </div>
          <div className="flex justify-end text-xl font-bold mt-2">
            <span className="w-40 text-left">Total :</span>
            <span className="w-24">{totalAmount}</span>
          </div>
          <div className="pt-4 font-semibold">
            In Words :{" "}
            <span className="font-normal">{totalAmountInWords} Only</span>
          </div>
        </div>
      </div>
      {/* Terms & Conditions Section 1 */}
      {filtcdata.map((item, index) => (
        <div key={`section1-${index}`} className="my-4">
          <div className="bg-red-900 text-white font-bold text-center py-2 rounded">
            {item.header}
          </div>
          <table className="table-auto w-full border border-red-500 mt-2">
            <tbody>
              <tr>
                <td className="border border-red-500 p-4">
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Terms & Conditions Section 2 */}
      {filsecdata.map((item, index) => (
        <div key={`section2-${index}`} className="my-4">
          <div className="bg-red-900 text-white font-bold text-center py-2 rounded">
            {item.header}
          </div>
          <table className="table-auto w-full border border-red-500 mt-2">
            <tbody>
              <tr>
                <td className="border border-red-500 p-4">
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {footerImages.map((item, idx) => (
        <div key={idx} className="mt-6">
          <img src={item.image_url} alt="Footer" className="w-full" />
        </div>
      ))}
    </div>
  );
}

export default invoice;
