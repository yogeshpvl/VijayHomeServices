import React, { useEffect, useState } from "react";
import { config } from "../../services/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Painting() {
  const [searchParams] = useSearchParams();

  const service_id = searchParams.get("service_id");
  const enquiryId = searchParams.get("enquiry_id");

  const [quoteData, setQuoteData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [ManPowerData, setManPowerData] = useState([]);
  const [materialData, setmaterialData] = useState([]);
  const [WorkDetaildata, setWorkDetaildata] = useState([]);

  //   const enquiryId = 47;
  //   const service_id = 47;
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuoteData();
    fetchPayments();
    fetchManpower();
    fetchMaterials();
    fetchWorkDetails();
  }, []);

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

  const fetchPayments = async () => {
    const res = await axios.get(
      `${config.API_BASE_URL}/payments/${service_id}`
    );
    if (res.status === 200) setPaymentDetails(res.data?.payments);
  };

  const fetchManpower = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/manpower?service_id=${service_id}`
      );
      console.log("res", res);

      if (res.status === 200) setManPowerData(res.data);
    } catch (error) {
      console.error("Error fetching manpower data:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/rmaterial?service_id=${service_id}`
      );
      console.log("res", res);

      if (res.status === 200) setmaterialData(res.data);
    } catch (error) {
      console.error("Error fetching materials data:", error);
    }
  };

  const fetchWorkDetails = async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/work-materials?service_id=${service_id}`
      );
      console.log("res", res);
      if (res.status === 200) setWorkDetaildata(res.data);
    } catch (error) {
      console.error("Error fetching work details:", error);
    }
  };

  const customerPayments = paymentDetails?.filter(
    (p) => p.paymen_type === "Customer"
  );
  const vendorPayments = paymentDetails?.filter(
    (p) => p.paymen_type === "Vendor"
  );

  return (
    <div className="p-4 bg-white">
      <div className="flex gap-4 mb-4">
        <button
          className="px-2 py-1 rounded bg-red-600 text-white cursor-pointer"
          onClick={() =>
            navigate(
              `/Painting?service_id=${service_id}&enquiry_id=${enquiryId}`
            )
          }
        >
          Painting
        </button>
        <button
          className="px-2 py-1 rounded bg-gray-200 text-gray-800 cursor-pointer"
          onClick={() =>
            navigate(
              `/Payments?service_id=${service_id}&enquiry_id=${enquiryId}`
            )
          }
        >
          Payments
        </button>
      </div>

      <h2 className="text-base font-semibold mb-2">
        Customer Painting Details &gt; {quoteData[0]?.enquiry?.name}
      </h2>

      <h3 className="text-lg font-semibold mb-4">Quote Details</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-200 px-3 py-2">#</th>
              <th className="border border-gray-200 px-3 py-2">Region</th>
              <th className="border border-gray-200 px-3 py-2">Material</th>
              <th className="border border-gray-200 px-3 py-2">Job</th>
              <th className="border border-gray-200 px-3 py-2">Qty</th>
              <th className="border border-gray-200 px-3 py-2">Rate</th>
              <th className="border border-gray-200 px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quoteData[0]?.quotationItems?.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-3 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.region}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.material}
                </td>
                <td className="border border-gray-200 px-3 py-2">{item.job}</td>
                <td className="border border-gray-200 px-3 py-2">{item.qty}</td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.rate}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {item.subtotal}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={6} className="border border-gray-200 px-3 py-2">
                TOTAL
              </td>
              <td className="border border-gray-200 px-3 py-2">
                {quoteData[0]?.total_amount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-between items-start gap-4">
        <div>
          <p>
            <strong>Project Type:</strong> {quoteData[0]?.project_type}
          </p>
          <p>
            <strong>Sales Manager:</strong> {quoteData[0]?.sales_executive}
          </p>
        </div>
        <div className="border border-gray-300 text-sm w-64">
          <div className="flex justify-between px-4 py-2 border-b">
            <span>GST (5%)</span>
            <span>{quoteData[0]?.gst}</span>
          </div>
          <div className="flex justify-between px-4 py-2 border-b">
            <span>Total</span>
            <span>{quoteData[0]?.total_amount}</span>
          </div>
          <div className="flex justify-between px-4 py-2 border-b">
            <span>Adjustments</span>
            <span>{quoteData[0]?.adjustment}</span>
          </div>
          <div className="flex justify-between px-4 py-2 font-bold bg-gray-100">
            <span>NET TOTAL</span>
            <span>
              {(
                parseFloat(quoteData[0]?.total_amount || 0) -
                parseFloat(quoteData[0]?.adjustment || 0)
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      {/* Customer Payment Table */}
      <h3 className="font-semibold text-base mb-2">Customer Payments</h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Mode</th>
              <th className="px-3 py-2 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {customerPayments.map((p, i) => (
              <tr
                key={i}
                className="border-b transition cursor-pointer bg-white hover:bg-gray-100"
              >
                <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.payment_date}
                </td>
                <td className="border border-gray-200 px-3 py-2">{p.amount}</td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.payment_mode}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Payment Table */}
      <h3 className="font-semibold text-base mb-2">Vendor Payments</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Mode</th>
              <th className="px-3 py-2 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {vendorPayments.map((p, i) => (
              <tr
                key={i}
                className="border-b transition cursor-pointer bg-white hover:bg-gray-100"
              >
                <td className="border border-gray-200 px-3 py-2">{i + 1}</td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.payment_date}
                </td>
                <td className="border border-gray-200 px-3 py-2">{p.amount}</td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.payment_mode}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {p.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Material Details */}
      <h3 className="font-semibold text-base my-4">Materials Details</h3>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Date</th>
            <th className="p-2">Material</th>
            <th className="p-2">Work Details</th>
            <th className="p-2">Remark</th>
          </tr>
        </thead>
        <tbody>
          {materialData.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-3 py-2">{index + 1}</td>
              <td className="border border-gray-200 px-3 py-2">
                {item.work_date}
              </td>
              <td className="border border-gray-200 px-3 py-2">
                {item.work_material_use}
              </td>
              <td className="border border-gray-200 px-3 py-2">
                {item.work_details}
              </td>
              <td className="border border-gray-200 px-3 py-2">
                {item.work_remark}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Work Details */}
      <h3 className="font-semibold text-base my-4">Work Details</h3>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Date</th>
            {/* <th className="p-2">Material</th> */}
            <th className="p-2"> Material Description</th>
          </tr>
        </thead>
        <tbody>
          {WorkDetaildata.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-3 py-2">{index + 1}</td>
              <td className="border border-gray-200 px-3 py-2">
                {item.materialdate}
              </td>
              {/* <td className="border border-gray-200 px-3 py-2">{item.material}</td> */}
              <td className="border border-gray-200 px-3 py-2">
                {item.materialdesc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Man Power */}
      <h3 className="font-semibold text-base my-4">Man Power</h3>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {ManPowerData.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-3 py-2">{index + 1}</td>
              <td className="border border-gray-200 px-3 py-2">
                {item.mandate}
              </td>
              <td className="border border-gray-200 px-3 py-2">
                {item.mandesc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Painting;
