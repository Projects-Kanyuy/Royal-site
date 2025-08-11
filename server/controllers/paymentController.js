// server/controllers/paymentController.js
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { reference, artistId, amount } = req.body;

  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing payment details for verification' });
  }

  // --- CORRECTED: Use the LIVE 'collect' endpoint for verifying Mobile Money payments ---
  const campayApiUrl = 'https://www.campay.net/api/collect/';

  // The Authorization header must contain your private key
  const headers = {
    'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    console.log(`Verifying payment for reference: ${reference}`);

    // --- CORRECTED AXIOS CALL ---
    // Use a GET request and pass the reference as a query parameter in the URL
    // This is a common pattern for "status check" APIs.
    const response = await axios.get(`${campayApiUrl}?reference=${reference}`, { headers });

    const transaction = response.data;
    console.log('CamPay Verification Response:', transaction);

    // Ensure we are checking the correct amount format (CamPay sends numbers, not strings)
    const transactionAmount = parseFloat(transaction.amount);

    // Check if the transaction was successful and the amount matches
    if (transaction.status === 'SUCCESSFUL' && transactionAmount === amount) {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found. Vote cannot be recorded.' });
      }

      const votesToAdd = Math.floor(amount / 100);
      artist.votes += votesToAdd;
      await artist.save();
      
      console.log(`Success! Added ${votesToAdd} vote(s) to ${artist.stageName}`);
      res.status(200).json({ message: `Your vote for ${artist.stageName} has been successfully recorded!` });

    } else {
      console.log(`Verification failed. Status: ${transaction.status}, Amount Sent: ${amount}, Amount Received: ${transactionAmount}`);
      res.status(400).json({ message: 'Payment verification failed. Your vote was not recorded.' });
    }

  } catch (error) {
    // This will give us a very detailed error in the backend console
    console.error('---!!! ERROR DURING CAMPAY VERIFICATION !!!---');
    if (error.response) {
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    res.status(500).json({ message: 'A server error occurred during payment verification. Please contact support.' });
  }
};