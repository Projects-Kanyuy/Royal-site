// server/middlewares/adminMiddleware.js
const admin = (req, res, next) => {
  // This middleware should run AFTER the 'protect' middleware.
  // 'protect' will add the user object to the request (req.user).
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed to the next function.
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { admin };