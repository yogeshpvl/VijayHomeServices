import axios from "axios";
import React, { useEffect, useState } from "react";

function CustomerHistroy({ pastServices, futureServices }) {
  return (
    <div>
      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Previous / Past Service & Complaint Calls Details
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
                  Complaints
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Technician
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Status
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Service Details
                </th>

                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pastServices.map((treat, index) => (
                <tr
                  key={treat.id}
                  className="even:bg-gray-150 hover:bg-blue-50 transition"
                >
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.service_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-2"></td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.vendor_name}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.job_complete}
                  </td>

                  <td className="border border-gray-200 px-3 py-2 text-right">
                    {treat.service_charge}
                  </td>

                  <td className="border border-gray-200 px-3 py-2 space-x-2">
                    <button
                      onClick={() => window.open(`/bill/${treat.id}`, "_blank")}
                      className="text-green-600 hover:underline text-base"
                    >
                      Add Complaint
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow rounded-md p-4 text-sm mt-4 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Next / Future Service Calls Details
        </h2>
        <div className="overflow-auto rounded-md">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  #
                </th>

                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Treatment
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Service Date
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Amount Paid Date
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Service Charges
                </th>
                <th className="border px-3 py-2 font-medium text-left border-gray-200">
                  Tech details
                </th>
              </tr>
            </thead>
            <tbody>
              {futureServices.map((treat, index) => (
                <tr
                  key={treat.id}
                  className="even:bg-gray-150 hover:bg-blue-50 transition"
                >
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.service_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {treat.service_date}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.amt_date}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.service_charge}
                  </td>
                  <td className="border  border-gray-200 px-3 py-2">
                    {treat.vendor_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerHistroy;
