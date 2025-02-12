import React from "react";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import AppRoutes from "./routes";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/constants.css";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
};

export default App;
