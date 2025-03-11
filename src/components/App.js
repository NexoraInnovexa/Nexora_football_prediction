import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// ✅ Replace with your actual Stripe public key
const stripePromise = loadStripe("pk_test_your_public_key");

const PredictionForm = () => {
  const [email, setEmail] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Handle Payment & Prediction Flow
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setError("");
    setLoading(true);

    try {
      // ✅ Step 1: Get Stripe Payment Method
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // ✅ Step 2: Process Payment
      const paymentResponse = await axios.post("http://localhost:5000/payment", {
        email,
        payment_method_id: paymentMethod.id
      });

      if (!paymentResponse.data.success) {
        setError("Payment failed. Try again.");
        setLoading(false);
        return;
      }

      // ✅ Step 3: Get AI Prediction After Payment Success
      handlePrediction();
    } catch (err) {
      setError("Payment failed. Try again.");
      setLoading(false);
    }
  };

  // ✅ Fetch AI Prediction
  const handlePrediction = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        email,
        home_team: homeTeam,
        away_team: awayTeam
      });

      setPrediction(response.data);
      setLoading(false);
    } catch (err) {
      setError("Prediction failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-center mb-4">AI Football Prediction</h1>

      <input 
        type="email" placeholder="Your Email" className="w-full p-2 border mb-2"
        value={email} onChange={(e) => setEmail(e.target.value)} 
      />

      <input 
        type="text" placeholder="Home Team" className="w-full p-2 border mb-2"
        value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} 
      />

      <input 
        type="text" placeholder="Away Team" className="w-full p-2 border mb-2"
        value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} 
      />

      <Elements stripe={stripePromise}>
        <CardElement className="p-2 border mb-4" />
        <button 
          onClick={handlePayment} 
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay $4 & Get Prediction"}
        </button>
      </Elements>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {prediction && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Prediction Result:</h2>
          <p><strong>{prediction.home_team}</strong> vs <strong>{prediction.away_team}</strong></p>
          <p>Predicted Score: <strong>{prediction.predicted_score}</strong></p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
