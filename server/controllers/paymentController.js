import axios from "axios";
import Artist from "../models/Artist.js";
import { Payment } from "../models/Payment.js";

// @desc    Generate a Fapshi payment link for voting
// @route   POST /api/payments/create
// @desc    Generate a Fapshi payment link for voting
// @route   POST /api/payments/create
export const createPayment = async (req, res) => {
  const { amount, artistId } = req.body;
  console.log("🎯 FAPSHI CREATE PAYMENT FUNCTION CALLED!");

  try {
    const response = await axios.post(
      `${process.env.FAPSHI_BASE_URL}/initiate-pay`, // ← JUST USE /initiate-pay
      {
        amount: amount,
        currency: "XAF",
        userId: artistId,
        redirectUrl: `${process.env.FRONTEND_URL}/vote-success?artistId=${artistId}`,
        webhookUrl: `${process.env.BACKEND_URL}/api/payments/verify`,
      },
      {
        headers: {
          apiuser: process.env.FAPSHI_API_USER,
          apikey: process.env.FAPSHI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data;
    res.status(200).json({
      success: true,
      paymentUrl: paymentData.link,
      transId: paymentData.transId,
    });
  } catch (error) {
    console.error("Fapshi Payment Error:", error.response?.data);
    res.status(500).json({
      message: "Failed to create payment link",
      error: error.response?.data || error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  console.log("🎯 WEBHOOK HIT! Headers:", req.headers);
  console.log("🎯 WEBHOOK BODY:", req.body);
  try {
    const { transId, status, amount, userId } = req.body;

    console.log("🎯 FAPSHI WEBHOOK RECEIVED:", {
      transId,
      status,
      amount,
      userId,
    });

    if (status === "SUCCESSFUL") {
      // Payment successful - update artist votes
      const artist = await Artist.findById(userId);

      if (!artist) {
        console.log(`❌ Artist not found: ${userId}`);
        return res.status(404).json({ message: "Artist not found" });
      }

      const votesToAdd = Math.floor(amount / 100);
      artist.votes += votesToAdd;
      await artist.save();

      // Record the payment transaction
      try {
        const paymentRecord = new Payment({
          transId,
          artist: userId,
          amount,
          currency: "XAF",
          status: "SUCCESSFUL",
          paymentMethod: "fapshi",
          votesAdded: votesToAdd,
          createdAt: new Date(),
        });
        await paymentRecord.save();
        console.log(
          `✅ Payment recorded: ${transId}, ${votesToAdd} votes added`
        );
      } catch (paymentError) {
        console.error("❌ Failed to save payment record:", paymentError);
      }

      console.log(`✅ Added ${votesToAdd} votes to artist ${artist.stageName}`);
      res.status(200).json({ message: "Webhook processed successfully" });
    } else {
      console.log(`❌ Payment ${transId} failed with status: ${status}`);
      res.status(200).json({ message: "Webhook processed (failed payment)" });
    }
  } catch (error) {
    console.error("Fapshi Webhook Error:", error);
    res.status(500).json({
      message: "Webhook processing error",
      error: error.message,
    });
  }
};
// @desc    Check payment status (optional - for frontend polling)
// @route   GET /api/payments/status/:transId
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transId } = req.params;

    const response = await axios.get(
      `${process.env.FAPSHI_BASE_URL}/transaction-status/${transId}`,
      {
        headers: {
          apiuser: process.env.FAPSHI_API_USER,
          apikey: process.env.FAPSHI_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Fapshi Status Check Error:", error.response?.data);
    res.status(500).json({
      message: "Failed to check payment status",
      error: error.response?.data || error.message,
    });
  }
};
