// server/controllers/userController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user (admin or artist) & get token
// @route   POST /api/users/login
export const authUser = async (req, res) => {
  // This line is now corrected with '=' instead of 'of'
  const { email, password } = req.body; 
  
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};