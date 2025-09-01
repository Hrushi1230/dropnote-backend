import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { secureDemoRouter } from "./routes/secure-demo";
import { notesRouter } from "./routes/notes";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/auth",authRouter);
app.use("/api/secure-demo",secureDemoRouter);
app.use("/api/notes", notesRouter);

export default app;
