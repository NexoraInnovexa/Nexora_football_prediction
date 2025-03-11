import React, { useState, useEffect } from "react";
import axios from "axios";

// Replace with your actual Flutterwave public key
const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK_TEST-72ca1dd35e632a21db39f59869e5dac2-X"; // Use your actual public key

const PredictionForm = () => {
  const [email, setEmail] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically load the Flutterwave Checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => {
      console.log("Flutterwave script loaded successfully");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Flutterwave Payment and Prediction Flow
  const handlePayment = async () => {
    if (!email || !homeTeam || !awayTeam) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    if (window.FlutterwaveCheckout) {
      // Flutterwave payment initialization
      window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: "TX-" + Date.now(),
        amount: 4,
        currency: "USD",
        payment_options: "card, ussd, banktransfer",
        customer: {
          email: email,
        },
        callback: async (paymentResponse) => {
          if (paymentResponse.status === "successful") {
            // After payment success, request prediction
            handlePrediction();
          } else {
            setError("⚠️ Payment failed! Try again.");
            setLoading(false);
          }
        },
        onclose: function () {
          setLoading(false);
        },
      });
    } else {
      setError("⚠️ Flutterwave script is not loaded. Try again.");
      setLoading(false);
    }
  };

  // Fetch AI Prediction
  const handlePrediction = async () => {
    try {
      const response = await axios.post("https://nexora-football-backend.onrender.com/predict", {
        email,
        home_team: homeTeam,
        away_team: awayTeam,
      });

      setPrediction(response.data);
      setLoading(false);
    } catch (err) {
      setError("⚠️ Prediction failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-center mb-4">AI Football Prediction</h1>

      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-2 border mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Home Team"
        className="w-full p-2 border mb-2"
        value={homeTeam}
        onChange={(e) => setHomeTeam(e.target.value)}
      />

      <input
        type="text"
        placeholder="Away Team"
        className="w-full p-2 border mb-2"
        value={awayTeam}
        onChange={(e) => setAwayTeam(e.target.value)}
      />

      <button
        onClick={handlePayment}
        className="w-full p-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay $4 & Get Prediction"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {prediction && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Prediction Result:</h2>
          <p>
            <strong>{prediction.home_team}</strong> vs <strong>{prediction.away_team}</strong>
          </p>
          <p>Predicted Score: <strong>{prediction.predicted_score}</strong></p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;

