import mongoose from "mongoose";

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
  paymentMethod: { type: String, default: "swychr" },
  votesAdded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
