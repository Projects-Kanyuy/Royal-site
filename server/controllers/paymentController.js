// server/controllers/paymentController.js
import axios from 'axios';
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { reference, artistId, amount } = req.body;

  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  try {
    // --- THIS IS THE BACKEND VERIFICATION STEP ---
    // Make a POST request to CamPay's transaction status endpoint
    const campayApiUrl = 'https://demo.campay.net/api/transaction/airtime/status/';
    const response = await axios.post(
      campayApiUrl,
      { reference: reference },
      {
        headers: {
          'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`, // You MUST add this to your .env file
          'Content-Type': 'application/json',
        },
      }
    );

    const transaction = response.data;
    console.log('CamPay Verification Response:', transaction);

    // Check if the transaction was successful and matches the amount
    if (transaction.status === 'SUCCESSFUL' && transaction.amount === amount) {
      // Find the artist and increment their votes
      const artist = await Artist.findById(artistId);
      if (artist) {
        // Calculate number of votes from the amount
        const votesToAdd = Math.floor(amount / 100);
        artist.votes += votesToAdd;
        await artist.save();
        
        res.status(200).json({ message: `Vote recorded successfully for ${artist.stageName}!` });
      } else {
        res.status(404).json({ message: 'Artist not found.' });
      }
    } else {
      // If payment failed or amount doesn't match
      res.status(400).json({ message: 'Payment verification failed or amount mismatch.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Server error during payment verification.' });
  }
};