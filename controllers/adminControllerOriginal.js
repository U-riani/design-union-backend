// const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcrypt');

// const adminUsername = process.env.ADMIN_USERNAME;
// const adminPassword = process.env.ADMIN_PASSWORD; 
// const jwtSecret = process.env.JWT_SECRET;

// // Admin login function
// const loginAdmin = async (req, res) => {
//   const { username, password } = req.body;

//   // Validate username and password
//   if (username === adminUsername && password === adminPassword) {
//     // Generate JWT token
//     const token = jwt.sign({ username }, jwtSecret, { expiresIn: '6000000ms' });
//     res.json({ message: 'Login successful', token });
//   } else {
//     res.status(403).json({ message: 'Invalid credentials' });
//   }
// };

// // Admin dashboard (protected route)
// const getAdminDashboard = (req, res) => {
//   res.json({ message: `Welcome, ${req.user.username}. You have admin access!` });
// };

// module.exports = { loginAdmin, getAdminDashboard };
