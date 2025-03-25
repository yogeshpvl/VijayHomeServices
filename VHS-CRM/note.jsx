{
  /* Past Services */
}
<div className="bg-white shadow rounded-md p-4 text-sm mt-4 border-2 border-gray-100">
  <h2 className="text-base font-semibold mb-3">Previous / Past Services</h2>
  <table className="w-full border text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-2 py-1">Date</th>
        <th className="border px-2 py-1">Category</th>
        <th className="border px-2 py-1">Complaint</th>
        <th className="border px-2 py-1">Technician</th>
        <th className="border px-2 py-1">Status</th>
      </tr>
    </thead>
    <tbody>
      {pastServices.map((srv, idx) => (
        <tr key={idx}>
          <td className="border px-2 py-1">{srv.date}</td>
          <td className="border px-2 py-1">{srv.jobCategory}</td>
          <td className="border px-2 py-1">{srv.complaint}</td>
          <td className="border px-2 py-1">{srv.technician}</td>
          <td className="border px-2 py-1">{srv.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;

{
  /* Future Services */
}
<div className="bg-white shadow rounded-md p-4 text-sm mt-4 border-2 border-gray-100">
  <h2 className="text-base font-semibold mb-3">Next / Future Service Calls</h2>
  <table className="w-full border text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-2 py-1">Treatment</th>
        <th className="border px-2 py-1">Service Date</th>
        <th className="border px-2 py-1">Amount Paid Date</th>
        <th className="border px-2 py-1">Service Charges</th>
        <th className="border px-2 py-1">Technician</th>
      </tr>
    </thead>
    <tbody>
      {futureServices.map((item, idx) => (
        <tr key={idx}>
          <td className="border px-2 py-1">{item.treatment}</td>
          <td className="border px-2 py-1">{item.serviceDate}</td>
          <td className="border px-2 py-1">{item.amountPaidDate}</td>
          <td className="border px-2 py-1">{item.serviceCharges}</td>
          <td className="border px-2 py-1">{item.technician}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;
