import React from "react";
import ReactDOM from "react-dom/client";
import PredictionForm from "./components/App.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PredictionForm />
  </React.StrictMode>
);
