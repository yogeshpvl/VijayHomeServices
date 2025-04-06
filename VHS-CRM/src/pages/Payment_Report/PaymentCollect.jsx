import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { config } from "../../services/config";
import { toast } from "react-toastify";

const PaymentCollect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paymentDetails, setPaymentDetails] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentComments, setPaymentComments] = useState("");
  const [paymentDate, setPaymentDate] = useState(moment().format("YYYY-MM-DD"));

  const fetchPayments = async () => {
    const res = await axios.get(`${config.API_BASE_URL}/payments/${id}`);

    if (res.status === 200) setPaymentDetails(res.data?.payments);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const addPayment = async () => {
    const res = await axios.post(`${config.API_BASE_URL}/payments`, {
      payment_date: moment(paymentDate).format("DD-MM-YYYY"),
      paymen_type: "Customer",
      payment_mode: paymentMode,
      amount: paymentAmount,
      comment: paymentComments,
      //   customer_id: data[0]?.customerData[0]._id,
      service_id: id,
    });

    if (res.status === 201) {
      toast.success("Payment Added");
      setPaymentAmount("");
      setPaymentMode("");
      setPaymentComments("");
      setPaymentType("");
      fetchPayments();
    }
  };

  const customerPayments = paymentDetails.filter(
    (p) => p.paymen_type === "Customer"
  );

  return (
    <div className="p-4 bg-white mx-auto">
      <h2 className="text-xl font-semibold mb-4">Customer Payment</h2>

      {/* Payment Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-100 border border-gray-300 px-2 py-1 rounded text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-100 border border-gray-300 px-2 py-1 rounded text-sm"
            >
              <option value="Customer">Customer</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block">Amount</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-100 border border-gray-300 px-2 py-1 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-100 border border-gray-300 px-2 py-1 rounded text-sm"
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Paytm">Paytm</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Google Pay">Google Pay</option>
              <option value="NEFT">NEFT</option>
              <option value="IMPS">IMPS</option>
            </select>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium block">Comment</label>
            <textarea
              value={paymentComments}
              onChange={(e) => setPaymentComments(e.target.value)}
              rows={1}
              className="w-100 border border-gray-300 px-2 py-1 rounded text-sm"
            />
          </div>
        </div>
        <button
          onClick={addPayment}
          className="mt-4 bg-gray-800 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Save Payment
        </button>
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
    </div>
  );
};

export default PaymentCollect;
