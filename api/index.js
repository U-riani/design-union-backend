require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import route handlers
const adminRoutes = require("../routes/adminRoutes"); // Admin routes
const newsRoutes = require("../routes/newsRoutes"); // News routes
const aboutUsRoutes = require("../routes/aboutUsRoutes"); // AboutUs routes
const imageRouter = require("../routes/imageRouter"); // Image routes
const visitRoutes = require("../routes/visitRoutes");
const heroRoutes = require("../routes/heroRoutes");
const partnersRoutes = require("../routes/partnersRoutes");
const designersRoutes = require("../routes/designersRoutes");
const projectsRoutes = require("../routes/projectsRoutes");
const projectsDescriptionRoutes = require("../routes/projectsDescriptionRoutes");
const projectsContentRoutes = require("../routes/projectsContentRotes");

// Initialize Express app
const app = express();

// Middleware
// app.use(cors()); // Enable CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://design-union.netlify.app",
  "https://design-lab.ge",
  "https://ohmenergy.ge",
  "https://zpm.znt.temporary.site",
  "https://designersunion.ge",
  "http://designersunion.ge",
  "http://www.designersunion.ge",
  "https://www.designersunion.ge",
  "https://designersunion.ge"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PATCH,DELETE",
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://design-union.netlify.app", "https://design-lab.ge", "https://ohmenergy.ge", "https://zpm.znt.temporary.site", "https://designersunion.ge", "http://designersunion.ge", "http://www.designersunion.ge", "https://www.designersunion.ge", "http://www.designersunion.ge/"], // Update this to your frontend URL when deploying
//     methods: "GET,POST,PATCH,DELETE",
//     credentials: true, // Optional, for including cookies or auth headers
//   })
// );
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(helmet()); // Secure app by setting HTTP headers
app.use(morgan("combined")); // Log requests

// Serve static files from the uploads folder
app.use("/uploads", express.static("uploads"));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.set("trust proxy", 1); // Trust the first proxy

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://sandropapiashvili97:Microlab1@cluster0.wuxg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // Replace with .env variable for production
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/api", newsRoutes); // News routes
app.use("/api/aboutUs", aboutUsRoutes); // News routes
app.use("/api/visit", visitRoutes);
app.use("/api/heros", heroRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/designers", designersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/projects", projectsDescriptionRoutes);
app.use("/api/projects/content", projectsContentRoutes);
// app.use('/api', imageRouter); // Uncomment if using image routes

// Default route to check server status
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Export app for deployment
module.exports = app;

// Graceful shutdown (optional, mainly for local use)
process.on("SIGTERM", () => {
  console.log("Server terminating");
});
