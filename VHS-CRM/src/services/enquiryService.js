import api from "./api";
import store from "../store/store";
import { showLoader, hideLoader } from "../store/loaderSlice";

// ✅ Helper function to handle API requests
const handleRequest = async (requestFn) => {
  try {
    store.dispatch(showLoader()); // Show Loader before request
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  } finally {
    store.dispatch(hideLoader()); // Hide Loader after request
  }
};

const EnquiryService = {
  // ✅ Fetch all enquiries
  getAllEnquiries: ({
    page = 1,
    limit = 25,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  }) =>
    handleRequest(() =>
      api.get(`/enquiries/today`, {
        params: { page, limit, search, sortBy, sortOrder },
      })
    ),

  // ✅ Fetch a single enquiry by ID
  getEnquiryById: (id) => handleRequest(() => api.get(`/enquiries/${id}`)),

  // ✅ Create a new enquiry
  createEnquiry: (enquiryData) =>
    handleRequest(() => api.post("/enquiries/create", enquiryData)),

  // ✅ Update an existing enquiry
  updateEnquiry: (id, enquiryData) =>
    handleRequest(() => api.put(`/enquiries/${id}`, enquiryData)),

  // ✅ Delete an enquiry
  deleteEnquiry: (id) => handleRequest(() => api.delete(`/enquiries/${id}`)),

  // ✅ Search Enquiries with Filters (Fixed)
  searchEnquiry: (filters) =>
    handleRequest(() => api.get(`/enquiries/search`, { params: filters })),
};

export default EnquiryService;
