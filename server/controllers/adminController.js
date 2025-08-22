// server/controllers/adminController.js
import Artist from '../models/Artist.js';

// @desc    Get all artists for the admin panel (sorted by name)
// @route   GET /api/admin/artists
export const getAllArtistsForAdmin = async (req, res) => {
  try {
    const artists = await Artist.find({}).sort({ stageName: 1 }); // Sort alphabetically by stage name
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artists." });
  }
};

// @desc    Add hand votes to an artist (for cash payments)
// @route   PUT /api/admin/artists/:id/add-hand-votes
export const addHandVotesToArtist = async (req, res) => {
  const { votesToAdd } = req.body;
  
  if (!votesToAdd || isNaN(votesToAdd) || Number(votesToAdd) <= 0) {
    return res.status(400).json({ message: 'Please provide a valid, positive number of votes to add.' });
  }

  try {
    const artist = await Artist.findById(req.params.id);
    if (artist) {
      artist.handVotes = (artist.handVotes || 0) + Number(votesToAdd);
      const updatedArtist = await artist.save();
      res.json(updatedArtist); // Send back the full updated artist object
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add hand votes." });
  }
};