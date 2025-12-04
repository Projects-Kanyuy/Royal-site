// controllers/paymentController.js
import { createPaymentLink, getPaymentLinkStatus } from "../utils/payinService.js";
import Payment from "../models/Payment.js";
import Artist from "../models/Artist.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
  try {
    const { artistId, amount } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    // Generate correct transaction ID
    const transaction_id = `VOTE-${artistId}-${crypto.randomBytes(4).toString("hex")}`;

    // Format required by AccountPe
    const paymentData = {
      country_code: "CM",
      currency: "XAF",
      amount,
      name: artist.name,
      email: "noemail@artistvote.com",
      transaction_id,
      description: `Vote payment for ${artist.name}`,
      pass_digital_charge: true,
      redirect_url: `${process.env.BASE_URL}/api/payments/verify?transaction_id=${transaction_id}`,
    };

    console.log("🔵 Creating Payin payment:", paymentData);

    const response = await createPaymentLink(paymentData);

    if (!response.data?.data?.payment_link) {
      console.error("❌ Invalid AccountPe Response:", response.data);
      return res.status(400).json({ error: "AccountPe did not return payment link" });
    }

    // Save payment record
    const payment = new Payment({
      transId: transaction_id,
      artist: artistId,
      amount,
      status: "PENDING",
      paymentMethod: "accountpe",
    });
    await payment.save();

    res.json({
      payment_url: response.data.data.payment_link,
      transaction_id,
    });
  } catch (err) {
    console.error("PAYIN CREATE ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Payment creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transaction_id } = req.query;

    const statusResponse = await getPaymentLinkStatus(transaction_id);
    const status = statusResponse.data?.status;

    console.log("🔍 AccountPe Status:", statusResponse.data);

    const payment = await Payment.findOne({ transId: transaction_id });
    if (!payment) return res.status(404).send("Payment not found");

    if (status === "success" || status === "completed") {
      payment.status = "SUCCESSFUL";
      payment.votesAdded = payment.amount / 100;
      await payment.save();

      await Artist.findByIdAndUpdate(payment.artist, {
        $inc: { votes: payment.votesAdded },
      });
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (err) {
    console.error("VERIFY ERROR:", err.response?.data || err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
