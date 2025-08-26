// src/components/CamPayButton.js
import React, { useState } from "react";
import apiClient from "../api/axios";

const CamPayButton = ({ artist, amount, onPaymentSuccess, onPaymentFail }) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);

    try {
      console.log(
        `Creating payment for artist: ${artist._id} with amount: ${amount}`
      );

      // 1. Call YOUR backend to create the payment link
      const response = await apiClient.post("/api/payments/create", {
        artistId: artist._id,
        amount: amount,
      });

      const paymentLink = response.data.paymentUrl;
      console.log("Payment link received:", paymentLink);

      // 2. Open the Campay modal in a new window
      const campayWindow = window.open(
        paymentLink,
        "_blank",
        "width=500,height=600,scrollbars=no,resizable=no"
      );

      // 3. Optional: Poll to check if payment was completed
      if (campayWindow) {
        const checkPayment = setInterval(() => {
          if (campayWindow.closed) {
            clearInterval(checkPayment);
            // When modal closes, you can trigger a refresh or success message
            if (onPaymentSuccess) {
              onPaymentSuccess({ message: "Payment completed successfully!" });
            }
            alert(
              "Thank you for your vote! The artist has received your support."
            );
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to initialize payment. Please try again."
      );
      if (onPaymentFail) onPaymentFail(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVoteClick}
      disabled={loading}
      className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 transition-all disabled:opacity-50"
    >
      {loading ? "PROCESSING..." : "VOTE NOW"}
    </button>
  );
};

export default CamPayButton;
