import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectToDB from "./Database/db.js";
import router from "./Routes/route.js";
import { fileURLToPath } from "url"; 

dotenv.config();

const app = express();

// Convert __dirname from ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN
    : process.env.LOCAL_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to the database
connectToDB();

// API routes
app.use("/api/auth", router);

// Serve uploads (for file storage)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Uploads directory path:", uploadsPath);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const CLIENT_BUILD_PATH = path.join(__dirname, "..", "Client", "dist");
  console.log(`Serving static files from: ${CLIENT_BUILD_PATH}`);

  app.use(express.static(CLIENT_BUILD_PATH));

  // Fix React Router issue by always serving index.html for unknown frontend routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend is running. React app is served by the development server.");
  });
}


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});

export default app;
