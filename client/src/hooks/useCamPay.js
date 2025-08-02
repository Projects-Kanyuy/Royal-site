// src/hooks/useCamPay.js
import { useEffect } from 'react';

// --- PRODUCTION: Replace with your LIVE CamPay App ID ---
const LIVE_APP_ID = 'yBM06dFkbSFdoLY2MMBFgcu1AKGNM_dbRguFHfInAzgTidvAPWI65pZWU8PqbPnSs_jIgswu4d_OG8aBkDCFsw'; 

const useCamPay = () => {
  useEffect(() => {
    // Check if the script is already on the page to prevent duplicates
    if (document.getElementById('campay-sdk')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'campay-sdk';
    
    // Use the live App ID in the script source URL
    script.src = `https://www.campay.net/sdk/js?app-id=${LIVE_APP_ID}`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Optional cleanup if needed, but it's safe to leave the script loaded
      // for single-page applications.
    };
  }, []); // Empty dependency array ensures this runs only once per app lifecycle.
};

export default useCamPay;