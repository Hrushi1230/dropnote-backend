import mongoose from "mongoose";
import { redis } from "../src/config/redis";

// Increase default timeout for slow networks
jest.setTimeout(30000);

afterAll(async () => {
  try {
    if (mongoose.connection.readyState) {
      // If you drop the DB inside tests, do it in each suite;
      // here we just close the connection.
      await mongoose.connection.close();
    }
  } catch {}

  try {
    await redis.quit();
  } catch {}
});
