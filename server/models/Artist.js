// server/models/Artist.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  age: { type: Number, required: true },
  stageName: { type: String, required: true },
  cellNumber: { type: String, required: true },
  whatsappNumber: { type: String },
  bio: { type: String, required: true },
  profilePicture: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  
  // --- NEW VOTE STRUCTURE ---
  // These votes determine the leaderboard ranking
  votes: { type: Number, default: 0 },         // CamPay (online) votes
  financialVotes: { type: Number, default: 0 }, // Cash votes (added by admin)

  // This is the separate, promotional vote that does NOT affect ranking
  handVotes: { type: Number, default: 0 },      // Free "hand" votes (added by public)
  
  isApproved: { type: Boolean, default: true },
  genre: { type: String },
}, { 
  timestamps: true,
  // Ensure virtual properties are included when sending data as JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// A "virtual" property that automatically calculates the total official votes.
// This is not stored in the database but calculated on the fly.
artistSchema.virtual('totalOfficialVotes').get(function() {
  return (this.votes || 0) + (this.financialVotes || 0);
});

// Bcrypt password hashing methods (unchanged)
artistSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;