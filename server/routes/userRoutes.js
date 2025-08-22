// server/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { authUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

// This is the route for your admin login
router.post('/login', authUser);

export default router;