import React from "react";
import ReactDOM from "react-dom/client";
import PredictionForm from "./components/App";  // Corrected import path to reflect your file structure
import "./index.css";  // ✅ Ensure you have styles (optional)

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PredictionForm />
  </React.StrictMode>
);
