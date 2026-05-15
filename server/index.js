import express from "express";
import cors from "cors";
import studentRoute from "./routes/student_route.js";
import adminRoute from "./routes/admin_route.js";
// import recruiterRoute from './routes/recruiters_route.js';
import jobRoute from "./routes/job_route.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://cgcstudents.vercel.app', // Replace with your frontend origin
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 8000;

import db from "./db.js";
import cookieParser from "cookie-parser";

app.use("/student", studentRoute);
app.use("/admin", adminRoute);
// app.use('/recruiter', recruiterRoute);
app.use("/job", jobRoute);

// ── Keep-alive ping endpoint ──────────────────────────────────────────────────
// Render's free tier shuts down after 15 min of inactivity.
// The frontend calls this every 14 min so the server stays warm.
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is awake 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
