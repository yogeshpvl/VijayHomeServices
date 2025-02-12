import React from "react";
import TableReuse from "./TableReuse";

const Today = () => {
  const data = [
    {
      id: 1,
      category: "Pest Control",
      date: "02-08-2025 1:38:34 PM",
      name: "Vedant",
      contact: "9425746962",
      address:
        "Purva Heights Block A, Munivenkatppa Layout, Bilekahalli, Bengaluru, Karnataka 560076",
      city: "Bangalore",
      reference: "Customer Care",
      interested: "Cockroach Pest Control",
      executive: "Pooja",
      response: "Confirmed",
      description: "Kitchen PC",
    },
    {
      id: 2,
      category: "Cleaning",
      date: "02-08-2025 1:30:39 PM",
      name: "Ritu Maheshwari",
      contact: "9741944403",
      address: "0, Kudlu Gate, Bangalore",
      city: "Bangalore",
      reference: "Customer Care",
      interested: "Vacant Flat Cleaning - Premium",
      executive: "Siva N",
      response: "Confirmed",
      description: "Vacant Flat Cleaning - Premium",
    },
    {
      id: 3,
      category: "Cleaning",
      date: "02-08-2025",
      name: "Niks",
      contact: "8511776300",
      address: "T504 Ajmera Avenue, Neeladari Road, Electronic City Phase 1",
      city: "Bangalore",
      reference: "Customer",
      interested: "Fabric Sofa",
      executive: "Jayashree",
      response: "Confirmed",
      description: "Fabric Sofa",
    },
  ];

  const columns = [
    { label: "#", accessor: "id" },
    { label: "Category", accessor: "category", filter: "category" },
    { label: "Date & Time", accessor: "date" },
    { label: "Name", accessor: "name", filter: "name" },
    { label: "Contact", accessor: "contact", filter: "contact" },
    { label: "Address", accessor: "address", filter: "address" },
    { label: "City", accessor: "city", filter: "city" },
    { label: "Reference", accessor: "reference", filter: "reference" },
    { label: "Interested", accessor: "interested", filter: "interested" },
    { label: "Executive", accessor: "executive", filter: "executive" },
    { label: "Response", accessor: "response" },
    { label: "Description", accessor: "description", filter: "description" },
  ];

  return (
    <div className=" min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <TableReuse data={data} columns={columns} itemsPerPage={5} />
      </div>
    </div>
  );
};

export default Today;
