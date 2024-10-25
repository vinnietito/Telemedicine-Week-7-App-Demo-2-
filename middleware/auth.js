// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to check if the user is an admin
exports.authAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.user = decoded; // Attach decoded token to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or missing token' });
  }
};

// Middleware to authenticate any token
exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = { patientId: user.patientId }; // Use patientId if it's in the JWT payload
    next();
  });
};
