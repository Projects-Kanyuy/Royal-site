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

      const paymentLink = response.data.payment_url;
       const transId = response.data.transaction_id; // Get transaction ID
      console.log("Payment link received:", paymentLink);

      // 2. Open the payment modal in a new window
      const paymentWindow = window.open(
        paymentLink,
        "_blank",
        "width=500,height=600,scrollbars=no,resizable=no"
      );

      // 3. Poll to check if payment window closed
      if (paymentWindow) {
        const checkPayment = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkPayment);

            // Window closed - show appropriate message
            alert(
              "Payment window closed. Your vote will be counted if payment was successful."
            );

            // Don't assume success - the webhook will handle actual vote counting
            // You could trigger a status check here if you want:
            // checkPaymentStatus(transId);
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

  // Optional: Function to check payment status
  const checkPaymentStatus = async (transId) => {
    try {
      const statusResponse = await apiClient.get(
        `/api/payments/status/${transId}`
      );
      if (statusResponse.data.status === "SUCCESSFUL") {
        alert("Payment successful! Thank you for your vote!");
      } else {
        console.log("Payment not completed or still pending");
      }
    } catch (error) {
      console.error("Status check failed:", error);
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
