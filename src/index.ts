
import app from "./app";
import { ENV } from "./config/env";
import { connectMongo } from "./config/db";
import "./config/redis";

const start = async () => {
  try {
    await connectMongo();
    app.listen(ENV.PORT, () => {
      console.log(`🚀 DropNote backend running on http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
