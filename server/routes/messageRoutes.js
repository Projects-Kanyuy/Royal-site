// server/routes/messageRoutes.js
import express from 'express';
import { submitContactForm } from '../controllers/messageController.js';

const router = express.Router();

// When a POST request is made to the root of this route (/api/messages),
// it will be handled by the submitContactForm controller.
router.route('/').post(submitContactForm);

export default router;