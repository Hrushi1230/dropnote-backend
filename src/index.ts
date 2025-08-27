import app from "./app";
import { ENV } from "./config/env";

const start = async () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log(`🚀 DropNote backend running on http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
