// server/controllers/paymentController.js
import axios from 'axios'; 
import Artist from '../models/Artist.js';

// @desc    Verify a CamPay transaction and record a vote
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { reference, artistId, amount } = req.body;

  // 1. Initial Validation
  if (!reference || !artistId || !amount) {
    return res.status(400).json({ message: 'Missing payment details for verification.' });
  }

  // 2. Construct the Correct CamPay API URL
  const campayApiUrl = `https://www.campay.net/api/transaction/${reference}/`;
  
  // 3. Prepare the Authorization Headers
  const headers = {
    'Authorization': `Token ${process.env.CAMPAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    console.log(`[Verification] Calling CamPay API: ${campayApiUrl}`);
    
    // 4. Make the GET request to CamPay to check the transaction status
    const campayResponse = await axios.get(campayApiUrl, { headers });
    const transaction = campayResponse.data;

    console.log('[Verification] CamPay API Response:', transaction);

    // 5. Securely Validate the Transaction
    const transactionAmount = Number(transaction.amount);
    const frontendAmount = Number(amount);

    if (transaction.status === 'SUCCESSFUL' && transactionAmount === frontendAmount) {
      console.log(`[Verification] SUCCESS. Amounts match (${transactionAmount}).`);
      
      const artist = await Artist.findById(artistId);
      if (!artist) {
        console.error(`[DB Error] Artist with ID ${artistId} not found after successful payment.`);
        return res.status(404).json({ message: 'Artist not found. Your vote could not be recorded.' });
      }

      const votesToAdd = Math.floor(frontendAmount / 100);
      artist.votes += votesToAdd;
      await artist.save();
      
      console.log(`[DB Success] Added ${votesToAdd} vote(s) to ${artist.stageName}.`);
      res.status(200).json({ message: `Your vote for ${artist.stageName} has been successfully recorded!` });

    } else {
      console.warn(`[Verification] FAILED. CamPay Status: ${transaction.status}, Frontend Amount: ${frontendAmount}, CamPay Amount: ${transactionAmount}`);
      res.status(400).json({ message: 'Payment verification failed. Your vote was not recorded.' });
    }

  } catch (error) {
    console.error('\n---!!! CRITICAL ERROR DURING CAMPAY VERIFICATION !!!---\n');
    if (error.response) {
      console.error('CamPay responded with an error:');
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    } else {
      console.error('General Error Message:', error.message);
    }
    res.status(500).json({ message: 'A server error occurred during payment verification. Please contact support.' });
  }
};