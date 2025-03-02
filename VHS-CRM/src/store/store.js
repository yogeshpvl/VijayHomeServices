import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import authReducer from "./authSlice";
import loaderReducer from "./loaderSlice";

import storage from "redux-persist/lib/storage"; // LocalStorage
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedUiReducer = persistReducer(persistConfig, uiReducer);

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: persistedUiReducer,
    loader: loaderReducer,
  },
});

export const persistor = persistStore(store);
export default store;
