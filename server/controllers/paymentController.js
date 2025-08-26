import axios from "axios";
import Artist from "../models/Artist.js";

// @desc    Generate a Fapshi payment link for voting
// @route   POST /api/payments/create
// @desc    Generate a Fapshi payment link for voting
// @route   POST /api/payments/create
export const createPayment = async (req, res) => {
  const { amount, artistId } = req.body;
  console.log("🎯 FAPSHI CREATE PAYMENT FUNCTION CALLED!");
  console.log("Using API User:", process.env.FAPSHI_API_USER);
  console.log("Using Base URL:", process.env.FAPSHI_BASE_URL);

  // Try different endpoints
  const endpointsToTry = [
    "/initiate-pay", // Your suggestion
    "/api/pay",
    "/v1/pay",
    "/payment/create",
    "/payments/create",
    "/transactions/create",
  ];

  for (const endpoint of endpointsToTry) {
    try {
      console.log(`🔄 Trying endpoint: ${endpoint}`);

      const response = await axios.post(
        `${process.env.FAPSHI_BASE_URL}${endpoint}`,
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
      console.log("✅ SUCCESS with endpoint:", endpoint);
      console.log("Fapshi API Response:", paymentData);

      return res.status(200).json({
        success: true,
        paymentUrl: paymentData.link,
        transId: paymentData.transId,
      });
    } catch (error) {
      console.log(`❌ Endpoint ${endpoint} failed:`, error.response?.status);
      // Continue to next endpoint
    }
  }

  // If all endpoints failed
  console.error("❌ ALL Fapshi endpoints failed");
  res.status(500).json({
    message: "Failed to create payment link",
    error:
      "All API endpoints failed. Please check Fapshi documentation for the correct endpoint.",
  });
};

// @desc    Verify Fapshi webhook (payment confirmation)
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
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
      if (artist) {
        const votesToAdd = Math.floor(amount / 100);
        artist.votes += votesToAdd;
        await artist.save();
        console.log(
          `✅ Added ${votesToAdd} votes to artist ${artist.stageName}`
        );
      }

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
