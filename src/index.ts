import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "DropNote Backend" });
});

app.listen(PORT, () => {
  console.log(`🚀 DropNote backend running on http://localhost:${PORT}`);
});
