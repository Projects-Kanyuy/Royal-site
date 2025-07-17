// server/middlewares/adminAuthMiddleware.js
import jwt from 'jsonwebtoken';

const adminProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Use the specific ADMIN JWT secret to verify
      jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default adminProtect;