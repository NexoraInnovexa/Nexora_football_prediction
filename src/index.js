import React from "react";
import ReactDOM from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PredictionForm from "./components/App";
import "./index.css";  // ✅ Ensure you have styles (optional)

// ✅ Load Stripe with your public key
const stripePromise = loadStripe("pk_test_your_public_key");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <PredictionForm />
    </Elements>
  </React.StrictMode>
);
