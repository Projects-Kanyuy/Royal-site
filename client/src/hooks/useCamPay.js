// src/hooks/useCamPay.js
import { useEffect } from 'react';

const useCamPay = () => {
  useEffect(() => {
    // Check if the script is already on the page
    if (document.getElementById('campay-sdk')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'campay-sdk';
    // IMPORTANT: Replace the app-id with your REAL production App ID when you go live.
    script.src = "https://demo.campay.net/sdk/js?app-id=xt3I9vaP_xAI1Qya1cKCbOqTy3GJZNB2Va-K0gP_TfPWEFW3CwwATHX1gYaQcAEanmQflUYQ7_sWdNDQJeruAA";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Optional: cleanup script when the component unmounts
      const existingScript = document.getElementById('campay-sdk');
      if (existingScript) {
        // In some cases, you might not want to remove it if other components use it.
        // For this app, it's fine to leave it.
      }
    };
  }, []); // The empty dependency array ensures this runs only once.
};

export default useCamPay;