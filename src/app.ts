import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as healthRouter } from "./routes/health";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/health", healthRouter);

export default app;
