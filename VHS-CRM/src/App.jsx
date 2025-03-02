import React from "react";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import AppRoutes from "./routes";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/constants.css";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Loader />
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
};

export default App;
