import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableReuse from "./TableReuse";
import EnquiryService from "../../services/enquiryService";

const SurveyCancelled = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchFilters, setSearchFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const users = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loader while fetching
      try {
        const response =
          await EnquiryService.getSurveyDateWiseFollowupsCancelled({
            page,
            limit,
            search: JSON.stringify(searchFilters),
          });

        setData(response.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Hide loader after fetch
      }
    };

    fetchData();
  }, [page, limit, searchFilters]);

  const categoryOptions = Array.isArray(users?.category)
    ? users.category.map((cat) => ({ label: cat.name, value: cat.name }))
    : [];

  const cityOptions = Array.isArray(users?.city)
    ? users.city.map((city) => ({ label: city.name, value: city.name }))
    : [];

  const columns = [
    { label: "EnquiyId", accessor: "enquiryId" },
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
    { label: "Backofficer", accessor: "executive" },
    { label: "Interested For", accessor: "interested_for" },
    { label: "Executive", accessor: "followup_executive_name" },
    { label: "Time", accessor: "followup_appo_time" },
    { label: "Description", accessor: "followup_description" },
    { label: "Comment ", accessor: "interested_for" },
    { label: "Type ", accessor: "Type", type: "status" },
    { label: "Reason for cancel ", accessor: "followup_creason" },
    // { label: "Action", accessor: "cancel", type: "btn" },
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

export default SurveyCancelled;
