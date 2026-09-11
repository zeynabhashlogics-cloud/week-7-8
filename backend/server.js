import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "FRONTEND_URL"];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}
dotenv.config();
import authRoutes from "./route/authRoutes.js";
import taskRoutes from "./route/tasks.js";
const app = express();
app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({
    message: "health works",
  });
});


app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});