import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { config } from "../../services/config";
import { toWords } from "number-to-words";

function QuoteView() {
  const location = useLocation();
  const enquiryId = new URLSearchParams(location.search)?.get("id");

  const [quoteData, setQuoteData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [headerImages, setHeaderImages] = useState([]);
  const [footerImages, setFooterImages] = useState([]);
  const [TermsList1, setTermsList1] = useState([]);
  const [TermsList2, setTermsList2] = useState([]);
  const [filtcdata, setfiltcdata] = useState([]);
  const [filsecdata, setsec2data] = useState([]);

  const selectedCategory = "Cleaning";

  useEffect(() => {
    fetchQuoteData();
    fetchHeaderImages();
    fetchBankDetails();
    fetchMaterials();
    fetchTerms1();
    fetchTerms2();
  }, [enquiryId]);

  const fetchQuoteData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/quotation/fetch-with-items?enquiryId=${enquiryId}`
      );
      setQuoteData(response.data.data || []);
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
    if (quoteData.length > 0 && quoteData[0]?.quotationItems?.length) {
      // Step 1: Get unique categories from quotationItems
      const categories = [
        ...new Set(quoteData[0].quotationItems.map((item) => item.category)),
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
  }, [quoteData, TermsList1, TermsList2]);

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

  const fetchMaterials = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/material`);
    setMaterialData(res.data);
  };

  console.log("materialData", materialData);
  const calculateBenefit = (ml) => {
    const match = materialData.find((m) => m.material === ml);
    return match?.benefits || "";
  };

  const gstAmount = quoteData[0]?.gst;
  const adjustmentAmount = quoteData[0]?.adjustment;
  const totalAmount = Number(quoteData[0]?.grand_total);

  const totalAmountInWords = numberToIndianWords(totalAmount);
  console.log(totalAmountInWords); // One Lakh Ten Thousand Only

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

  console.log("quoteData[0]?.quotationItems", quoteData[0]?.quotationItems);
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

      <div className="flex flex-wrap md:flex-nowrap bg-rose-100 p-4 rounded-md text-sm w-full">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2">
          <p className="font-bold">TO</p>
          <p className="font-bold">{quoteData[0]?.enquiry?.name}</p>
          <p>{quoteData[0]?.enquiry?.address}</p>
          <p>{quoteData[0]?.enquiry?.mobile}</p>
          <p>{quoteData[0]?.enquiry?.email}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 ml-auto">
          <p className="font-bold">
            Quote#:{" "}
            <span className="font-normal">{quoteData[0]?.quotation_id}</span>
          </p>
          <p className="font-bold">
            Date:{" "}
            <span className="font-normal">{quoteData[0]?.quotation_date}</span>
          </p>
          <p className="font-bold">
            Project Type:{" "}
            <span className="font-normal">{quoteData[0]?.project_type}</span>
          </p>
          <p className="font-bold">
            Sales Manager:{" "}
            <span className="font-normal">{quoteData[0]?.sales_executive}</span>
          </p>
          <p className="font-bold">
            Contact:{" "}
            <span className="font-normal">{quoteData[0]?.exe_number}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border text-sm">
          <thead className="bg-red-800 text-white text-center">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Scope Of Job</th>
              <th className="border px-2 py-1">Qty/Sqft</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quoteData[0]?.quotationItems.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{item.category}</td>
                <td className="border px-2 py-1 text-left">
                  <p className="font-semibold">{item.region}</p>
                  {item.job.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <div>
                    <b>Note:</b>
                    {item.note}
                  </div>
                  <p className="font-semibold">Benefits:</p>
                  {calculateBenefit(item.material)
                    .split("\n")
                    .map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                </td>
                <td className="border px-2 py-1">{item.qty}</td>
                <td className="border px-2 py-1">{item.rate}</td>
                <td className="border px-2 py-1">{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <span className="font-semibold w-40 text-left">Gst(18%) :</span>
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
            <span className="font-normal">{totalAmountInWords} </span>
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

export default QuoteView;
