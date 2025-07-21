// src/components/CamPayButton.js
import React, { useEffect, useRef } from 'react';
import apiClient from '../api/axios';

const CamPayButton = ({ artist, amount, onPaymentSuccess, onPaymentFail }) => {
  const payButtonId = `pay-button-${artist._id}`;
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Check if the campay object is available on the window
    if (window.campay && !hasInitialized.current) {
      hasInitialized.current = true; // Prevents re-initialization on re-renders

      // Configure CamPay for this specific button
      window.campay.options({
        payButtonId: payButtonId,
        description: `Vote for ${artist.stageName}`,
        amount: amount.toString(),
        currency: "XAF",
        externalReference: "", // You can generate a unique ID here if needed
      });

      // --- Success Callback ---
      window.campay.onSuccess = function (data) {
        console.log("CamPay Success Data:", data);
        // Immediately call the backend to verify and record the vote
        verifyAndRecordVote(data.reference);
      };

      // --- Fail Callback ---
      window.campay.onFail = function (data) {
        console.log("CamPay Fail Data:", data);
        alert('Payment failed. Status: ' + data.status);
        if (onPaymentFail) onPaymentFail(data);
      };

      // --- Modal Close Callback ---
      window.campay.onModalClose = function (data) {
        console.log('CamPay Modal Closed:', data);
      };
    }
  }, [artist, amount, payButtonId, onPaymentSuccess, onPaymentFail]);

  const verifyAndRecordVote = async (reference) => {
    try {
      console.log(`Verifying payment reference: ${reference} for artist: ${artist._id}`);
      
      // We will create this backend endpoint next
      const response = await apiClient.post('/api/payments/verify', {
        reference: reference,
        artistId: artist._id,
        amount: amount, // Send amount for backend validation
      });

      alert(response.data.message); // "Vote recorded successfully!"
      if (onPaymentSuccess) onPaymentSuccess(response.data);

    } catch (error) {
      console.error("Verification failed:", error);
      alert(error.response?.data?.message || 'Payment verification failed. Please contact support.');
    }
  };

  return (
    <button
      id={payButtonId}
      className="w-full bg-brand-yellow-vote text-black font-bold py-3 rounded-md hover:brightness-90 transition-all"
    >
      VOTE NOW
    </button>
  );
};

export default CamPayButton;