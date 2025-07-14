// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const morgan = require("morgan");
// require("dotenv").config();
// const cors = require("cors");
// const helmet = require("helmet");
// const compression = require("compression");
// const path = require("path")

// mongoose
//   .connect(process.env.DB)
//   .then(() => console.log("Database Connected........."))
//   .catch((err) => console.log("Database Not Connected !!!"));

// const PORT = process.env.PORT || 8774;

// const Admin = require("./Routes/Admin/Admin");
// const Teacher = require("./Routes/Teacher/Teacher");
// const Board = require("./Routes/Admin/Board");
// const Medium = require("./Routes/Admin/Medium");
// const ExamanationOfName = require("./Routes/Admin/NameOfExamination");
// const CLASS = require("./Routes/Admin/CLASS");
// const SubCLASS = require("./Routes/Admin/SubClass");
// const Subject = require("./Routes/Admin/Subject");
// const PaperType = require("./Routes/Admin/PaperType");
// const BluePrint = require("./Routes/Admin/BluePrint");
// const Question = require("./Routes/Admin/QuestionPaper");
// const OTP = require("./Routes/Teacher/Otp");
// const ExamLevel = require("./Routes/Admin/AdminExamlevel");
// const TypesofQuestions = require("./Routes/Admin/Typesofquestions");

// const weightageofcongtent=require('./Routes/Admin/Weighttageofthecontent')
// const Chapter = require("./Routes/Admin/Chapter");
// const AccountHistory = require("./Routes/Admin/AccountHistory");
// const QuestionGen = require("./Routes/Teacher/GenrateQA");
// const SubAdmin = require("./Routes/Admin/SubAdmin");
// const Syllabus=require("./Routes/Admin/Syllabus");
// const Objectives = require("./Routes/Admin/Objectives")
// const Printer=require("./Routes/Printer/Printer");
// const UploadQuestionPDF = require("./Routes/Admin/UploadQuestion")
// const TypeOfQuestion = require("./Routes/Admin/QuestionType")
// const BluePrintHeader = require("./Routes/Admin/BluePrintHeader");
// const QuestionAnalysisHeader = require("./Routes/Admin/QuestionAnalysisHeader");
// const QuestionHeader = require("./Routes/Admin/QuestionHeader")
// const DifficultyLevel = require("./Routes/Admin/DifficultyLevel")
// const CoverPage = require("./Routes/Admin/CoverPage") 
// const phonepe = require('./Routes/Teacher/phonepeRoutes'); 
// const ResultSheet = require("./Routes/Admin/ResultSheetRoutes");   
// const PaymentReceiptRoute = require("./Routes/Admin/Email/paymentReceipt"); 
// const ResultSheetmanagementRoutes = require("./Routes/Admin/ResultSheetmanagementRoutes");

// app.use(express.json());
// app.use(morgan("dev"));
// app.use(cors());
// app.use(express.static("Public"));
// app.use(express.urlencoded({ extended: false }));
// app.use(helmet());
// app.use(compression());


// app.use("/api/admin",Syllabus);
// app.use("/api/admin", SubAdmin);
// app.use("/api/admin", AccountHistory);
// app.use("/api/teacher", QuestionGen);
// app.use("/api/otp", OTP);
// app.use("/api/admin", Question);
// app.use("/api/admin", BluePrint);
// app.use("/api/admin", PaperType);
// app.use("/api/admin", Subject);
// app.use("/api/admin", CLASS);
// app.use("/api/admin", Admin);
// app.use("/api/admin", Teacher);
// app.use("/api/admin", Board);
// app.use("/api/admin", Medium);
// app.use("/api/admin", ExamanationOfName);
// app.use("/api/admin", SubCLASS);
// app.use("/api/admin", ExamLevel);
// app.use("/api/admin",TypesofQuestions);
// // app.use("/api/admin",Chapters);
// app.use("/api/printer",Printer);

// app.use("/api/admin", weightageofcongtent);
// app.use("/api/admin", Chapter);
// app.use("/api/admin", Syllabus);
// app.use("/api/admin",Objectives);
// app.use("/api/admin",UploadQuestionPDF);
// app.use("/api/admin",TypeOfQuestion);
// app.use("/api/admin",BluePrintHeader);
// app.use("/api/admin",QuestionAnalysisHeader);
// app.use("/api/admin",QuestionHeader)
// app.use("/api/admin",DifficultyLevel);
// app.use("/api/admin",CoverPage); 
// app.use("/api/Teacher", phonepe);   
// app.use("/api/ResultSheet",ResultSheet)
// app.use("/api/admin",PaymentReceiptRoute);   
// app.use("/api/admin",ResultSheetmanagementRoutes);


// app.use(express.static(path.join(__dirname, 'build'))); // Change 'build' to your frontend folder if needed

// // Redirect all requests to the index.html file

// app.get("*", (req, res) => {
//   return  res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// // app.get("/", (req, res) => {
// //   res.send("Welcome to Guru Resource Management!");
// // });

// // app.all("*", function (req, res) {
// //   throw new Error("Bad request");
// // });

// // app.use(function (e, req, res, next) {
// //   if (e.message === "Bad request") {
// //     res.status(400).send({ status: false, error: e.message });
// //   }
// // });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const path = require("path");
require("dotenv").config();

const app = express();

// Trust proxy for rate limiting behind load balancer
app.set('trust proxy', 1);

// MongoDB Connection with security options
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Database Connected........."))
  .catch((err) => {
    console.error("❌ Database Not Connected !!!", err.message);
    process.exit(1);
  });

// Enhanced Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// Enhanced CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://65.0.21.122:8774',
      'http://65.0.21.122:8774',
      'https://localhost:3000',
      'http://localhost:3000',
      'https://127.0.0.1:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Rate Limiting Configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  }
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiting for additional protection
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per windowMs without delay
  delayMs: 500, // add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // max delay of 5 seconds
});

// Apply middlewares in correct order
app.use(compression());
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(speedLimiter);

// Body parsing with size limits and validation
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  }
}));

app.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb',
  parameterLimit: 100
}));

// Logging with security considerations
app.use(morgan('combined', {
  skip: (req, res) => {
    // Skip logging for health checks and static files
    return req.path === '/health' || req.path.startsWith('/static');
  }
}));

// Static files with security headers
app.use('/static', express.static('Public', {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache');
    }
  }
}));

// Remove unnecessary headers
app.disable("x-powered-by");

// Health check endpoint (before auth limiter)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Apply auth rate limiting to login/auth endpoints
app.use('/api/admin/*login*', authLimiter);
app.use('/api/teacher/*login*', authLimiter);
app.use('/api/otp', authLimiter);

// Route Imports
const Admin = require("./Routes/Admin/Admin");
const Teacher = require("./Routes/Teacher/Teacher");
const Board = require("./Routes/Admin/Board");
const Medium = require("./Routes/Admin/Medium");
const ExamanationOfName = require("./Routes/Admin/NameOfExamination");
const CLASS = require("./Routes/Admin/CLASS");
const SubCLASS = require("./Routes/Admin/SubClass");
const Subject = require("./Routes/Admin/Subject");
const PaperType = require("./Routes/Admin/PaperType");
const BluePrint = require("./Routes/Admin/BluePrint");
const Question = require("./Routes/Admin/QuestionPaper");
const OTP = require("./Routes/Teacher/Otp");
const ExamLevel = require("./Routes/Admin/AdminExamlevel");
const TypesofQuestions = require("./Routes/Admin/Typesofquestions");
const weightageofcongtent = require('./Routes/Admin/Weighttageofthecontent');
const Chapter = require("./Routes/Admin/Chapter");
const AccountHistory = require("./Routes/Admin/AccountHistory");
const QuestionGen = require("./Routes/Teacher/GenrateQA");
const SubAdmin = require("./Routes/Admin/SubAdmin");
const Syllabus = require("./Routes/Admin/Syllabus");
const Objectives = require("./Routes/Admin/Objectives");
const Printer = require("./Routes/Printer/Printer");
const UploadQuestionPDF = require("./Routes/Admin/UploadQuestion");
const TypeOfQuestion = require("./Routes/Admin/QuestionType");
const BluePrintHeader = require("./Routes/Admin/BluePrintHeader");
const QuestionAnalysisHeader = require("./Routes/Admin/QuestionAnalysisHeader");
const QuestionHeader = require("./Routes/Admin/QuestionHeader");
const DifficultyLevel = require("./Routes/Admin/DifficultyLevel");
const CoverPage = require("./Routes/Admin/CoverPage");
const phonepe = require('./Routes/Teacher/phonepeRoutes');
const ResultSheet = require("./Routes/Admin/ResultSheetRoutes");
const PaymentReceiptRoute = require("./Routes/Admin/Email/paymentReceipt");
const ResultSheetmanagementRoutes = require("./Routes/Admin/ResultSheetmanagementRoutes");

// API Routes with consistent prefix
app.use("/api/admin", Syllabus);
app.use("/api/admin", SubAdmin);
app.use("/api/admin", AccountHistory);
app.use("/api/teacher", QuestionGen);
app.use("/api/otp", OTP);
app.use("/api/admin", Question);
app.use("/api/admin", BluePrint);
app.use("/api/admin", PaperType);
app.use("/api/admin", Subject);
app.use("/api/admin", CLASS);
app.use("/api/admin", Admin);
app.use("/api/admin", Teacher);
app.use("/api/admin", Board);
app.use("/api/admin", Medium);
app.use("/api/admin", ExamanationOfName);
app.use("/api/admin", SubCLASS);
app.use("/api/admin", ExamLevel);
app.use("/api/admin", TypesofQuestions);
app.use("/api/printer", Printer);
app.use("/api/admin", weightageofcongtent);
app.use("/api/admin", Chapter);
app.use("/api/admin", Objectives);
app.use("/api/admin", UploadQuestionPDF);
app.use("/api/admin", TypeOfQuestion);
app.use("/api/admin", BluePrintHeader);
app.use("/api/admin", QuestionAnalysisHeader);
app.use("/api/admin", QuestionHeader);
app.use("/api/admin", DifficultyLevel);
app.use("/api/admin", CoverPage);
app.use("/api/teacher", phonepe);
app.use("/api/ResultSheet", ResultSheet);
app.use("/api/admin", PaymentReceiptRoute);
app.use("/api/admin", ResultSheetmanagementRoutes);

// Serve frontend build files
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache');
    }
  }
}));

// Catch-all handler for SPA routing
app.get("*", (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Server configuration
const PORT = process.env.PORT || 8774;
const NODE_ENV = process.env.NODE_ENV || 'development';

// SSL/HTTPS Configuration
let server;

if (NODE_ENV === 'production' && fs.existsSync('parikshashik.pem')) {
  try {
    const sslOptions = {
      key: fs.readFileSync("parikshashik.pem"),
      cert: fs.readFileSync("parikshashik.pem"), // You might need separate cert file
    };
    
    server = https.createServer(sslOptions, app);
    console.log(`🔒 HTTPS mode enabled`);
  } catch (error) {
    console.error('❌ SSL Certificate error:', error.message);
    console.log('📡 Falling back to HTTP mode');
    server = http.createServer(app);
  }
} else {
  server = http.createServer(app);
  console.log(`📡 HTTP mode enabled`);
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
  const protocol = server instanceof https.Server ? 'https' : 'http';
  console.log(`✅ Secure server running at ${protocol}://65.0.21.122:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔒 Security features: Rate limiting, CORS, Helmet, Compression`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📤 Received ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    console.log('🛑 HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('🛑 MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

module.exports = app;