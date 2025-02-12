import api from "./api";
import { config } from "./config";

const apiService = {
  // ✅ Login User
  login: async (credentials) => {
    try {
      const { data } = await api.post(config.ADMIN_LOGIN, credentials);
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
};

export default apiService;
