// server/controllers/paymentController.js
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record a vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { reference, artistId, amount } = req.body;

  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing required payment details' });
  }

  // --- PRODUCTION: Use the LIVE CamPay API URL ---
  const campayApiUrl = 'https://www.campay.net/api/transaction/airtime/status/';

  try {
    console.log(`Verifying LIVE transaction with reference: ${reference}`);
    
    const response = await axios.post(
      campayApiUrl,
      { reference: reference },
      {
        headers: {
          // The token is securely read from your .env file
          'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const transaction = response.data;
    console.log('CamPay LIVE Verification Response:', transaction);

    // Check if the live transaction was successful and the amount matches
    if (transaction.status === 'SUCCESSFUL' && transaction.amount === amount) {
      const artist = await Artist.findById(artistId);
      if (artist) {
        const votesToAdd = Math.floor(amount / 100);
        artist.votes += votesToAdd;
        await artist.save();
        
        console.log(`Successfully added ${votesToAdd} votes to ${artist.stageName}`);
        res.status(200).json({ message: `Your vote for ${artist.stageName} has been recorded successfully!` });
      } else {
        // This case handles if an artist was deleted after payment started
        console.error(`Verification success but artist with ID ${artistId} not found.`);
        res.status(404).json({ message: 'Artist not found.' });
      }
    } else {
      // If the live payment failed, was cancelled, or the amount doesn't match
      console.log(`Verification failed for reference ${reference}. Status: ${transaction.status}`);
      res.status(400).json({ message: 'Payment verification failed. Your vote was not recorded.' });
    }
  } catch (error) {
    console.error('Error verifying payment with CamPay:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'A server error occurred during payment verification. Please contact support.' });
  }
};