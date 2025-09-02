import mongoose from "mongoose";

// server/models/ManualVote.js
const manualVoteSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  votesAdded: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "mobile_money"],
    required: true,
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});
export const ManualVote = mongoose.model("ManualVote", manualVoteSchema);
