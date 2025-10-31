import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};
app.use(cors(corsOptions));

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // limit each IP to 200 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting only in production
if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
}

// Welcome route
app.get("/", (req, res) => res.send("Online Quiz Application API - Phase 4"));

// Demo quiz route
app.get("/api/quiz/demo", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "demo",
      title: "Demo Quiz",
      description: "A quick demo quiz to test the system",
      timeLimitMinutes: 5,
      questions: [
        {
          question: "What is React?",
          options: [
            "A JavaScript library for building user interfaces",
            "A programming language",
            "A database system",
            "A web server"
          ],
          correctAnswer: 0,
          marks: 2
        },
        {
          question: "Which hook is used for side effects in React?",
          options: [
            "useState",
            "useEffect",
            "useContext",
            "useReducer"
          ],
          correctAnswer: 1,
          marks: 2
        },
        {
          question: "What does JSX stand for?",
          options: [
            "JavaScript XML",
            "Java Syntax Extension",
            "JavaScript Extension",
            "Java XML"
          ],
          correctAnswer: 0,
          marks: 2
        }
      ]
    }
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get port from environment variables or use default
    const port = process.env.PORT || 5000;
    
    // Start listening on the specified port
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`MongoDB Connected successfully`);
      console.log(`Frontend URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
