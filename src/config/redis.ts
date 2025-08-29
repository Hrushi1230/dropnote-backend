// src/config/redis.ts
import Redis, { RedisOptions } from "ioredis";
import { ENV } from "./env";

function fromUrl(url: string) {
  const u = new URL(url);
  const isTls = u.protocol === "rediss:";
  const opts: RedisOptions = isTls
    ? {
        tls: {
          servername: u.hostname,   // SNI required by Redis Cloud
          rejectUnauthorized: false // avoids local CA issues
        },
      }
    : {};
  return new Redis(url, opts);
}

export const redis = ENV.REDIS_URL
  ? fromUrl(ENV.REDIS_URL)
  : new Redis(); // fallback local (not used here)

redis.on("connect", () => console.log("✅ Redis socket connected"));
redis.on("ready",   () => console.log("✅ Redis auth OK (client ready)"));
redis.on("error",   (e) => console.error("❌ Redis error", e.message));
