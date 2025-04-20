import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { authenticate } from "./middleware/authenticate.js";
const app = express();

app.use(
  cors({
    origin: ["https://job-tracker-one-bay.vercel.app"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/job", authenticate, jobRoutes);

export default app;
