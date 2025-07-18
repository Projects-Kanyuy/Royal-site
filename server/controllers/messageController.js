// server/controllers/messageController.js
import Message from '../models/Message.js';

/**
 * @desc    Submit a contact form message
 * @route   POST /api/messages
 * @access  Public
 */
export const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create a new message document in the database
    await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('CONTACT FORM SUBMISSION ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error: Could not send message.' });
  }
};