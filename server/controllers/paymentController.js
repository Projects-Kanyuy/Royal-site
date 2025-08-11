// server/controllers/paymentController.js

import fetch from 'node-fetch';
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { reference, artistId, amount } = req.body;

  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing payment details for verification.' });
  }

  // The LIVE CamPay API URL for collections
  const campayApiUrl = 'https://www.campay.net/api/collect/';

  const options = {
    method: 'POST', // Use POST method as required
    headers: {
      'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // --- CRITICAL FIX: Send ONLY the reference in the body ---
    // The API documentation for a status check only requires the reference.
    body: JSON.stringify({ reference: reference }),
  };

  try {
    console.log(`Verifying payment for reference: ${reference} with POST.`);

    const campayResponse = await fetch(campayApiUrl, options);

    if (!campayResponse.ok) {
      const errorBody = await campayResponse.text();
      console.error(`CamPay API responded with an error. Status: ${campayResponse.status}`);
      console.error(`CamPay API response body: ${errorBody}`);
      throw new Error(`CamPay verification failed with status ${campayResponse.status}.`);
    }

    const transaction = await campayResponse.json();
    console.log('CamPay Verification Response:', transaction);
    
    // We still compare the amount received from the API with the amount the user intended to pay
    const transactionAmount = parseFloat(transaction.amount);
    const paidAmount = parseFloat(amount);

    if (transaction.status === 'SUCCESSFUL' && transactionAmount === paidAmount) {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found. Vote cannot be recorded.' });
      }

      const votesToAdd = Math.floor(paidAmount / 100);
      artist.votes += votesToAdd;
      await artist.save();
      
      console.log(`Success! Added ${votesToAdd} vote(s) to ${artist.stageName}. New total: ${artist.votes}`);
      return res.status(200).json({ message: `Your vote for ${artist.stageName} has been successfully recorded!` });

    } else {
      console.log(`Verification failed. Status: ${transaction.status}, Amount Sent: ${paidAmount}, Amount Verified: ${transactionAmount}`);
      return res.status(400).json({ message: 'Payment verification failed. Your vote was not recorded.' });
    }

  } catch (error) {
    console.error('---!!! CRITICAL ERROR DURING PAYMENT VERIFICATION !!!---');
    console.error(error.message);
    return res.status(500).json({ message: 'A server error occurred during payment verification. Please contact support.' });
  }
};