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

// === STATIC ROUTES (MUST BE FIRST) ===
router.post('/register', upload.single('profilePicture'), registerArtist);
router.post('/login', loginArtist);
router.get('/vote', getArtistsForVoting);
router.get('/leaderboard', getLeaderboard);

// Fixed: Moved /profile ABOVE /:id so "profile" isn't treated as an ID
router.route('/profile')
  .get(protect, getArtistProfile)
  .put(protect, updateArtistProfile);

// === DYNAMIC ROUTES (MUST BE LAST) ===
// Ensure there is NO SPACE after the colon here: '/:id'
router.get('/:id', getArtistById);
router.post('/:id/hand-vote', addHandVote); 

export default router;