import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "leaflet/dist/leaflet.css";
import AuthRefresh from "./pages/Auth/components/AuthRefresh/AuthRefresh";
import NotificationSync from "./shared/components/NotificationSync/NotificationSync";
import SavedTripsProvider from "./context/SavedTripsProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SavedTripsProvider>
        <AuthRefresh />
        <NotificationSync />
        <RouterProvider router={router} />
      </SavedTripsProvider>
    </Provider>
  </StrictMode>,
);
