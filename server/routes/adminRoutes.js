// server/routes/adminRoutes.js
import express from 'express';
import {
  loginAdmin,
  getPendingArtists,
  approveArtist,
  rejectArtist,
} from '../controllers/adminController.js';
import adminProtect from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public route for admin login
router.post('/login', loginAdmin);

// Protected routes - only a logged-in admin can access these
router.get('/artists/pending', adminProtect, getPendingArtists);
router.put('/artists/:id/approve', adminProtect, approveArtist);
router.delete('/artists/:id', adminProtect, rejectArtist);

export default router;