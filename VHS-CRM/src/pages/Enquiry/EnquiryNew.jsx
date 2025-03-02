import React, { useState, useEffect } from "react";
import TableReuse from "./TableReuse";
import EnquiryService from "../../services/enquiryService";

const EnquiryNew = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchFilters, setSearchFilters] = useState({});

  console.log("searchFilters", searchFilters);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await EnquiryService.getAllEnquiries({
          page,
          limit,
          search: JSON.stringify(searchFilters),
        });
        setData(response.enquiries || []);
      } catch (err) {
        //   setError("Failed to load enquiries");
        // } finally {
        //   setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, searchFilters]);

  // if (loading) return <p>Loading enquiries...</p>;
  // if (error) return <p>Error: {error}</p>;

  // ✅ Table column definitions
  const columns = [
    { label: "#", accessor: "enquiryId" },
    {
      label: "Category",
      accessor: "category",
      type: "dropdown",
      options: ["Pest Control", "Clothing", "Furniture"],
    },
    { label: "Date & Time", accessor: "date" },
    { label: "Name", accessor: "name" },
    { label: "Contact", accessor: "mobile" },
    { label: "Address", accessor: "address" },
    {
      label: "City",
      accessor: "city",
      type: "dropdown",
      options: ["Bangalore", "Clothing", "Furniture"],
    },
    { label: "Reference", accessor: "reference" },
    { label: "Interested", accessor: "interested" },
    { label: "Executive", accessor: "executive" },
    { label: "Response", accessor: "response" },
    { label: "Description", accessor: "description" },
  ];

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Enquiry List</h2>

      {/* {loading ? (
        <p className="text-center text-gray-600">Loading enquiries...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : ( */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <TableReuse
          data={data}
          columns={columns}
          itemsPerPage={limit}
          onFilterChange={setSearchFilters}
          onPageChange={setPage}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default EnquiryNew;
