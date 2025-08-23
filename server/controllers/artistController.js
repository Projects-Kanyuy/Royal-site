// server/controllers/artistController.js
import Artist from '../models/Artist.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from 'cloudinary';
import axios from 'axios';

// --- Cloudinary Configuration ---
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary has been configured successfully.');
} else {
  console.error('!!! FATAL ERROR: CLOUDINARY CREDENTIALS ARE MISSING !!!');
}

/**
 * A helper function to upload a file buffer to Cloudinary with "fill" cropping.
 */
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) return reject(new Error('No file buffer provided.'));
    
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        // --- THIS IS THE KEY CHANGE ---
        // This tells Cloudinary to resize the image to fit a 500x500px square.
        // It keeps the original aspect ratio and crops the edges as needed to fill the space.
        // 'gravity: auto' ensures the most interesting part of the image is kept.
        folder: 'rocimuc_artists',
        width: 500,
        height: 500,
        crop: 'fill', // Changed from 'thumb' to 'fill'
        gravity: 'auto', // Changed from 'face' to 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};


// @desc    Register a new artist
// @route   POST /api/artists/register
export const registerArtist = async (req, res) => {
  console.log('--- A registration attempt has started ---');
  console.log('Request Body Received:', req.body);
  console.log('Request File Received:', req.file ? { fieldname: req.file.fieldname, size: req.file.size } : 'No File Received');

  const { name, email, password, age, stageName, cellNumber, whatsappNumber, bio } = req.body;
  
  if (!req.file) {
    console.log('Registration failed: No file was uploaded with the request.');
    return res.status(400).json({ message: 'A profile picture is required.' });
  }

  try {
    const artistExists = await Artist.findOne({ email });
    if (artistExists) {
      console.log(`Registration failed: Artist with email ${email} already exists.`);
      return res.status(400).json({ message: 'An artist with this email already exists.' });
    }
    
    console.log('Attempting to upload image to Cloudinary...');
    const result = await uploadFromBuffer(req.file.buffer);
    console.log('Cloudinary upload successful. Public ID:', result.public_id);
    
    console.log('Attempting to create artist in the database...');
    const artist = await Artist.create({
      name, email, password, age, stageName, cellNumber, whatsappNumber, bio,
      profilePicture: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    console.log('Database creation successful for artist:', artist.email);

    res.status(201).json({
      _id: artist._id,
      name: artist.name,
      email: artist.email,
      token: generateToken(artist._id),
    });
  } catch (error) {
    console.error('\n---!!! AN UNHANDLED ERROR OCCURRED IN THE REGISTRATION PROCESS !!!---\n');
    console.error(error);
    res.status(500).json({ message: 'Server error during registration. Please contact support.' });
  }
};

// ... aother functions remain the same
export const loginArtist = async (req, res) => {
    const { email, password } = req.body;
    // We search the Artist collection
    const artist = await Artist.findOne({ email }).select('+password');

    if (artist && (await artist.matchPassword(password))) {
        // We return an object WITHOUT isAdmin field
        res.json({
            _id: artist._id,
            name: artist.name,
            email: artist.email,
            token: generateToken(artist._id),
            // No isAdmin field here
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
export const voteForArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
        artist.votes += 1;
        await artist.save();
        res.json({ message: 'Vote counted successfully' });
    } else {
        res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('ERROR PROCESSING VOTE:', error);
    res.status(500).json({ message: 'Error processing your vote' });
  }
};
export const getArtistProfile = async (req, res) => {
  if (req.artist) {
      res.json(req.artist);
  } else {
      res.status(404).json({ message: 'Artist not found' });
  }
};
export const updateArtistProfile = async (req, res) => {
  try {
      const artist = await Artist.findById(req.artist._id);
      if (artist) {
          artist.name = req.body.name || artist.name;
          artist.stageName = req.body.stageName || artist.stageName;
          artist.bio = req.body.bio || artist.bio;
          if (req.body.password) {
              artist.password = req.body.password;
          }
          const updatedArtist = await artist.save();
          res.json({ _id: updatedArtist._id, name: updatedArtist.name, email: updatedArtist.email, token: generateToken(updatedArtist._id) });
      } else {
          res.status(404).json({ message: 'Artist not found' });
      }
  } catch (error) {
      console.error('ERROR UPDATING PROFILE:', error);
      res.status(500).json({ message: 'Error updating profile' });
  }
};
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (artist) {
      // Send back only the public data
      res.json({
        _id: artist._id,
        stageName: artist.stageName,
        profilePicture: artist.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('ERROR FETCHING SINGLE ARTIST:', error);
    res.status(404).json({ message: 'Artist not found or invalid ID' });
  }
};
// @desc    Add a single, free vote to an artist
// @route   POST /api/artists/:id/manual-vote
export const getArtistsForVoting = async (req, res) => {
    // This function should also return handVotes
    const artists = await Artist.find({ isApproved: true }).select('-password');
    res.json(artists);
};

// @desc    Get leaderboard
// @route   GET /api/artists/leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        // --- THE DEFINITIVE FIX FOR MISSING HAND VOTES ON LEADERBOARD ---
        // We explicitly name every field needed to ensure it is returned,
        // solving the issue of Mongoose dropping the 'handVotes' field.
        const artists = await Artist.find({ isApproved: true })
            .sort({ votes: -1 })
            .limit(10)
            .select('stageName genre profilePicture votes handVotes'); // <-- HAND VOTES GUARANTEED
            
        res.json(artists);
    } catch (error) {
        console.error('ERROR FETCHING LEADERBOARD:', error);
        res.status(500).json({ message: 'Could not retrieve leaderboard' });
    }
};



// @desc    Add a single, free vote to an artist
// @route   POST /api/artists/:id/manual-vote
export const addManualVote = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
      artist.handVotes += 1; // This logic is correct
      await artist.save();
      res.status(200).json({ newHandVoteCount: artist.handVotes });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error('ERROR PROCESSING MANUAL VOTE:', error);
    res.status(500).json({ message: 'Server error while processing your vote' });
  }
};
