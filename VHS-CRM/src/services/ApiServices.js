import axios from "axios";
import api from "./api";
import { config } from "./config";

const apiService = {
  // ✅ Login User
  login: async (credentials) => {
    try {
      const { data } = await api.post(config.ADMIN_LOGIN, credentials);
      console.log("datadata", data);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Fetch User Profile
  fetchUserData: async () => {
    try {
      const { data } = await api.get(config.ADMIN_PROFILE);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Logout User
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
  //last enquiryId dataa
  fetchENQUIRYID: async () => {
    try {
      const { data } = await axios.get(
        `${config.API_BASE_URL}${config.LAST_ENQUIRY_ID}`
      );
      console.log("Fetched Enquiry ID Data:", data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  //city dataa
  fetchcitiesData: async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}${config.CITY}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  //Categoories dataa
  fetchcategooriesData: async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}${config.CITY}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  //reponse

  fetchResponseData: async () => {
    try {
      const { data } = await axios.get(
        `${config.API_BASE_URL}${config.FETCH_REPONSE}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
