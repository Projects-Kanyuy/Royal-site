// src/hooks/useCamPay.js
import { useEffect } from 'react';

// --- LIVE KEY IS NOW HARDCODED ---
// IMPORTANT: This key must be a LIVE App ID from your CamPay dashboard.
const LIVE_APP_ID = 'yBM06dFkbSFdoLY2MMBFgcu1AKGNM_dbRguFHfInAzgTidvAPWI65pZWU8PqbPnSs_jIgswu4d_OG8aBkDCFsw'; 

const useCamPay = () => {
  useEffect(() => {
    // Check if the script has already been added to the page
    if (document.getElementById('campay-sdk')) {
      console.log('CamPay SDK script already loaded.');
      return;
    }

    // Double-check that the key is not a placeholder
    if (!LIVE_APP_ID || LIVE_APP_ID === 'your_live_app_id_from_campay_dashboard') {
        console.error("FATAL ERROR: The CamPay App ID is a placeholder. Please add your real live App ID.");
        return;
    }

    console.log('Loading CamPay SDK script...');
    const script = document.createElement('script');
    script.id = 'campay-sdk';
    
    // --- CORRECTED SCRIPT URL ---
    // Use the live URL (www.campay.net) with your live App ID
    script.src = `https://www.campay.net/sdk/js?app-id=${LIVE_APP_ID}`;
    script.async = true;

    // Add error handling for script loading
    script.onerror = () => {
        console.error("Failed to load the CamPay SDK script. Please check your network connection and the App ID.");
    };

    script.onload = () => {
        console.log("CamPay SDK script loaded successfully.");
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script if the component unmounts (optional but good practice)
    return () => {
      const existingScript = document.getElementById('campay-sdk');
      if (existingScript) {
        // You might choose to leave it for performance in a single-page app
        // document.body.removeChild(existingScript);
      }
    };
  }, []); // The empty dependency array ensures this hook runs only once.
};

export default useCamPay;