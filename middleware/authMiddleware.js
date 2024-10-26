const jwt = require('jsonwebtoken');
const jwtSecret = `your_jwt_secret`;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token.split(" ")[1], jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

module.exports = { authenticateToken };
