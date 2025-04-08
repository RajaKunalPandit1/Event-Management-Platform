import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import WrappedApp from "./App.jsx"; // Import WrappedApp
// import App from "./App.jsx";
import { AuthProvider } from "./auth_context.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WrappedApp />
  </BrowserRouter> 
);