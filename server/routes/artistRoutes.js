// server/routes/artistRoutes.js
import express from 'express';
const router = express.Router();
import {
  registerArtist, loginArtist, getArtistsForVoting, getLeaderboard,
  getArtistById, getArtistProfile, updateArtistProfile, addHandVote
} from '../controllers/artistController.js';
import protect from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', upload.single('profilePicture'), registerArtist);
router.post('/login', loginArtist);
router.get('/vote', getArtistsForVoting);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getArtistById);
router.post('/:id/hand-vote', addHandVote); // Renamed from manual-vote

// Note: The old '/:id/vote' route is now handled by the payment controller
// If you still have it here, it should be removed to avoid confusion.

router.route('/profile').get(protect, getArtistProfile).put(protect, updateArtistProfile);

export default router;