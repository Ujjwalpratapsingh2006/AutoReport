import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routers.js";
const app=express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
})); //enables CORS for specific origins with credentials
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
export default app;