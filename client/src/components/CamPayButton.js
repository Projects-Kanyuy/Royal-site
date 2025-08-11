// src/components/CamPayButton.js
import React, { useEffect } from 'react';
import apiClient from '../api/axios';

const CamPayButton = ({ artist, amount, onPaymentSuccess, onPaymentFail }) => {
  const payButtonId = `pay-button-${artist._id}`;

  // This useEffect hook will now run every time the 'amount' prop changes.
  useEffect(() => {
    // Check if the campay object is available on the window
    if (window.campay) {
      console.log(`Configuring CamPay for artist ${artist.stageName} with amount ${amount}`);

      // Configure CamPay for this specific button with the CURRENT amount
      window.campay.options({
        payButtonId: payButtonId,
        description: `Vote for ${artist.stageName}`,
        amount: amount.toString(), // Ensure amount is always a string
        currency: "XAF",
        externalReference: "",
      });

      // --- Success Callback ---
      window.campay.onSuccess = function (data) {
        console.log("CamPay Success Data:", data);
        // Call the backend to verify and record the vote
        verifyAndRecordVote(data.reference, data.amount);
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
  }, [artist, amount, payButtonId, onPaymentSuccess, onPaymentFail]); // Dependency array includes 'amount'

  const verifyAndRecordVote = async (reference, paidAmount) => {
    try {
      console.log(`Verifying payment ref: ${reference} for artist: ${artist._id} with amount: ${paidAmount}`);
      
      const response = await apiClient.post('/api/payments/verify', {
        reference: reference,
        artistId: artist._id,
        // Send the amount that was ACTUALLY paid for backend validation
        amount: parseFloat(paidAmount), 
      });

      alert(response.data.message);
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
