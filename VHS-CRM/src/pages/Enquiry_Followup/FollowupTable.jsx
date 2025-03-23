import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableReuse from "./TableReuse";
import EnquiryService from "../../services/enquiryService";

const FollwupTable = () => {
  const { dateType } = useParams(); // e.g., today, confirmed
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchFilters, setSearchFilters] = useState({});
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  const users = JSON.parse(localStorage.getItem("user"));

  const responseType =
    dateType === "confirmed"
      ? "Confirmed"
      : dateType === "not-interested"
      ? "Not Interested"
      : "Call Later";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 🟡 Start loading
      try {
        const response = await EnquiryService.getCallLaterFollowups({
          page,
          limit,
          search: JSON.stringify(searchFilters),
          dateRange: dateType,
          responseType,
        });
        setData(response.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchData();
  }, [page, limit, searchFilters, dateType]);

  const categoryOptions = Array.isArray(users?.category)
    ? users.category.map((cat) => ({ label: cat.name, value: cat.name }))
    : [];

  const cityOptions = Array.isArray(users?.city)
    ? users.city.map((city) => ({ label: city.name, value: city.name }))
    : [];

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
    { label: "Reference1", accessor: "reference1" },
    { label: "Reference2", accessor: "reference2" },
    { label: "Foll Date", accessor: "followup_date" },
    { label: "Staff", accessor: "followup_staff" },
    { label: "Response", accessor: "followup_response" },
    { label: "Description", accessor: "followup_description" },
    { label: "Nxt Date", accessor: "next_followup_date" },
  ];

  return (
    <div className="min-h-screen">
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-800"></div>
          </div>
        ) : (
          <TableReuse
            data={data}
            columns={columns}
            itemsPerPage={limit}
            onFilterChange={setSearchFilters}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default FollwupTable;
