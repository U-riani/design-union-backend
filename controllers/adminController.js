const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const adminUsername = admin;
const adminPassword = yourpassword; 
const jwtSecret = your_jwt_secret;

// Admin login function
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  if (username === adminUsername && password === adminPassword) {
    // Generate JWT token
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '6000000ms' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(403).json({ message: 'Invalid credentials' });
  }
};

// Admin dashboard (protected route)
const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}. You have admin access!` });
};

module.exports = { loginAdmin, getAdminDashboard };
