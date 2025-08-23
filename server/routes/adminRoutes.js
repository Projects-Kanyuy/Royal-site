// server/routes/adminRoutes.js
import express from 'express';
const router = express.Router();
import { getAllArtistsForAdmin, addHandVotesToArtist } from '../controllers/adminController.js';

// --- CORRECTED IMPORTS ---
import protect from '../middleware/authMiddleware.js'; // Import the new universal 'protect'
import { admin } from '../middleware/adminMiddleware.js'; // Import the 'admin' check

// The flow is now:
// 1. 'protect' runs, verifies the token, and attaches req.user.
// 2. 'admin' runs, checks if req.user.isAdmin is true.
// 3. If both pass, the controller function runs.

router.get('/artists', protect, admin, getAllArtistsForAdmin);
router.put('/artists/:id/add-hand-votes', protect, admin, addHandVotesToArtist);

export default router;