// /server/models/Artist.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' hides it by default
  age: { type: Number, required: true },
  stageName: { type: String, required: true },
  cellNumber: { type: String, required: true },
  whatsappNumber: { type: String },
  bio: { type: String, required: true },
  profilePicture: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  votes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }, // For admin approval
}, { timestamps: true });

// Hash password before saving
artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
artistSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;