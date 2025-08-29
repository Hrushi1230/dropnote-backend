// src/tools/redisCheck.ts
import { redis } from "../config/redis";

async function main() {
  try {
    const pong = await redis.ping();
    console.log("PING =>", pong);
    await redis.set("dropnote:test", "ok", "EX", 10);
    const v = await redis.get("dropnote:test");
    console.log("GET dropnote:test =>", v);
    process.exit(0);
  } catch (e: any) {
    console.error("Redis check failed:", e.message);
    process.exit(1);
  }
}
main();
