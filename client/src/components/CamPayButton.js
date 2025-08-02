import React, { useEffect, useRef } from "react";
import apiClient from "../api/axios";

const CamPayButton = ({ artist, amount, onPaymentSuccess, onPaymentFail }) => {
  const payButtonId = `pay-button-${artist._id}`;
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initCamPay = () => {
      if (!window.campay || hasInitialized.current) return;
      hasInitialized.current = true;

      // 1) Configure the button
      window.campay.options({
        payButtonId,
        description: `Vote for ${artist.stageName}`,
        amount: amount.toString(),
        currency: "XAF",
        externalReference: "",
      });

      // 2) Wire up callbacks
      window.campay.onSuccess = (data) => {
        console.log("CamPay Success Data:", data);
        verifyAndRecordVote(data.reference);
        onPaymentSuccess?.(data);
      };

      window.campay.onFail = (data) => {
        console.log("CamPay Fail Data:", data);
        alert("Payment failed. Status: " + data.status);
        onPaymentFail?.(data);
      };

      window.campay.onModalClose = (data) => {
        console.log("CamPay Modal Closed:", data);
      };
    };

    // 1) If SDK is already loaded, init immediately:
    if (window.campay) {
      initCamPay();
    } else {
      // 2) Otherwise, wait for the <script> tag’s load event:
      const script = document.getElementById("campay-sdk");
      if (script) {
        script.addEventListener("load", initCamPay);
        // Cleanup listener on unmount
        return () => script.removeEventListener("load", initCamPay);
      }
    }
  }, [artist, amount, payButtonId, onPaymentSuccess, onPaymentFail]);

  const verifyAndRecordVote = async (reference) => {
    try {
      const response = await apiClient.post("/api/payments/verify", {
        reference,
        artistId: artist._id,
        amount,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Verification failed:", error);
      alert(error.response?.data?.message || "Payment verification failed.");
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
