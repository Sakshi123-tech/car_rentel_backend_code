import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const allowedOrigins = [
  'https://car-rentel-user.vercel.app',
  
  'https://car-rentel-backend-code.vercel.app',
  'http://localhost:3000',
  'http://localhost:8000'
];

// ✅ Wrap everything inside an async function
const startServer = async () => {
  const app = express();

  // Middleware: CORS
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  // Middleware: Body parser
  app.use(express.json());

  // Connect to MongoDB
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1); // Exit on failure
  }

  // Routes
  app.get("/", (req, res) => res.send("✅ Server is running"));
  app.use("/api/user", userRouter);
  app.use("/api/owner", ownerRouter);
  app.use("/api/bookings", bookingRouter);

  // Start server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// ✅ Call the async function to start the server
startServer();
