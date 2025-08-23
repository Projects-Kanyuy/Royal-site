// server/controllers/userController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth ADMIN & get token
// @route   POST /api/users/login
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  // We search the User collection
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // We return an object WITH the isAdmin field
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // This is crucial for the admin panel
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};