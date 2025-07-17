// server/controllers/adminController.js
import Artist from '../models/Artist.js';
import jwt from 'jsonwebtoken';

// A helper function to generate a specific admin token
const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: '1d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check against the hardcoded credentials in the .env file
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({
      email: email,
      token: generateAdminToken('admin_user_id'), // The ID can be static
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// @desc    Get all artists pending approval
// @route   GET /api/admin/artists/pending
export const getPendingArtists = async (req, res) => {
  try {
    const pendingArtists = await Artist.find({ isApproved: false });
    res.json(pendingArtists);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve an artist
// @route   PUT /api/admin/artists/:id/approve
export const approveArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
      artist.isApproved = true;
      await artist.save();
      res.json({ message: 'Artist approved successfully' });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject (delete) an artist
// @route   DELETE /api/admin/artists/:id
export const rejectArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (artist) {
      // You might want to also delete their image from Cloudinary here in a real app
      res.json({ message: 'Artist rejected and deleted successfully' });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};