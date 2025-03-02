import React, { useState, useEffect } from "react";
import TableReuse from "./TableReuse";
import EnquiryService from "../../services/enquiryService";

const Today = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EnquiryService.getAllEnquiries({
          page,
          limit,
          search: JSON.stringify(searchFilters),
        });
        setData(response.enquiries || []);
      } catch (err) {}
    };

    fetchData();
  }, [page, limit, searchFilters]);

  // ✅ Table column definitions
  const columns = [
    { label: "#", accessor: "enquiryId" },
    {
      label: "Category",
      accessor: "category",
      type: "dropdown",
      options: ["Pest Control", "Cleaning", "Furniture"],
    },
    { label: "Date & Time", accessor: "date" },
    { label: "Name", accessor: "name" },
    { label: "Contact", accessor: "mobile" },
    { label: "Address", accessor: "address" },
    {
      label: "City",
      accessor: "city",
      type: "dropdown",
      options: ["Bangalore", "Delhi", "Furniture"],
    },
    { label: "Reference", accessor: "reference1" },
    { label: "Interested", accessor: "interested_for" },
    { label: "Executive", accessor: "executive" },
    { label: "Response", accessor: "response" },
    { label: "Description", accessor: "comment" },
  ];

  return (
    <div className="min-h-screen ">
      {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Today Enquies
      </h2> */}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <TableReuse
          data={data}
          columns={columns}
          itemsPerPage={limit}
          onFilterChange={setSearchFilters}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Today;
