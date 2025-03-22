import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// ✅ Function to safely get user data
const getUserFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // Ensure valid JSON
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// ✅ Function to check token validity
const isTokenValid = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Valid token check
  } catch (error) {
    return false;
  }
};

const initialState = {
  isAuthenticated: isTokenValid(),
  user: getUserFromLocalStorage(),
  token: isTokenValid() ? localStorage.getItem("authToken") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
