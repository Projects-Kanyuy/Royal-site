// server/routes/adminRoutes.js
import express from 'express';
const router = express.Router();
import { getAllArtistsForAdmin, addHandVotesToArtist } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

// All routes in this file are protected and require the user to be an admin.

// GET /api/admin/artists -> Get a list of all artists
router.get('/artists', protect, admin, getAllArtistsForAdmin);

// PUT /api/admin/artists/:id/add-hand-votes -> Add hand votes to a specific artist
router.put('/artists/:id/add-hand-votes', protect, admin, addHandVotesToArtist);

export default router;