import React, { useState, useEffect } from "react";
import TableReuse from "./TableReuse";
import EnquiryService from "../../services/enquiryService";

const EnquiryNew = () => {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchFilters, setSearchFilters] = useState({});
  const users = JSON.parse(localStorage.getItem("user"));
  const [Totalpages, setTotalpages] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await EnquiryService.getNewEnquiries({
          page,
          limit,
          search: JSON.stringify(searchFilters),
        });
        setData(response.enquiries || []);

        setPage(response.pagination.page);
        setTotalpages(response.pagination.totalPages);
      } catch (err) {
        //   setError("Failed to load enquiries");
        // } finally {
        //   setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, searchFilters]);

  // ✅ Prepare dropdown options safely
  const categoryOptions = Array.isArray(users?.category)
    ? users.category.map((cat) => ({
        label: cat.name,
        value: cat.name,
      }))
    : [];

  const cityOptions = Array.isArray(users?.city)
    ? users.city.map((city) => ({
        label: city.name,
        value: city.name,
      }))
    : [];

  // ✅ Table column definitions
  const columns = [
    { label: "Enquiry ID", accessor: "enquiryId" },
    {
      label: "Category",
      accessor: "category",
      type: "dropdown",
      options: categoryOptions,
    },
    { label: "Date", accessor: "date" },
    { label: "Time", accessor: "time" },
    { label: "Name", accessor: "name" },
    { label: "Contact", accessor: "mobile" },
    { label: "Address", accessor: "address" },
    {
      label: "City",
      accessor: "city",
      type: "dropdown",
      options: cityOptions,
    },
    { label: "Reference", accessor: "reference" },
    { label: "Interested", accessor: "interested" },
    { label: "Executive", accessor: "executive" },
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
          Totalpages={Totalpages}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default EnquiryNew;
