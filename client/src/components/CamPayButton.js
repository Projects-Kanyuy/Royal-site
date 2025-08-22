// src/components/CamPayButton.js
import React, { useEffect, useRef } from 'react';
import apiClient from '../api/axios';

const CamPayButton = ({ artist, amount, onPaymentSuccess, onPaymentFail }) => {
  const payButtonId = `pay-button-${artist._id}`;
  // Use a ref to prevent re-initializing the callbacks on every render
  const callbacksInitialized = useRef(false);

  // This useEffect now ONLY runs when the amount changes, which is more efficient.
  useEffect(() => {
    if (window.campay) {
      // Configure CamPay options with the latest amount
      window.campay.options({
        payButtonId: payButtonId,
        description: `Vote for ${artist.stageName}`,
        amount: amount.toString(),
        currency: "XAF",
        externalReference: "", // Optional: generate a unique ID here
      });
    }
  }, [amount, artist.stageName, payButtonId]); // Only depends on what's needed for .options()

  // This useEffect sets up the global callbacks ONCE and never runs again.
  useEffect(() => {
    if (window.campay && !callbacksInitialized.current) {
      callbacksInitialized.current = true; // Mark as initialized

      window.campay.onSuccess = function (data) {
        console.log("CamPay Success Data:", data);
        // Call the verification function, which now handles the WhatsApp redirect
        verifyAndOpenWhatsApp(data.reference);
      };

      window.campay.onFail = function (data) {
        console.log("CamPay Fail Data:", data);
        alert('Payment failed. Status: ' + data.status);
        if (onPaymentFail) onPaymentFail(data);
      };

      window.campay.onModalClose = function (data) {
        console.log('CamPay Modal Closed:', data);
      };
    }
  }, [onPaymentFail]); // Only depends on onPaymentFail if it's used

  const verifyAndOpenWhatsApp = async (reference) => {
    try {
      console.log(`Verifying payment ref: ${reference} for artist: ${artist._id} with amount: ${amount}`);
      
      const response = await apiClient.post('/api/payments/verify', {
        reference: reference,
        artistId: artist._id,
        // Send the amount the user intended to pay for secure validation
        amount: amount, 
      });

      // Step 1: Show the success message from your server
      alert(response.data.message);

      if (onPaymentSuccess) {
        onPaymentSuccess(response.data);
      }
      
      // --- STEP 2: OPEN THE WHATSAPP LINK IN A NEW TAB ---
      // This code will only execute if the verification above was successful.
      const whatsappLink = "https://chat.whatsapp.com/G7vK3oO7dHb0Rj8e7VOHbr?mode=ac_t";
      window.open(whatsappLink, '_blank');

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