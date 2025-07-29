// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import artistRoutes from "./routes/artistRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- CORS CONFIGURATION ---
// This explicitly tells the server to accept requests from your React app.
const corsOptions = {
  origin: ["http://localhost:3000", "https://royalcitysnack.site"], // The address of your React frontend
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

app.use("/api/artists", artistRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handling Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
