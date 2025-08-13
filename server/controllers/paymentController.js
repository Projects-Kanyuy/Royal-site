// server/controllers/paymentController.js
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record a vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  // Data from our frontend (this part is correct)
  const { reference, artistId, amount } = req.body;

  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing payment details for verification' });
  }

  // --- THIS IS THE CRITICAL FIX ---
  // Construct the URL exactly as your boss specified, with the reference in the path.
  const campayApiUrl = `https://www.campay.net/api/transaction/${reference}/`;
  
  const headers = {
    'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`, // Your secret token
    'Content-Type': 'application/json',
  };

  try {
    console.log(`Verifying payment by calling CamPay API: ${campayApiUrl}`);

    // --- CORRECTED AXIOS CALL ---
    // Make a GET request to the new URL. We don't send any data in the body.
    // The config object with headers is the second argument for a GET request.
    const response = await axios.get(campayApiUrl, { headers });

    const transaction = response.data;
    console.log('CamPay Verification Response:', transaction);

    const transactionAmount = parseFloat(transaction.amount);

    // Now, we check the response from CamPay and update our database
    if (transaction.status === 'SUCCESSFUL' && transactionAmount === amount) {
      const artist = await Artist.findById(artistId);
      if (!artist) {
        // This is an important safety check
        return res.status(404).json({ message: 'Artist not found. Vote cannot be recorded.' });
      }

      const votesToAdd = Math.floor(amount / 100);
      artist.votes += votesToAdd;
      await artist.save();
      
      console.log(`SUCCESS: Added ${votesToAdd} vote(s) to ${artist.stageName}`);
      res.status(200).json({ message: `Your vote for ${artist.stageName} has been successfully recorded!` });

    } else {
      // This handles cases where the payment was not successful or amounts don't match
      console.log(`Verification failed. Status: ${transaction.status}, Amount Sent: ${amount}, Amount Received: ${transactionAmount}`);
      res.status(400).json({ message: 'Payment verification failed. Your vote was not recorded.' });
    }

  } catch (error) {
    // This will log the exact error from CamPay's server to your backend console
    console.error('---!!! CRITICAL ERROR DURING CAMPAY VERIFICATION !!!---');
    if (error.response) {
      console.error('CamPay responded with an error:');
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Error Message:', error.message);
    }
    res.status(500).json({ message: 'A server error occurred during payment verification. Please contact support.' });
  }
};