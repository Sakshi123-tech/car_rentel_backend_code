import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const allowedOrigins = [
  'https://car-rentel-user.vercel.app', // ✅ Actual frontend URL
  'https://car-rentel-frontend-user-code.vercel.app', // ✅ Add this too (from your error)
  'http://localhost:3000', // For local dev
  'http://localhost:8000'
];

const startServer = async () => {
  const app = express();

  // ✅ Enable CORS
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`❌ CORS blocked: ${origin} is not allowed`));
      }
    },
    credentials: true
  }));

  // ✅ Body parser
  app.use(express.json());

  // ✅ Connect to DB
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }

  // ✅ Routes
  app.get("/", (req, res) => res.send("✅ Server is running"));
  app.use("/api/user", userRouter);
  app.use("/api/owner", ownerRouter);
  app.use("/api/bookings", bookingRouter);

  // ✅ Start Server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
