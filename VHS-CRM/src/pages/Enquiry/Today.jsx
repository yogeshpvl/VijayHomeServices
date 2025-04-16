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
  const users = JSON.parse(localStorage.getItem("user"));

  console.log("data", data);

  console.log("searchFilters", searchFilters);
  useEffect(() => {
    const fetchData = async () => {
      console.log("hittomg ");
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
    { label: "#", accessor: "enquiryId" },
    {
      label: "Category",
      accessor: "category",
      type: "dropdown",
      options: categoryOptions,
    },
    { label: "Date & Time", accessor: "date" },
    { label: "Name", accessor: "name" },
    { label: "Contact", accessor: "mobile" },
    { label: "Address", accessor: "address" },
    {
      label: "City",
      accessor: "city",
      type: "dropdown",
      options: cityOptions,
    },
    { label: "Reference", accessor: "reference1" },
    { label: "Interested", accessor: "interested_for" },
    { label: "Executive", accessor: "executive" },
    { label: "Response", accessor: "followup_response" },
    { label: "Description", accessor: "followup_description" },
    { label: "Nxt Date", accessor: "followup_next_date" },
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
