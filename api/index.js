require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import route handlers
const adminRoutes = require('../routes/adminRoutes'); // Admin routes
const newsRoutes = require('../routes/newsRoutes');   // News routes
const imageRouter = require('../routes/imageRouter'); // Image routes

// Initialize Express app
const app = express();

// Middleware
// app.use(cors()); // Enable CORS
app.use(cors({
  origin: '*', // or '*' for all origins, but be cautious
  methods: 'GET,POST,PATCH,DELETE',
  credentials: true // optional, if you need to include cookies or auth headers
}));
app.use(helmet()); // Secure app by setting HTTP headers
app.use(morgan('combined')); // Log requests
app.use(express.json()); // Parse JSON bodies

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://sandropapiashvili97:Microlab1@cluster0.wuxg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // Replace with .env variable for production
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/admin', adminRoutes); // Admin routes
app.use('/api', newsRoutes);    // News routes
// app.use('/api', imageRouter); // Uncomment if using image routes

// Default route to check server status
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Export app for deployment
module.exports = app;

// Graceful shutdown (optional, mainly for local use)
process.on('SIGTERM', () => {
  console.log('Server terminating');
});
