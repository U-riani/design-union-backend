const express = require('express');
const { loginAdmin, getAdminDashboard } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin login route
router.post('/login', loginAdmin);

// Protected admin route
router.get('/dashboard', authenticateToken, getAdminDashboard);

module.exports = router;
