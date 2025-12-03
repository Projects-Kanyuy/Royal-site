import mongoose from "mongoose";
// server/models/Payment.js
const paymentSchema = new mongoose.Schema({
  transId: { type: String, required: true, unique: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "XAF" },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESSFUL", "FAILED"],
    default: "PENDING",
  },
  paymentMethod: { type: String, default: "fapshi" },
  votesAdded: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
export const Payment = mongoose.model("Payment", paymentSchema);
