// server/routes/adminRoutes.js
import express from 'express';
const router = express.Router();
import { getAllArtistsForAdmin, addFinancialVotesToArtist } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

router.get('/artists', protect, admin, getAllArtistsForAdmin);
router.put('/artists/:id/add-financial-votes', protect, admin, addFinancialVotesToArtist);

export default router;