import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "/home",
  isSidebarCollapsed: false,
  isLoading: false, // Loader state
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setActiveTab, toggleSidebar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
