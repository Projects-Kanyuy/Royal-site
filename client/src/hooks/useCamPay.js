// src/hooks/useCamPay.js
import { useEffect } from 'react';

// Securely read the App ID from the environment variable
const CAMPAY_APP_ID = process.env.REACT_APP_CAMPAY_APP_ID;

const useCamPay = () => {
  useEffect(() => {
    // Check if the script is already loaded
    if (document.getElementById('campay-sdk')) {
      return;
    }

    // Add a check to ensure the App ID is present
    if (!CAMPAY_APP_ID) {
      console.error("FATAL ERROR: REACT_APP_CAMPAY_APP_ID is not defined in your .env file.");
      return;
    }

    const script = document.createElement('script');
    script.id = 'campay-sdk';
    
    // Use the live App ID from the environment variable in the script source URL
    script.src = `https://www.campay.net/sdk/js?app-id=${CAMPAY_APP_ID}`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Optional cleanup
    };
  }, []); // Empty dependency array ensures this runs only once.
};

export default useCamPay;