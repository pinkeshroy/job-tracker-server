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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Job Tracker API is live!",
    endpoints: {
      auth: "/api/auth",
      jobs: "/api/job",
    },
    docs: "Refer to the README.md or API docs for more details.",
  });
});

export default app;
