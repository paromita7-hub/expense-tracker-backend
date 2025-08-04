// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Check if there's a token in headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Let the user proceed
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
};

module.exports = protect;
