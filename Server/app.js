// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import connectToDB from './Database/db.js';
import router from './Routes/route.js';

dotenv.config();

const app = express();
// Default to 5173 if LOCAL_ORIGIN is not set

    app.use(cors({
            origin: process.env.NODE_ENV === 'production'
              ? process.env.CORS_ORIGIN
              : process.env.LOCAL_ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
          }))
app.use(express.json());
app.use(cookieParser());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

connectToDB();

app.use('/api/auth', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;