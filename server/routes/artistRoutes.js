// server/routes/artistRoutes.js
import express from 'express';
import {
  registerArtist,
  loginArtist,
  getArtistsForVoting,
  getLeaderboard,
  voteForArtist,
  getArtistProfile,
  updateArtistProfile,
  getArtistById,
  addManualVote
} from '../controllers/artistController.js';
import protect from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are prefixed with /api/artists

// POST /api/artists/register
router.post('/register', upload.single('profilePicture'), registerArtist);
router.post('/:id/manual-vote', addManualVote);

// POST /api/artists/login
router.post('/login', loginArtist);

// GET /api/artists/vote
router.get('/vote', getArtistsForVoting);

// GET /api/artists/leaderboard
router.get('/leaderboard', getLeaderboard);

// POST /api/artists/:id/vote
router.post('/:id/vote', voteForArtist);
router.get('/:id', getArtistById);

// GET & PUT /api/artists/profile
router.route('/profile')
  .get(protect, getArtistProfile)
  .put(protect, updateArtistProfile);

export default router;