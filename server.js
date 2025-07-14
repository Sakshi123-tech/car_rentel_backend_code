import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// ✅ List of allowed frontend origins
const allowedOrigins = [
  'https://car-rentel-user.vercel.app',
  'https://car-rentel-frontend-user-code.vercel.app',
  'https://car-rentel-frontend-code.vercel.app', // ✅ Your current frontend domain
  'http://localhost:3000',
  'http://localhost:8000'
];

// ✅ Start Server Function
const startServer = async () => {
  const app = express();

  // ✅ Enable CORS with dynamic origin checking
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`❌ CORS blocked: ${origin} is not allowed`));
      }
    },
    credentials: true
  }));

  // ✅ Body Parser
  app.use(express.json());

  // ✅ Connect to MongoDB
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }

  // ✅ Routes
  app.get("/", (req, res) => res.send("🚗 Car Rental Backend is running"));
  app.use("/api/user", userRouter);
  app.use("/api/owner", ownerRouter);
  app.use("/api/bookings", bookingRouter);

  // ✅ Start Express server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// ✅ Launch the server
startServer();
