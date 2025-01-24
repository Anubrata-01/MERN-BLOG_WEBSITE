import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectToDB from "./Database/db.js";
import router from "./Routes/route.js";
import { fileURLToPath } from 'url'; // Import fileURLToPath

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url); // Use fileURLToPath
const __dirname = path.dirname(__filename);

// Correct path for serving static files
const uploadsPath = path.join(__dirname, 'uploads');
console.log("Uploads directory path:", uploadsPath); // Verify path in console
app.use("/uploads", express.static(uploadsPath));

app.use(
    cors({
        origin: process.env.NODE_ENV === "production"
            ? process.env.CORS_ORIGIN
            : process.env.LOCAL_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use("/api/auth", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;